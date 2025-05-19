
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import ProjectHeader from '@/components/admin/previews/ProjectHeader';
import PreviewVersionsList from '@/components/admin/previews/PreviewVersionsList';
import ProjectClientInfo from '@/components/admin/previews/ProjectClientInfo';
import ProjectActionCard from '@/components/admin/previews/ProjectActionCard';
import ProjectHistoryList from '@/components/admin/previews/ProjectHistoryList';
import { useParams } from 'react-router-dom';
import { usePreviewProjects, VersionItem } from '@/hooks/admin/usePreviewProjects';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const PreviewProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProjectById, fetchProjectById, updateProject } = usePreviewProjects();
  const { toast } = useToast();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }
      
      // Try to get from cache first
      let projectData = getProjectById(projectId);
      
      // If not in cache, fetch from Supabase
      if (!projectData) {
        projectData = await fetchProjectById(projectId);
      }
      
      setProject(projectData);
      setIsLoading(false);
    };
    
    loadProject();
  }, [projectId, getProjectById, fetchProjectById]);
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-10 w-10 animate-spin text-harmonia-green" />
          <span className="ml-2 text-lg">Carregando projeto...</span>
        </div>
      </AdminLayout>
    );
  }
  
  if (!project) {
    return (
      <AdminLayout>
        <Card className="p-6">
          <p className="text-center text-gray-500">Projeto não encontrado</p>
        </Card>
      </AdminLayout>
    );
  }
  
  const handleAddVersion = (newVersion: VersionItem) => {
    if (!projectId) return;
    
    const currentVersions = project.versionsList || [];
    
    // Se a nova versão for marcada como final, adiciona um indicador
    const isFinalVersion = newVersion.final === true;
    const versionTitle = isFinalVersion ? `FINAL - ${newVersion.name}` : newVersion.name;
    
    const versionToAdd = {
      ...newVersion,
      name: versionTitle
    };
    
    // If the new version is marked as recommended, remove recommended from others
    let updatedVersions = currentVersions;
    if (newVersion.recommended) {
      updatedVersions = currentVersions.map(v => ({
        ...v,
        recommended: false
      }));
    }
    
    // Add the new version
    updatedVersions = [...updatedVersions, versionToAdd];
    
    // Update history
    const historyAction = isFinalVersion 
      ? `Versão final adicionada: ${versionTitle}` 
      : `Nova versão adicionada: ${versionTitle}`;
      
    const historyEntry = {
      action: historyAction,
      timestamp: new Date().toLocaleString('pt-BR'),
      data: {
        message: newVersion.description || 'Sem descrição'
      }
    };
    
    const history = [...(project.history || []), historyEntry];
    
    // Update project
    updateProject(projectId, {
      versionsList: updatedVersions,
      versions: updatedVersions.length,
      history,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    // Update local state
    setProject({
      ...project,
      versionsList: updatedVersions,
      versions: updatedVersions.length,
      history,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    toast({
      title: isFinalVersion ? "Versão final adicionada" : "Versão adicionada",
      description: `${versionTitle} foi adicionada ao projeto com sucesso.`
    });
  };
  
  const handleExtendDeadline = () => {
    if (!projectId) return;
    
    // Calculate new expiration date (current + 7 days)
    const currentDate = project.expirationDate 
      ? new Date(project.expirationDate.split('/').reverse().join('-')) 
      : new Date();
      
    currentDate.setDate(currentDate.getDate() + 7);
    const newExpirationDate = currentDate.toLocaleDateString('pt-BR');
    
    // Add history entry
    const historyEntry = {
      action: "Prazo estendido",
      timestamp: new Date().toLocaleString('pt-BR'),
      data: {
        message: `Prazo estendido por +7 dias. Nova data de expiração: ${newExpirationDate}`
      }
    };
    
    const history = [...(project.history || []), historyEntry];
    
    // Update project
    updateProject(projectId, {
      expirationDate: newExpirationDate,
      history,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    // Update local state
    setProject({
      ...project,
      expirationDate: newExpirationDate,
      history,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    toast({
      title: "Prazo estendido",
      description: `O prazo foi estendido por +7 dias. Nova data: ${newExpirationDate}`
    });
  };

  // Function to handle version deletion
  const handleDeleteVersion = (versionId: string) => {
    if (!projectId) return;
    
    const currentVersions = project.versionsList || [];
    const versionToDelete = currentVersions.find(v => v.id === versionId);
    
    if (!versionToDelete) return;
    
    const updatedVersions = currentVersions.filter(v => v.id !== versionId);
    
    // Add history entry
    const historyEntry = {
      action: `Versão removida: ${versionToDelete.name}`,
      timestamp: new Date().toLocaleString('pt-BR'),
      data: {
        message: `A versão "${versionToDelete.name}" foi removida do projeto.`
      }
    };
    
    const history = [...(project.history || []), historyEntry];
    
    // Update project
    updateProject(projectId, {
      versionsList: updatedVersions,
      versions: updatedVersions.length,
      history,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    // Update local state
    setProject({
      ...project,
      versionsList: updatedVersions,
      versions: updatedVersions.length,
      history,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    toast({
      title: "Versão removida",
      description: `${versionToDelete.name} foi removida com sucesso.`
    });
  };
  
  // Format package type with capitalized first letter
  const formatPackageType = (packageType: string): string => {
    if (!packageType) return "Projeto de Música Personalizada";
    
    // Split by spaces and capitalize first letter of each word
    return packageType.split(' ').map(word => {
      if (word.toLowerCase() === 'essencial' || 
          word.toLowerCase() === 'premium' || 
          word.toLowerCase() === 'profissional') {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word;
    }).join(' ');
  };
  
  // Gera o link de prévia para o cliente
  const previewUrl = `/preview/${projectId}`;
  
  return (
    <AdminLayout>
      <div className="space-y-6 p-6 min-h-screen bg-slate-100">
        <ProjectHeader 
          projectTitle={formatPackageType(project.packageType || "Projeto de Música Personalizada")} 
          clientName={project.clientName}
          packageType={formatPackageType(project.packageType)}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <PreviewVersionsList 
              versions={project.versionsList || []} 
              projectId={projectId}
              onDeleteVersion={handleDeleteVersion}
            />
            <ProjectHistoryList 
              history={project.history || []} 
            />
          </div>
          
          <div className="space-y-6">
            <ProjectClientInfo 
              clientName={project.clientName}
              clientEmail={project.clientEmail || "email@exemplo.com"}
              packageType={formatPackageType(project.packageType || "Pacote Básico")}
              createdAt={project.createdAt || new Date().toLocaleDateString('pt-BR')}
              expirationDate={project.expirationDate || "N/A"}
              lastActivityDate={project.lastActivityDate || new Date().toLocaleDateString('pt-BR')}
            />
            
            <ProjectActionCard 
              projectId={projectId}
              onAddVersion={handleAddVersion}
              onExtendDeadline={handleExtendDeadline}
              previewUrl={previewUrl}
              clientPhone={project.clientPhone || ''}
              clientEmail={project.clientEmail || ''}
              projectStatus={project.status}
              packageType={project.packageType}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PreviewProjectPage;
