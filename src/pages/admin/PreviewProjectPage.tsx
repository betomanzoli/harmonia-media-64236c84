
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { usePreviewProjects, ProjectItem, VersionItem } from '@/hooks/admin/usePreviewProjects';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Check, AlertCircle } from 'lucide-react';
import ProjectHeader from '@/components/admin/previews/ProjectHeader';
import ProjectClientInfo from '@/components/admin/previews/ProjectClientInfo';
import ProjectStatusCard from '@/components/admin/previews/ProjectStatusCard';
import PreviewVersionsList from '@/components/admin/previews/PreviewVersionsList';
import ClientFeedbackCard from '@/components/admin/previews/ClientFeedbackCard';
import AddVersionForm from '@/components/admin/previews/AddVersionForm';
import { useToast } from "@/hooks/use-toast";
import ProjectActionCard from '@/components/admin/previews/ProjectActionCard';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const PreviewProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProjectById, updateProject } = usePreviewProjects();
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (projectId) {
      console.log("Looking for project with ID:", projectId);
      const projectData = getProjectById(projectId);
      if (projectData) {
        console.log("Project found:", projectData);
        setProject(projectData);
      } else {
        console.error("Project not found with ID:", projectId);
        toast({
          title: "Projeto não encontrado",
          description: "O projeto solicitado não foi encontrado.",
          variant: "destructive"
        });
        navigate('/admin-j28s7d1k/previews');
      }
    }
  }, [projectId, getProjectById, navigate, toast]);

  const handleStatusUpdate = (newStatus: 'waiting' | 'feedback' | 'approved') => {
    if (!project) return;
    
    const updatedProject = updateProject(project.id, { 
      status: newStatus,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    if (updatedProject) {
      setProject(updatedProject);
      toast({
        title: "Status atualizado",
        description: `Status do projeto atualizado para ${newStatus}.`
      });
    }
  };

  const handleFeedbackSave = (feedback: string) => {
    if (!project) return;
    
    const updatedProject = updateProject(project.id, { 
      feedback,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    if (updatedProject) {
      setProject(updatedProject);
      toast({
        title: "Feedback salvo",
        description: "O feedback do cliente foi salvo com sucesso."
      });
    }
  };

  const handleAddVersion = (newVersion: VersionItem) => {
    if (!project) return;
    
    const currentVersions = project.versionsList || [];
    
    if (newVersion.audioUrl && !newVersion.fileId) {
      const match = newVersion.audioUrl.match(/[-\w]{25,}/);
      if (match) {
        newVersion.fileId = match[0];
      }
    }
    
    const updatedVersions = [...currentVersions, {
      ...newVersion,
      dateAdded: new Date().toLocaleDateString('pt-BR')
    }];
    
    const updatedProject = updateProject(project.id, {
      versionsList: updatedVersions,
      versions: updatedVersions.length,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    if (updatedProject) {
      setProject(updatedProject);
      setShowAddForm(false);
      toast({
        title: "Versão adicionada",
        description: "A nova versão foi adicionada com sucesso."
      });
    }
  };

  const handleExtendDeadline = () => {
    if (!project) return;
    
    const newExpirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');
    
    const updatedProject = updateProject(project.id, {
      expirationDate: newExpirationDate,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    if (updatedProject) {
      setProject(updatedProject);
      toast({
        title: "Prazo estendido",
        description: `O prazo foi estendido até ${newExpirationDate}.`
      });
    }
  };

  const handleDeleteVersion = (versionId: string) => {
    if (!project || !project.versionsList) return;
    
    const updatedVersions = project.versionsList.filter(v => v.id !== versionId);
    
    const updatedProject = updateProject(project.id, {
      versionsList: updatedVersions,
      versions: updatedVersions.length,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    if (updatedProject) {
      setProject(updatedProject);
      toast({
        title: "Versão removida",
        description: "A versão foi removida com sucesso."
      });
    }
  };

  if (!project) {
    return (
      <AdminLayout>
        <div className="p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-harmonia-green"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="mr-4"
              onClick={() => navigate('/admin-j28s7d1k/previews')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">Gerenciamento de Prévia</h1>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              asChild
            >
              <a href={`/preview/${project.id}`} target="_blank" rel="noopener noreferrer">
                Ver Página do Cliente
              </a>
            </Button>
            
            <Button 
              size="sm"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {showAddForm ? 'Cancelar' : 'Adicionar Versão'}
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-auto">
          <ProjectHeader 
            projectTitle={`Prévia: ${project.id}`} 
            clientName={project.clientName}
            packageType={project.packageType}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <ProjectClientInfo 
                clientName={project.clientName}
                clientEmail={project.clientEmail}
                createdAt={project.createdAt}
                expirationDate={project.expirationDate}
                packageType={project.packageType}
                lastActivityDate={project.lastActivityDate}
              />
            </div>
            
            <div>
              <ProjectStatusCard 
                status={project.status}
                onStatusUpdate={handleStatusUpdate}
              />
            </div>
          </div>
          
          {showAddForm && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Adicionar Nova Versão</h3>
                <AddVersionForm 
                  projectId={project.id}
                  onAddVersion={handleAddVersion} 
                  onCancel={() => setShowAddForm(false)}
                />
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <Card>
                <PreviewVersionsList 
                  versions={project.versionsList || []}
                  projectId={project.id}
                  onDeleteVersion={handleDeleteVersion}
                />
              </Card>
            </div>
            
            <div className="space-y-6">
              <ProjectActionCard 
                projectId={project.id}
                onAddVersion={() => setShowAddForm(true)}
                onExtendDeadline={handleExtendDeadline}
                previewUrl={`/preview/${project.id}`}
              />
              
              <ClientFeedbackCard 
                feedback={project.feedback || ''} 
                onSaveFeedback={handleFeedbackSave}
                status={project.status}
              />
            </div>
          </div>
          
          {project.status === 'feedback' && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Feedback recebido do cliente</AlertTitle>
              <AlertDescription>
                O cliente enviou feedback para este projeto. Por favor, analise e atualize o status quando apropriado.
              </AlertDescription>
            </Alert>
          )}
          
          {project.status === 'approved' && (
            <Alert className="mb-6 bg-green-50 text-green-700 border-green-200">
              <Check className="h-4 w-4" />
              <AlertTitle>Projeto aprovado pelo cliente</AlertTitle>
              <AlertDescription>
                O cliente aprovou o projeto. Você pode prosseguir com a finalização e entrega.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PreviewProjectPage;
