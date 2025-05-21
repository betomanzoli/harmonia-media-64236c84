
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { ProjectItem, VersionItem } from '@/types/preview.types';
import ProjectHeader from './ProjectHeader';
import ProjectActionCard from './ProjectActionCard';
import ProjectClientInfo from './ProjectClientInfo';
import ProjectHistoryList from './ProjectHistoryList';
import ProjectStatusCard from './ProjectStatusCard';
import PreviewVersionsList from './PreviewVersionsList';
import { formatProjectId } from '@/utils/project.utils';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<ProjectItem | null>(null);
  const { getProjectById, updateProject } = usePreviewProjects();
  
  useEffect(() => {
    if (!projectId) {
      console.error("No project ID provided");
      toast({
        title: "Erro",
        description: "ID do projeto não encontrado.",
        variant: "destructive"
      });
      navigate('/admin-j28s7d1k/previews');
      return;
    }
    
    console.log(`Loading project details for ID: ${projectId}`);
    
    try {
      // Format the project ID consistently
      const formattedId = formatProjectId(projectId);
      console.log(`Formatted project ID: ${formattedId}`);
      
      // Try to get the project with various ID formats
      let projectData = getProjectById(formattedId);
      
      if (!projectData) {
        console.log(`Project not found with ID ${formattedId}, trying original ID...`);
        projectData = getProjectById(projectId);
      }
      
      if (!projectData) {
        console.log(`Project not found with ID ${projectId}, trying uppercase...`);
        projectData = getProjectById(projectId.toUpperCase());
      }
      
      if (!projectData) {
        console.log(`Project not found with ID ${projectId.toUpperCase()}, trying lowercase...`);
        projectData = getProjectById(projectId.toLowerCase());
      }
      
      if (projectData) {
        console.log("Project found:", projectData);
        setProject(projectData);
      } else {
        console.error(`Project with ID ${projectId} not found after multiple attempts`);
        toast({
          title: "Projeto não encontrado",
          description: `Não foi possível encontrar o projeto com ID ${projectId}.`,
          variant: "destructive"
        });
        navigate('/admin-j28s7d1k/previews');
      }
    } catch (error) {
      console.error("Error loading project:", error);
      toast({
        title: "Erro ao carregar projeto",
        description: "Ocorreu um erro ao carregar os detalhes do projeto.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectId, getProjectById, toast, navigate]);
  
  const handleAddVersion = (version: VersionItem) => {
    if (!project) return;
    
    try {
      // Create a new versions list with the new version
      const currentVersions = project.versionsList || [];
      const updatedVersions = [...currentVersions, version];
      
      // Update the project with the new version
      updateProject(project.id, {
        versionsList: updatedVersions,
        versions: updatedVersions.length,
        lastActivityDate: new Date().toLocaleDateString('pt-BR'),
        history: [{
          action: `Versão ${version.name} adicionada`,
          timestamp: new Date().toLocaleString('pt-BR'),
          data: { versionId: version.id }
        }]
      });
      
      // Update local state
      setProject({
        ...project,
        versionsList: updatedVersions,
        versions: updatedVersions.length,
        lastActivityDate: new Date().toLocaleDateString('pt-BR')
      });
      
      toast({
        title: "Versão adicionada",
        description: `A versão "${version.name}" foi adicionada com sucesso.`
      });
    } catch (error) {
      console.error("Error adding version:", error);
      toast({
        title: "Erro ao adicionar versão",
        description: "Ocorreu um erro ao adicionar a versão. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const handleExtendDeadline = () => {
    if (!project) return;
    
    try {
      // Add 15 days to the current expiration date
      const currentDate = project.expirationDate 
        ? new Date(project.expirationDate.split('/').reverse().join('-')) 
        : new Date();
        
      currentDate.setDate(currentDate.getDate() + 15);
      const newExpirationDate = currentDate.toLocaleDateString('pt-BR');
      
      // Update the project with the new expiration date
      updateProject(project.id, {
        expirationDate: newExpirationDate,
        history: [{
          action: "Prazo estendido",
          timestamp: new Date().toLocaleString('pt-BR'),
          data: { 
            oldDate: project.expirationDate,
            newDate: newExpirationDate
          }
        }]
      });
      
      // Update local state
      setProject({
        ...project,
        expirationDate: newExpirationDate
      });
      
      toast({
        title: "Prazo estendido",
        description: "O prazo de expiração foi estendido por mais 15 dias."
      });
    } catch (error) {
      console.error("Error extending deadline:", error);
      toast({
        title: "Erro ao estender prazo",
        description: "Ocorreu um erro ao estender o prazo. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleStatusUpdate = (newStatus: 'waiting' | 'feedback' | 'approved') => {
    if (!project) return;
    
    try {
      // Update project status
      updateProject(project.id, {
        status: newStatus,
        lastActivityDate: new Date().toLocaleDateString('pt-BR'),
        history: [{
          action: `Status alterado para ${
            newStatus === 'waiting' ? 'Aguardando Avaliação' : 
            newStatus === 'feedback' ? 'Feedback Recebido' : 'Aprovado'
          }`,
          timestamp: new Date().toLocaleString('pt-BR')
        }]
      });
      
      // Update local state
      setProject({
        ...project,
        status: newStatus,
        lastActivityDate: new Date().toLocaleDateString('pt-BR')
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao atualizar o status do projeto. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteVersion = (versionId: string) => {
    if (!project) return;
    
    try {
      // Filter out the deleted version
      const updatedVersions = (project.versionsList || []).filter(v => v.id !== versionId);
      
      // Update the project
      updateProject(project.id, {
        versionsList: updatedVersions,
        versions: updatedVersions.length,
        lastActivityDate: new Date().toLocaleDateString('pt-BR'),
        history: [{
          action: `Versão removida`,
          timestamp: new Date().toLocaleString('pt-BR'),
          data: { versionId }
        }]
      });
      
      // Update local state
      setProject({
        ...project,
        versionsList: updatedVersions,
        versions: updatedVersions.length,
        lastActivityDate: new Date().toLocaleDateString('pt-BR')
      });
      
      toast({
        title: "Versão removida",
        description: "A versão foi removida com sucesso."
      });
    } catch (error) {
      console.error("Error deleting version:", error);
      toast({
        title: "Erro ao remover versão",
        description: "Ocorreu um erro ao remover a versão. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Carregando detalhes do projeto...</div>;
  }
  
  if (!project) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold mb-2">Projeto não encontrado</h2>
        <p>Não foi possível encontrar o projeto com o ID especificado.</p>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
          onClick={() => navigate('/admin-j28s7d1k/previews')}
        >
          Voltar para Prévias
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectHeader 
        clientName={project.clientName}
        projectTitle={`Projeto ${project.id}`}
        packageType={project.packageType || 'Música Personalizada'}
        status={project.status}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <PreviewVersionsList 
            versions={project.versionsList || []}
            projectId={project.id}
            onDeleteVersion={handleDeleteVersion}
          />
          
          <ProjectHistoryList 
            history={project.history || []}
          />
        </div>
        
        <div className="space-y-6">
          <ProjectActionCard 
            projectId={project.id}
            onAddVersion={handleAddVersion}
            onExtendDeadline={handleExtendDeadline}
            previewUrl={project.previewUrl || `/preview/${project.id}`}
            projectStatus={project.status}
            packageType={project.packageType}
            clientPhone={project.clientPhone}
            clientEmail={project.clientEmail}
            clientName={project.clientName}
          />
          
          <ProjectClientInfo 
            clientName={project.clientName}
            clientEmail={project.clientEmail}
            clientPhone={project.clientPhone}
          />
          
          <ProjectStatusCard 
            status={project.status}
            createdAt={project.createdAt}
            expirationDate={project.expirationDate}
            lastActivityDate={project.lastActivityDate}
            projectId={project.id}
            feedback={project.feedback}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
