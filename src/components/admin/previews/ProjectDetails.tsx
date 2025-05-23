
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from '@/hooks/use-toast';
import ProjectHeader from './ProjectHeader';
import ProjectStatusCard from './ProjectStatusCard';
import ProjectClientInfo from './ProjectClientInfo';
import PreviewVersionsList from './PreviewVersionsList';
import ClientFeedbackCard from './ClientFeedbackCard';
import AddVersionDialog from './AddVersionDialog';
import { notificationService } from '@/services/notificationService';

// Types
export type VersionItemStatus = 'pending' | 'approved' | 'rejected';

export interface VersionItem {
  id: string;
  name: string;
  description?: string;
  url: string;
  dateAdded: string;
  recommended?: boolean;
  final?: boolean;
  status?: VersionItemStatus;
  feedback?: string;
}

export interface ProjectData {
  id: string;
  projectTitle: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  status: string;
  packageType: string;
  versions: VersionItem[];
  feedback?: string;
  createdAt: string;
  updatedAt?: string;
  deadline?: string;
  notes?: string;
}

interface ProjectDetailsProps {
  projectData: ProjectData;
  onUpdate?: (updatedProject: ProjectData) => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectData, onUpdate }) => {
  const [project, setProject] = useState<ProjectData>(projectData);
  const [isAddVersionOpen, setIsAddVersionOpen] = useState(false);
  const [isAddFinalVersionOpen, setIsAddFinalVersionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'versions' | 'history'>('versions');
  
  useEffect(() => {
    setProject(projectData);
  }, [projectData]);

  const handleAddVersion = (newVersion: VersionItem) => {
    const updatedVersions = [...project.versions, newVersion];
    const updatedProject = { ...project, versions: updatedVersions };
    setProject(updatedProject);
    
    if (onUpdate) {
      onUpdate(updatedProject);
    }
    
    toast({
      title: "Versão adicionada",
      description: `A versão "${newVersion.name}" foi adicionada com sucesso.`
    });
    
    // Notify about the new version
    notificationService.notify(
      'preview_version_added',
      {
        projectId: project.id,
        versionId: newVersion.id,
        versionName: newVersion.name,
        timestamp: new Date().toISOString()
      }
    );
  };

  const handleVersionStatusChange = (versionId: string, status: VersionItemStatus, feedback?: string) => {
    const updatedVersions = project.versions.map(v => 
      v.id === versionId ? { ...v, status, feedback } : v
    );
    
    const updatedProject = { ...project, versions: updatedVersions };
    setProject(updatedProject);
    
    if (onUpdate) {
      onUpdate(updatedProject);
    }
    
    toast({
      title: `Versão ${status === 'approved' ? 'aprovada' : status === 'rejected' ? 'rejeitada' : 'atualizada'}`,
      description: `O status da versão foi alterado para ${
        status === 'approved' ? 'aprovada' : status === 'rejected' ? 'rejeitada' : 'pendente'
      }.`
    });
  };

  const handleProjectStatusChange = (newStatus: string) => {
    const updatedProject = { ...project, status: newStatus };
    setProject(updatedProject);
    
    if (onUpdate) {
      onUpdate(updatedProject);
    }
    
    toast({
      title: "Status atualizado",
      description: `O status do projeto foi alterado para "${newStatus}".`
    });
  };

  const handleSendToClient = () => {
    // Check if there are any versions to send
    if (project.versions.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma versão antes de enviar para o cliente.",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, you would send an email to the client here
    toast({
      title: "Enviado para o cliente",
      description: `As prévias foram enviadas para ${project.clientName}.`
    });
    
    // Update project status
    handleProjectStatusChange('awaiting_feedback');
    
    // Notify about the preview sent
    notificationService.notify(
      'preview_sent_to_client',
      {
        projectId: project.id,
        clientName: project.clientName,
        clientEmail: project.clientEmail,
        versionsCount: project.versions.length,
        timestamp: new Date().toISOString()
      }
    );
  };

  const hasFinalVersion = project.versions.some(v => v.final);
  const hasApprovedVersion = project.versions.some(v => v.status === 'approved');

  return (
    <div className="space-y-6">
      <ProjectHeader 
        project={project}
        onStatusChange={handleProjectStatusChange}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Versions and History Tabs */}
          <Card className="p-6">
            <div className="flex space-x-2 mb-4">
              <Button
                variant={activeTab === 'versions' ? 'default' : 'outline'}
                onClick={() => setActiveTab('versions')}
              >
                Versões
              </Button>
              <Button
                variant={activeTab === 'history' ? 'default' : 'outline'}
                onClick={() => setActiveTab('history')}
              >
                Histórico
              </Button>
            </div>
            
            {activeTab === 'versions' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Versões</h2>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => setIsAddVersionOpen(true)}
                      variant="outline"
                    >
                      Adicionar Versão
                    </Button>
                    
                    {hasApprovedVersion && !hasFinalVersion && (
                      <Button 
                        onClick={() => setIsAddFinalVersionOpen(true)} 
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Adicionar Versão Final
                      </Button>
                    )}
                  </div>
                </div>
                
                <PreviewVersionsList 
                  versions={project.versions}
                  onVersionStatusChange={handleVersionStatusChange}
                />
              </>
            )}
            
            {activeTab === 'history' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Histórico do Projeto</h2>
                {/* History content would go here */}
                <p className="text-gray-500 italic">Nenhum histórico disponível.</p>
              </div>
            )}
          </Card>
          
          {/* Client Feedback */}
          <ClientFeedbackCard 
            project={project}
            onUpdate={(updatedFeedback) => {
              const updatedProject = { ...project, feedback: updatedFeedback };
              setProject(updatedProject);
              if (onUpdate) onUpdate(updatedProject);
            }}
          />
        </div>
        
        <div className="space-y-6">
          {/* Project Status */}
          <ProjectStatusCard project={project} />
          
          {/* Client Info */}
          <ProjectClientInfo client={{
            name: project.clientName,
            email: project.clientEmail || '',
            phone: project.clientPhone || ''
          }} />
          
          {/* Action Buttons */}
          <Card className="p-6">
            <h3 className="font-medium mb-4">Ações</h3>
            <div className="space-y-3">
              <Button 
                onClick={handleSendToClient}
                className="w-full"
              >
                Enviar para Cliente
              </Button>
              
              {hasApprovedVersion && (
                <Button 
                  className="w-full"
                >
                  Finalizar Projeto
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="w-full"
              >
                Baixar Arquivos
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      <AddVersionDialog 
        projectId={project.id}
        onAddVersion={handleAddVersion}
        isOpen={isAddVersionOpen}
        onOpenChange={setIsAddVersionOpen}
        packageType={project.packageType}
      />
      
      <AddVersionDialog 
        projectId={project.id}
        onAddVersion={handleAddVersion}
        isOpen={isAddFinalVersionOpen}
        onOpenChange={setIsAddFinalVersionOpen}
        isFinalVersion={true}
        packageType={project.packageType}
      />
    </div>
  );
};

export default ProjectDetails;
