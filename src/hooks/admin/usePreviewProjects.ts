import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Tipo para um item de versão
export interface VersionItem {
  id: string;
  name: string;
  description?: string;
  dateAdded?: string;
  fileId?: string;
  recommended?: boolean;
  final?: boolean;
  audioUrl?: string;  // Adicionando propriedade audioUrl
  url?: string;      // Adicionando propriedade url para compatibilidade
  additionalLinks?: {
    label: string;
    url: string;
  }[];
}

// Interface para armazenar dados de um projeto de prévia
export interface PreviewProject {
  id: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  packageType?: string;
  createdAt: string;
  status: string; // 'waiting', 'feedback', 'approved'
  versions: number;
  previewUrl: string;
  expirationDate?: string;
  lastActivityDate?: string;
  versionsList?: VersionItem[];
  feedback?: string;
  history?: any[];
  useGoogleDrive?: boolean;
}

// Alias do tipo PreviewProject para manter compatibilidade
export type ProjectItem = PreviewProject;

// Mapear projetos baseado nos dados recebidos
const mapToProjects = (data: any[]): PreviewProject[] => {
  return data.map(item => ({
    id: item.id,
    clientName: item.client_name || 'Cliente',
    clientEmail: item.client_email,
    clientPhone: item.client_phone,
    packageType: item.package_type,
    createdAt: item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
    status: item.status || 'waiting',
    versions: item.versions || 0,
    previewUrl: `${window.location.origin}/preview/${item.id}`,
    expirationDate: item.expiration_date ? new Date(item.expiration_date).toLocaleDateString('pt-BR') : undefined,
    lastActivityDate: item.last_activity_date ? new Date(item.last_activity_date).toLocaleDateString('pt-BR') : undefined,
    versionsList: item.versions_list || [],
    feedback: item.feedback,
    history: item.history || [],
    useGoogleDrive: item.use_google_drive || false
  }));
};

// Mock data for development without backend
const mockProjects: PreviewProject[] = [
  {
    id: 'P0001',
    clientName: 'Humberto Manzoli',
    clientEmail: 'humberto@example.com',
    clientPhone: '(11) 98765-4321',
    packageType: 'Essencial',
    createdAt: '15/05/2025',
    status: 'waiting',
    versions: 0,
    previewUrl: `${window.location.origin}/preview/P0001`,
    expirationDate: '29/05/2025',
    lastActivityDate: '15/05/2025',
    versionsList: []
  }
];

export const usePreviewProjects = () => {
  const [projects, setProjects] = useState<PreviewProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Carregar projetos do Supabase
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    console.log('Carregando projetos de prévia...');
    
    try {
      // Tenta buscar dados do Supabase
      const { data: projectsData, error } = await supabase
        .from('preview_projects')
        .select('*')
        .order('last_activity_date', { ascending: false });
        
      if (error) {
        console.error('Erro ao carregar projetos do Supabase:', error);
        throw error;
      }
      
      // Buscar versões dos projetos
      const projectsWithVersions = await Promise.all((projectsData || []).map(async (project) => {
        try {
          const { data: versionsData, error: versionsError } = await supabase
            .from('project_versions')
            .select('*')
            .eq('project_id', project.id)
            .order('created_at', { ascending: false });
            
          if (versionsError) {
            console.error(`Erro ao carregar versões para o projeto ${project.id}:`, versionsError);
            return {
              ...project,
              versions: 0,
              versions_list: []
            };
          }
          
          // Mapear dados das versões
          const versionsList = (versionsData || []).map(v => ({
            id: v.version_id,
            name: v.name,
            description: v.description,
            dateAdded: new Date(v.created_at).toLocaleDateString('pt-BR'),
            fileId: v.file_id,
            recommended: v.recommended
          }));
          
          return {
            ...project,
            versions: versionsList.length,
            versions_list: versionsList
          };
        } catch (err) {
          console.error(`Erro ao processar versões para o projeto ${project.id}:`, err);
          return project;
        }
      }));
      
      // Buscar histórico dos projetos
      const projectsWithHistory = await Promise.all(projectsWithVersions.map(async (project) => {
        try {
          const { data: historyData, error: historyError } = await supabase
            .from('project_history')
            .select('*')
            .eq('project_id', project.id)
            .order('created_at', { ascending: false });
            
          if (historyError) {
            console.error(`Erro ao carregar histórico para o projeto ${project.id}:`, historyError);
            return {
              ...project,
              history: []
            };
          }
          
          return {
            ...project,
            history: historyData || []
          };
        } catch (err) {
          console.error(`Erro ao processar histórico para o projeto ${project.id}:`, err);
          return project;
        }
      }));
      
      // Se não encontrar dados ou ocorrer erro, usa dados mock
      if (!projectsWithHistory || projectsWithHistory.length === 0) {
        console.log('Nenhum dado encontrado, usando dados mock');
        setProjects(mockProjects);
      } else {
        console.log(`${projectsWithHistory.length} projetos carregados do Supabase`);
        const mappedProjects = mapToProjects(projectsWithHistory);
        setProjects(mappedProjects);
      }
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      setProjects(mockProjects);
    } finally {
      setIsLoading(false);
    }
    
    return projects;
  }, []);

  // Carregar projetos ao montar o componente
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Obter projeto por ID
  const getProjectById = (id: string) => {
    console.log(`Buscando projeto com ID: ${id}`);
    console.log('Projetos disponíveis:', projects.map(p => p.id).join(', '));
    return projects.find(project => project.id === id);
  };

  // Adicionar um novo projeto
  const addProject = async (projectData: Partial<PreviewProject>) => {
    try {
      console.log('Adicionando novo projeto:', projectData);
      
      // Formatação para o Supabase
      const supabaseData = {
        id: projectData.id,
        client_name: projectData.clientName,
        client_email: projectData.clientEmail,
        client_phone: projectData.clientPhone,
        package_type: projectData.packageType,
        project_title: projectData.packageType || 'Música Personalizada',
        status: projectData.status || 'waiting',
        created_at: new Date().toISOString(),
        last_activity_date: new Date().toISOString(),
        expiration_date: projectData.expirationDate ? new Date(projectData.expirationDate).toISOString() : 
          new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 dias
      };
      
      // Adicionar ao Supabase
      const { data, error } = await supabase
        .from('preview_projects')
        .upsert(supabaseData)
        .select();
        
      if (error) {
        console.error('Erro ao adicionar projeto ao Supabase:', error);
        throw error;
      }
      
      console.log('Projeto adicionado com sucesso:', data);
      
      // Adicionar ao histórico
      await supabase
        .from('project_history')
        .insert({
          project_id: projectData.id,
          action: 'Projeto criado',
          details: {
            message: 'Projeto de prévia criado'
          }
        });
      
      // Atualizar lista local
      await loadProjects();
      
      return data?.[0]?.id;
    } catch (error) {
      console.error('Erro ao adicionar projeto:', error);
      
      // Adicionar localmente apenas em caso de erro (fallback)
      const newProject: PreviewProject = {
        id: projectData.id || `P${Date.now().toString().substring(6)}`,
        clientName: projectData.clientName || 'Novo Cliente',
        clientEmail: projectData.clientEmail,
        clientPhone: projectData.clientPhone,
        packageType: projectData.packageType,
        createdAt: new Date().toLocaleDateString('pt-BR'),
        status: projectData.status || 'waiting',
        versions: 0,
        previewUrl: `${window.location.origin}/preview/${projectData.id}`,
        expirationDate: projectData.expirationDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        lastActivityDate: new Date().toLocaleDateString('pt-BR'),
        versionsList: [],
        history: [{
          action: 'Projeto criado',
          timestamp: new Date().toLocaleString('pt-BR'),
          data: {
            message: 'Projeto de prévia criado'
          }
        }]
      };
      
      setProjects(prev => [...prev, newProject]);
      return newProject.id;
    }
  };

  // Atualizar um projeto existente
  const updateProject = async (id: string, updates: Partial<any>) => {
    try {
      console.log(`Atualizando projeto ${id}:`, updates);
      
      // Formatar para o Supabase
      const supabaseUpdates: any = {};
      
      if (updates.status) supabaseUpdates.status = updates.status;
      if (updates.feedback) supabaseUpdates.feedback = updates.feedback;
      if (updates.lastActivityDate) supabaseUpdates.last_activity_date = new Date().toISOString();
      
      // Enviar atualização para o Supabase
      if (Object.keys(supabaseUpdates).length > 0) {
        const { error } = await supabase
          .from('preview_projects')
          .update(supabaseUpdates)
          .eq('id', id);
          
        if (error) {
          console.error(`Erro ao atualizar projeto ${id} no Supabase:`, error);
          throw error;
        }
      }
      
      // Adicionar entrada ao histórico, se fornecido
      if (updates.history && updates.history.length > 0) {
        const latestEntry = updates.history[0];
        
        await supabase
          .from('project_history')
          .insert({
            project_id: id,
            action: latestEntry.action,
            details: latestEntry.data || {}
          });
      }
      
      // Atualizar a lista local
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === id 
            ? { 
                ...project, 
                ...updates,
                status: updates.status || project.status,
                feedback: updates.feedback || project.feedback,
                lastActivityDate: updates.lastActivityDate || new Date().toLocaleDateString('pt-BR'),
                versionsList: updates.versionsList || project.versionsList,
                history: updates.history 
                  ? [...(updates.history || []), ...(project.history || [])]
                  : project.history
              } 
            : project
        )
      );
      
      // Recarregar projetos para sincronizar
      loadProjects();
      
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar projeto ${id}:`, error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o projeto no servidor, mas as alterações foram salvas localmente.",
        variant: "destructive"
      });
      
      // Atualizar apenas localmente em caso de erro
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === id 
            ? { ...project, ...updates } 
            : project
        )
      );
      
      return false;
    }
  };

  // Excluir um projeto
  const deleteProject = async (id: string) => {
    try {
      console.log(`Excluindo projeto ${id}`);
      
      // Excluir do Supabase
      const { error } = await supabase
        .from('preview_projects')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error(`Erro ao excluir projeto ${id} do Supabase:`, error);
        throw error;
      }
      
      // Também excluir versões associadas
      await supabase
        .from('project_versions')
        .delete()
        .eq('project_id', id);
        
      // Excluir tokens associados
      await supabase
        .from('preview_tokens')
        .delete()
        .eq('preview_id', id);
        
      // Excluir histórico
      await supabase
        .from('project_history')
        .delete()
        .eq('project_id', id);
      
      // Atualizar lista local
      setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
      
      toast({
        title: "Projeto excluído",
        description: "O projeto foi excluído com sucesso."
      });
      
      return true;
    } catch (error) {
      console.error(`Erro ao excluir projeto ${id}:`, error);
      
      // Excluir localmente em caso de erro
      setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
      
      toast({
        title: "Aviso",
        description: "O projeto foi excluído localmente, mas pode haver um erro no servidor.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  return {
    projects,
    isLoading,
    loadProjects,
    getProjectById,
    addProject,
    updateProject,
    deleteProject
  };
};
