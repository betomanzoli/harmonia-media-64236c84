
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { usePreviewProjects, ProjectItem, VersionItem } from '@/hooks/admin/usePreviewProjects';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Download } from 'lucide-react';
import ProjectHeader from '@/components/admin/previews/ProjectHeader';
import ProjectClientInfo from '@/components/admin/previews/ProjectClientInfo';
import ProjectStatusCard from '@/components/admin/previews/ProjectStatusCard';
import PreviewVersionsList from '@/components/admin/previews/PreviewVersionsList';
import ClientFeedbackCard from '@/components/admin/previews/ClientFeedbackCard';
import AddVersionForm from '@/components/admin/previews/AddVersionForm';
import { useToast } from "@/hooks/use-toast";

const PreviewProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProjectById, updateProject } = usePreviewProjects();
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (projectId) {
      const projectData = getProjectById(projectId);
      if (projectData) {
        setProject(projectData);
      } else {
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
    
    const updatedProject = updateProject(project.id, { status: newStatus });
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
    
    const updatedProject = updateProject(project.id, { feedback });
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
    
    // Get current list or initialize empty array
    const currentVersions = project.versionsList || [];
    
    // Create updated versions list with new version
    const updatedVersions = [...currentVersions, newVersion];
    
    // Update project with new version list and count
    const updatedProject = updateProject(project.id, {
      versionsList: updatedVersions,
      versions: updatedVersions.length
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
              <ClientFeedbackCard 
                feedback={project.feedback || ''} 
                status={project.status}
                onSaveFeedback={handleFeedbackSave}
                onStatusUpdate={handleStatusUpdate}
              />
            </div>
            <div>
              <div className="space-y-6">
                <ProjectClientInfo 
                  clientName={project.clientName}
                  clientEmail={project.clientEmail}
                  packageType={project.packageType}
                  createdAt={project.createdAt}
                  expirationDate={project.expirationDate}
                  lastActivityDate={project.lastActivityDate}
                />
                
                <ProjectStatusCard 
                  status={project.status} 
                  onStatusUpdate={handleStatusUpdate} 
                />
              </div>
            </div>
          </div>
          
          {showAddForm && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <AddVersionForm 
                  projectId={project.id}
                  onAddVersion={handleAddVersion}
                  onCancel={() => setShowAddForm(false)}
                />
              </CardContent>
            </Card>
          )}
          
          <PreviewVersionsList 
            versions={project.versionsList || []}
            projectId={project.id}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default PreviewProjectPage;
