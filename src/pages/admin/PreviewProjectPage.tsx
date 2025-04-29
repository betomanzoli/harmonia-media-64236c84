
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
  const { getProjectById, updateProject } = usePreviewProjects();
  
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

  // Function to handle version deletion
  const handleDeleteVersion = (versionId: string) => {
    console.log('Deletar versão:', versionId, 'do projeto:', projectId);
    alert(`Versão ${versionId} será removida em breve!`);
  };

  // Gera o link de prévia para o cliente
  const previewUrl = `/preview/${projectId}`;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <ProjectHeader 
          projectTitle={project.packageType || "Projeto de Música Personalizada"} 
          clientName={project.clientName}
          packageType={project.packageType}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <PreviewVersionsList 
              versions={project.versionsList || []}
              projectId={projectId}
              onDeleteVersion={handleDeleteVersion}
            />
            <ProjectHistoryList history={project.history || []} />
          </div>
          
          <div className="space-y-6">
            <ProjectClientInfo 
              clientName={project.clientName}
              clientEmail={project.clientEmail || "email@exemplo.com"}
              packageType={project.packageType || "Pacote Básico"}
              createdAt={project.createdAt || new Date().toLocaleDateString('pt-BR')}
              expirationDate={project.expirationDate || "N/A"}
              lastActivityDate={project.lastActivityDate || new Date().toLocaleDateString('pt-BR')}
            />
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
