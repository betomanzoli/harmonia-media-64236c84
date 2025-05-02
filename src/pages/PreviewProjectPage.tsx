
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import PreviewVersionsList from '@/components/admin/previews/PreviewVersionsList';
import ProjectActionCard from '@/components/admin/previews/ProjectActionCard';
import ProjectDetailsCard from '@/components/admin/previews/ProjectDetailsCard';
import ProjectFeedbackHistory from '@/components/admin/previews/ProjectFeedbackHistory';
import { useToast } from '@/hooks/use-toast';
import { usePreviewProject, VersionItem } from '@/hooks/admin/usePreviewProjects';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { generatePreviewLink } from '@/utils/previewLinkUtils';

const PreviewProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [encodedUrl, setEncodedUrl] = useState<string | null>(null);
  
  const {
    project,
    isLoading,
    addVersion,
    deleteVersion,
    updateProject,
    extendDeadline
  } = usePreviewProject(projectId);

  useEffect(() => {
    if (projectId) {
      // Generate and store encoded URL for this project
      const encoded = generatePreviewLink(projectId);
      const fullUrl = `${window.location.origin}/preview/${encoded}`;
      setEncodedUrl(fullUrl);
      
      // Set admin access flag for direct preview access
      localStorage.setItem('admin_preview_access', 'true');
    }
    
    return () => {
      localStorage.removeItem('admin_preview_access');
    };
  }, [projectId]);

  const handleAddVersion = (version: VersionItem) => {
    if (!projectId) return;
    addVersion(projectId, version);
    toast({
      title: "Versão adicionada",
      description: `A versão "${version.name}" foi adicionada com sucesso.`
    });
  };
  
  const handleDeleteVersion = (versionId: string) => {
    if (!projectId) return;
    deleteVersion(projectId, versionId);
    toast({
      title: "Versão removida",
      description: "A versão foi removida com sucesso."
    });
  };
  
  const handleExtendDeadline = () => {
    if (!projectId) return;
    extendDeadline(projectId);
    toast({
      title: "Prazo estendido",
      description: "O prazo foi estendido em 7 dias."
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-2 text-gray-500">Carregando informações do projeto...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!project) {
    return (
      <AdminLayout>
        <div className="p-8">
          <Card className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Projeto não encontrado</h2>
            <p className="mb-6">O projeto que você está procurando não existe ou foi removido.</p>
            <Button asChild>
              <Link to="/admin-j28s7d1k/previews">Voltar para lista de projetos</Link>
            </Button>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  // Prepare preview URL from project ID
  const previewUrl = `${window.location.origin}/preview/${projectId}`;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" asChild className="mr-4">
            <Link to="/admin-j28s7d1k/previews">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Gerenciar Prévia: {project.clientName}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <ProjectDetailsCard 
              project={project} 
              onUpdate={(updates) => updateProject(projectId as string, updates)}
            />
            
            <PreviewVersionsList 
              versions={project.versionsList || []} 
              projectId={projectId as string}
              onDeleteVersion={handleDeleteVersion}
            />
            
            <ProjectFeedbackHistory 
              projectId={projectId as string}
              feedbackHistory={project.feedbackHistory || []}
            />
          </div>
          
          <div>
            <ProjectActionCard 
              projectId={projectId as string} 
              onAddVersion={handleAddVersion}
              onExtendDeadline={handleExtendDeadline}
              previewUrl={encodedUrl || previewUrl}
              clientPhone={project.clientPhone}
              clientEmail={project.clientEmail}
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
