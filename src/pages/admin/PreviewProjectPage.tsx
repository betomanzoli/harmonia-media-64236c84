
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ProjectStatusBadge from '@/components/admin/previews/ProjectStatusBadge';
import ProjectVersionsList from '@/components/admin/previews/ProjectVersionsList';
import ProjectActionCard from '@/components/admin/previews/ProjectActionCard';
import ProjectMetadataCard from '@/components/admin/previews/ProjectMetadataCard';
import VersionPlayerCard from '@/components/admin/previews/VersionPlayerCard';
import { useToast } from '@/hooks/use-toast';
import { VersionItem } from '@/hooks/admin/usePreviewProjects';

// Define the Project interface
interface Project {
  id: string;
  clientName: string;
  projectTitle: string;
  status: 'waiting' | 'feedback' | 'approved';
  feedback?: string;
  packageType?: string;
  createdAt?: string;
  expirationDate?: string;
  lastActivityDate?: string;
  versionsList?: VersionItem[];
  versions?: number;
  currentVersion?: string;
  clientEmail?: string;
  clientPhone?: string;
}

const PreviewProjectPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById } = usePreviewProjects();
  const [project, setProject] = useState<Project | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<VersionItem | null>(null);
  const [versions, setVersions] = useState<VersionItem[]>([]);
  const { toast } = useToast();

  const handleVersionSelect = (version: VersionItem) => {
    setSelectedVersion(version);
  };

  const handleAddVersion = (newVersion: VersionItem) => {
    if (project) {
      const updatedVersions = [...versions, newVersion];
      setVersions(updatedVersions);

      // Update the project with the new version
      const updatedProject = {
        ...project,
        versionsList: updatedVersions
      };

      // Update the project in the admin system
      // updateProject(project.id, updatedProject);

      // Update local state
      setProject(updatedProject);
    }
  };

  const handleExtendDeadline = () => {
    if (project) {
      const newExpirationDate = new Date(new Date(project.expirationDate || '').getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      
      // Update the project with the extended deadline
      const updatedProject = {
        ...project,
        expirationDate: newExpirationDate
      };
      
      // Update the project in the admin system
      // updateProject(project.id, updatedProject);
      
      // Update local state
      setProject(updatedProject);
      
      toast({
        title: "Prazo estendido",
        description: "O prazo do projeto foi estendido em 7 dias."
      });
    }
  };

  useEffect(() => {
    if (id) {
      const projectData = getProjectById(id);
      if (projectData) {
        // Create a Project object from projectData
        const projectWithTitle: Project = {
          ...projectData,
          projectTitle: projectData.title || projectData.packageType || 'Projeto de Música'
        };
        
        setProject(projectWithTitle);
        
        // Set versions list if it exists or create a default array
        const versionsList = projectData.versionsList || [];
        setVersions(versionsList);
        
        // Set selected version to the recommended one or the first one
        const recommended = versionsList.find((v: VersionItem) => v.recommended);
        setSelectedVersion(recommended || (versionsList.length > 0 ? versionsList[0] : null));
      } else {
        toast({
          title: "Projeto não encontrado",
          description: `Não foi possível encontrar o projeto com ID: ${id}`,
          variant: "destructive"
        });
        
        navigate('/admin/previews');
      }
    }
  }, [id, getProjectById, navigate, toast]);

  if (!project) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-full p-8">
          <h2 className="text-2xl font-semibold mb-2">Carregando projeto...</h2>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center p-6">
        <Button variant="ghost" onClick={() => navigate('/admin-j28s7d1k/previews')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <div>
          <ProjectStatusBadge status={project.status} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-2 space-y-6">
          <VersionPlayerCard selectedVersion={selectedVersion} />
          
          <ProjectVersionsList 
            versions={versions}
            selectedVersion={selectedVersion}
            onVersionSelect={handleVersionSelect}
          />
        </div>
        
        <div className="space-y-6">
          <ProjectActionCard 
            projectId={project.id}
            onAddVersion={handleAddVersion}
            onExtendDeadline={handleExtendDeadline}
            previewUrl={`/preview/${project.id}`}
            clientPhone={project.clientPhone}
            clientEmail={project.clientEmail}
            projectStatus={project.status}
            packageType={project.packageType}
            clientName={project.clientName}
          />
          
          <ProjectMetadataCard 
            clientName={project.clientName}
            projectTitle={project.projectTitle}
            status={project.status}
            createdAt={project.createdAt}
            expirationDate={project.expirationDate}
            packageType={project.packageType}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default PreviewProjectPage;
