
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import ProjectHeader from '@/components/admin/previews/ProjectHeader';
import PreviewVersionsList from '@/components/admin/previews/PreviewVersionsList';
import ProjectClientInfo from '@/components/admin/previews/ProjectClientInfo';
import ProjectActionCard from '@/components/admin/previews/ProjectActionCard';
import ProjectHistoryList from '@/components/admin/previews/ProjectHistoryList';
import { useParams, useNavigate } from 'react-router-dom';
import { usePreviewProjects, VersionItem } from '@/hooks/admin/usePreviewProjects';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PreviewProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { getProjectById, updateProject } = usePreviewProjects();
  const { toast } = useToast();
  
  const [project, setProject] = useState<any>(null);
  
  useEffect(() => {
    if (projectId) {
      const projectData = getProjectById(projectId);
      if (projectData) {
        setProject(projectData);
      } else {
        toast({
          title: "Projeto não encontrado",
          description: `Não foi possível encontrar o projeto com ID: ${projectId}`,
          variant: "destructive"
        });
        navigate('/admin-j28s7d1k/previews');
      }
    }
  }, [projectId, getProjectById, navigate, toast]);
  
  if (!project) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-full p-8">
          <h2 className="text-2xl font-semibold mb-2">Carregando projeto...</h2>
        </div>
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
  
  // Generate a project title based on available data
  const projectTitle = project.packageType 
    ? formatPackageType(project.packageType) 
    : "Projeto de Música Personalizada";
  
  // Gera o link de prévia para o cliente
  const previewUrl = `/preview/${projectId}`;
  
  return (
    <AdminLayout>
      <div className="space-y-6 p-6 min-h-screen bg-slate-100">
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost"
            onClick={() => navigate('/admin-j28s7d1k/previews')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
        
        <ProjectHeader 
          projectTitle={projectTitle} 
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
              projectStatus={project.status}
              packageType={project.packageType}
              onAddVersion={handleAddVersion}
              onExtendDeadline={handleExtendDeadline}
              previewUrl={previewUrl}
              clientPhone={project.clientPhone || ''}
              clientEmail={project.clientEmail || ''}
              clientName={project.clientName}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PreviewProjectPage;
