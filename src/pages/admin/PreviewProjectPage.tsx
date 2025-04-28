import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import ProjectHeader from '@/components/admin/previews/ProjectHeader';
import PreviewVersionsList from '@/components/admin/previews/PreviewVersionsList';
import ProjectClientInfo from '@/components/admin/previews/ProjectClientInfo';
import ProjectActionCard from '@/components/admin/previews/ProjectActionCard';
import ProjectHistoryList from '@/components/admin/previews/ProjectHistoryList';
import { useParams } from 'react-router-dom';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';

const PreviewProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProjectById } = usePreviewProjects();
  
  const project = projectId ? getProjectById(projectId) : null;
  
  if (!project) {
    return (
      <AdminLayout>
        <Card className="p-6">
          <p className="text-center text-gray-500">Projeto não encontrado</p>
        </Card>
      </AdminLayout>
    );
  }

  const handleAddVersion = () => {
    console.log('Adicionar nova versão para o projeto:', projectId);
    alert('Funcionalidade para adicionar nova versão em breve!');
  };

  const handleExtendDeadline = () => {
    console.log('Estender prazo para o projeto:', projectId);
    alert('Funcionalidade para estender o prazo em breve!');
  };

  // Gera o link de prévia para o cliente
  const previewUrl = `/preview/${projectId}`;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <ProjectHeader project={project} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <PreviewVersionsList 
              versions={project.versionsList || []}
              projectId={projectId}
            />
            <ProjectHistoryList history={project.history || []} />
          </div>
          
          <div className="space-y-6">
            <ProjectClientInfo client={project.clientName} />
            <ProjectActionCard
              projectId={projectId}
              onAddVersion={handleAddVersion}
              onExtendDeadline={handleExtendDeadline}
              previewUrl={previewUrl}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PreviewProjectPage;
