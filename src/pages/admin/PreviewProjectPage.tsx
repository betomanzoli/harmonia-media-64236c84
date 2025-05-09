import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import ProjectHeader from '@/components/admin/previews/ProjectHeader';
import PreviewVersionsList from '@/components/admin/previews/PreviewVersionsList';
import ProjectClientInfo from '@/components/admin/previews/ProjectClientInfo';
import ProjectActionCard from '@/components/admin/previews/ProjectActionCard';
import ProjectHistoryList from '@/components/admin/previews/ProjectHistoryList';
import ProjectFeedbackHistory from '@/components/admin/previews/ProjectFeedbackHistory';
import { VersionItem, usePreviewProjects, ProjectItem } from '@/hooks/admin/usePreviewProjects';
import { useToast } from '@/hooks/use-toast';
import { generatePreviewLink } from '@/utils/previewLinkUtils';
import { HistoryItem, HistoryEntry } from '@/types/project.types';

const PreviewProjectPage: React.FC = () => {
  const {
    projectId
  } = useParams<{
    projectId: string;
  }>();
  
  // Get projects data
  const previewProjects = usePreviewProjects();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  
  // Find the project in the list
  const project = projectId ? previewProjects.getProjectById(projectId) : null;
  
  const [encodedLinkUrl, setEncodedLinkUrl] = useState<string>('');
  
  useEffect(() => {
    if (projectId && project) {
      // Generate the encoded link using project details for uniqueness
      let encodedLink;
      
      if (project.preview_code) {
        // If project already has a preview code, use it directly
        encodedLink = project.preview_code;
      } else {
        // Otherwise generate a new stable encoded link
        encodedLink = generatePreviewLink(projectId, project.client_email || project.client_name);
        
        // Save this preview_code for future use
        previewProjects.updateProject(projectId, { 
          preview_code: encodedLink 
        });
      }
      
      console.log(`[AdminPreviewProjectPage] Generated encoded link for ${projectId}:`, encodedLink);
      
      const fullUrl = `${window.location.origin}/preview/${encodedLink}`;
      setEncodedLinkUrl(fullUrl);
    }
  }, [projectId, project, previewProjects]);
  
  // Check if project exists
  if (!project) {
    return <AdminLayout>
        <Card className="p-6">
          <p className="text-center text-gray-500">Projeto não encontrado</p>
        </Card>
      </AdminLayout>;
  }
  
  // Convert history entries to the correct format expected by ProjectHistoryList
  const processHistoryItems = (items: HistoryItem[]): HistoryEntry[] => {
    return items.map(item => ({
      id: item.id,
      action: item.action,
      timestamp: item.timestamp || item.created_at,
      data: item.data || { message: item.description }
    }));
  };
  
  const handleAddVersion = (newVersion: VersionItem) => {
    if (!projectId) return;
    const currentVersions = project.versionsList || [];

    // If the new version is marked as final, add an indicator
    const isFinalVersion = newVersion.final === true;
    const versionTitle = isFinalVersion ? `FINAL - ${newVersion.name}` : newVersion.name;
    const versionToAdd = {
      ...newVersion,
      name: versionTitle,
      title: versionTitle // Also set title for consistent display
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
    
    // Create a history item in the correct format
    const historyItem: HistoryItem = {
      id: `hist_${Date.now()}`,
      project_id: projectId,
      action: isFinalVersion ? `Versão final adicionada: ${versionTitle}` : `Nova versão adicionada: ${versionTitle}`,
      description: newVersion.description || 'Sem descrição',
      created_at: new Date().toISOString()
    };
    
    const history = [...(project.history || []), historyItem];

    // Update project
    previewProjects.updateProject(projectId, {
      versionsList: updatedVersions,
      versions: updatedVersions.length,
      history,
      last_activity_date: new Date().toLocaleDateString('pt-BR')
    });
    
    toast({
      title: isFinalVersion ? "Versão final adicionada" : "Versão adicionada",
      description: `${versionTitle} foi adicionada ao projeto com sucesso.`
    });
  };
  
  const handleExtendDeadline = () => {
    if (!projectId) return;

    // Calculate new expiration date (current + 7 days)
    const currentDate = project.expiration_date ? new Date(project.expiration_date.split('/').reverse().join('-')) : new Date();
    currentDate.setDate(currentDate.getDate() + 7);
    const newExpirationDate = currentDate.toLocaleDateString('pt-BR');
    
    // Create a history item in the correct format
    const historyItem: HistoryItem = {
      id: `hist_${Date.now()}`,
      project_id: projectId,
      action: "Prazo estendido",
      description: `Prazo estendido por +7 dias. Nova data de expiração: ${newExpirationDate}`,
      created_at: new Date().toISOString()
    };

    const history = [...(project.history || []), historyItem];

    // Update project
    previewProjects.updateProject(projectId, {
      expiration_date: newExpirationDate,
      expirationDate: newExpirationDate,
      history,
      last_activity_date: new Date().toLocaleDateString('pt-BR')
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

    // Create a history item in the correct format
    const historyItem: HistoryItem = {
      id: `hist_${Date.now()}`,
      project_id: projectId,
      action: `Versão removida: ${versionToDelete.name}`,
      description: `A versão "${versionToDelete.name}" foi removida do projeto.`,
      created_at: new Date().toISOString()
    };

    const history = [...(project.history || []), historyItem];

    // Update project
    previewProjects.updateProject(projectId, {
      versionsList: updatedVersions,
      versions: updatedVersions.length,
      history,
      last_activity_date: new Date().toLocaleDateString('pt-BR')
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
      if (word.toLowerCase() === 'essencial' || word.toLowerCase() === 'premium' || word.toLowerCase() === 'profissional') {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word;
    }).join(' ');
  };

  // Função para ver a prévia como cliente
  const handleViewAsClient = () => {
    // Sinaliza que o acesso é do administrador
    localStorage.setItem('admin_preview_access', 'true');
    
    // Use the generated encoded preview link 
    if (encodedLinkUrl) {
      const previewPath = encodedLinkUrl.replace(window.location.origin, '');
      console.log(`[AdminPreviewProjectPage] Viewing as client with path: ${previewPath}`);
      
      // Navigate to preview page with encoded link
      navigate(previewPath);
    } else {
      console.error("[AdminPreviewProjectPage] No encoded link URL available");
      toast({
        title: "Erro",
        description: "Não foi possível gerar o link de prévia",
        variant: "destructive"
      });
    }
  };
  
  return <AdminLayout>
      <div className="space-y-6 p-6 min-h-screen bg-slate-50">
        <div className="flex justify-between items-center">
          <ProjectHeader 
            projectTitle={formatPackageType(project.package_type || "Projeto de Música Personalizada")} 
            clientName={project.client_name} 
            packageType={formatPackageType(project.package_type)} 
          />
          <button
            onClick={handleViewAsClient}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Ver como cliente
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <PreviewVersionsList versions={project.versionsList || []} projectId={projectId} onDeleteVersion={handleDeleteVersion} />
            <ProjectFeedbackHistory projectId={projectId} feedbackHistory={project.feedback_history || []} />
            <ProjectHistoryList history={processHistoryItems(project.history || [])} />
          </div>
          
          <div className="space-y-6">
            <ProjectClientInfo clientName={project.client_name} clientEmail={project.client_email || "email@exemplo.com"} packageType={formatPackageType(project.package_type || "Pacote Básico")} createdAt={project.created_at || new Date().toLocaleDateString('pt-BR')} expirationDate={project.expiration_date || "N/A"} lastActivityDate={project.last_activity_date || new Date().toLocaleDateString('pt-BR')} />
            <ProjectActionCard 
              projectId={projectId} 
              onAddVersion={handleAddVersion} 
              onExtendDeadline={handleExtendDeadline} 
              previewUrl={encodedLinkUrl} 
              clientPhone={project.client_phone || ''} 
              clientEmail={project.client_email || ''} 
              projectStatus={project.status} 
              packageType={project.package_type} 
            />
          </div>
        </div>
      </div>
    </AdminLayout>;
};

export default PreviewProjectPage;
