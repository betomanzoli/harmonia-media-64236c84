import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, User, Mail, Phone, Calendar, ExternalLink, RotateCcw } from 'lucide-react';
import NewAdminLayout from '@/components/admin/layout/NewAdminLayout';
import BandcampVersionCard from './BandcampVersionCard';
import AddVersionDialog from './AddVersionDialog';
import ProjectHistory from './ProjectHistory';
import BackToWaitingDialog from './BackToWaitingDialog';
import { useProjects } from '@/hooks/admin/useProjects';
import { logProjectHistory } from '@/utils/historyLogger';

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projects, isLoading, loadProjects, deleteVersion, updateProject } = useProjects();
  
  const [showAddVersionDialog, setShowAddVersionDialog] = useState(false);
  const [showBackToWaitingDialog, setShowBackToWaitingDialog] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const project = projects.find(p => p.id === projectId);

  useEffect(() => {
    if (!isLoading && !project && projectId) {
      // Recarregar projetos se não encontrou
      loadProjects();
    }
  }, [projectId, project, isLoading, loadProjects]);

  const handleDeleteVersion = async (versionId: string) => {
    if (!project) return;

    const versionToDelete = project.versions.find(v => v.id === versionId);
    if (!versionToDelete) return;

    const result = await deleteVersion(versionId);
    
    if (result.success) {
      toast({
        title: "Versão removida",
        description: `${versionToDelete.name} foi removida do projeto.`,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Erro ao remover versão",
        description: result.error || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
  };

  const handleBackToWaiting = async (reason: string) => {
    if (!project) return;

    setIsUpdatingStatus(true);

    const result = await updateProject(project.id, {
      status: 'waiting',
      approved_version_id: null // Limpar aprovação anterior se existir
    });

    if (result.success) {
      // Registrar no histórico com a justificativa
      await logProjectHistory(project.id, 'status_changed_to_waiting', {
        previousStatus: project.status,
        reason: reason,
        adminAction: true,
        messageForClient: `Projeto retornado para avaliação: ${reason}`
      });

      toast({
        title: "Status atualizado",
        description: "Projeto voltou para status 'Aguardando'. Cliente pode enviar novo feedback.",
      });

      setShowBackToWaitingDialog(false);
    } else {
      toast({
        title: "Erro ao atualizar status",
        description: result.error || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }

    setIsUpdatingStatus(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      waiting: { label: 'Aguardando', color: 'bg-yellow-500' },
      feedback: { label: 'Feedback', color: 'bg-blue-500' },
      approved: { label: 'Aprovado', color: 'bg-green-500' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: 'bg-gray-500' };
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const copyClientPreviewLink = () => {
    if (!project?.preview_code) {
      toast({
        title: "Link não disponível",
        description: "O link de prévia ainda não foi gerado para este projeto.",
        variant: "destructive"
      });
      return;
    }

    const previewUrl = `${window.location.origin}/client-preview/${project.preview_code}`;
    navigator.clipboard.writeText(previewUrl).then(() => {
      toast({
        title: "Link copiado!",
        description: "Link da prévia para o cliente foi copiado."
      });
    });
  };

  if (isLoading) {
    return (
      <NewAdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-harmonia-green mx-auto mb-4"></div>
              <p>Carregando projeto...</p>
            </div>
          </div>
        </div>
      </NewAdminLayout>
    );
  }

  if (!project) {
    return (
      <NewAdminLayout>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Projeto não encontrado</h2>
            <p className="text-gray-600 mb-4">O projeto solicitado não foi encontrado.</p>
            <Button onClick={() => navigate('/admin/projects')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Projetos
            </Button>
          </div>
        </div>
      </NewAdminLayout>
    );
  }

  return (
    <NewAdminLayout>
      <div className="p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/projects')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <p className="text-gray-600">Gerenciamento do projeto</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(project.status)}
          </div>
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-400" />
                <span>{project.client_name}</span>
              </div>
              {project.client_email && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{project.client_email}</span>
                </div>
              )}
              {project.client_phone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{project.client_phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Projeto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span>Criado em: {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
              {project.package_type && (
                <div>
                  <span className="font-medium">Pacote:</span> {project.package_type}
                </div>
              )}
              {project.expires_at && (
                <div>
                  <span className="font-medium">Expira em:</span> {new Date(project.expires_at).toLocaleDateString('pt-BR')}
                </div>
              )}
              <div>
                <span className="font-medium">Versões:</span> {project.versions.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações do Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setShowAddVersionDialog(true)}
                className="bg-harmonia-green hover:bg-harmonia-green/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Versão
              </Button>
              
              <Button
                variant="outline"
                onClick={copyClientPreviewLink}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Copiar Link Cliente
              </Button>

              {/* Botão para voltar ao status de aguardando - só aparece se não estiver aguardando */}
              {project.status !== 'waiting' && (
                <Button
                  variant="outline"
                  onClick={() => setShowBackToWaitingDialog(true)}
                  className="border-blue-500 text-blue-500 hover:bg-blue-50"
                  disabled={isUpdatingStatus}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {isUpdatingStatus ? 'Atualizando...' : 'Voltar para Aguardando'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Project History */}
        <ProjectHistory projectId={project.id} />

        {/* Versions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Versões do Projeto</h2>
            <span className="text-gray-500">{project.versions.length} versões</span>
          </div>
          
          {project.versions.length > 0 ? (
            <div className="space-y-4">
              {project.versions.map((version) => (
                <BandcampVersionCard
                  key={version.id}
                  version={{
                    id: version.id,
                    name: version.name,
                    description: version.description,
                    embedUrl: version.audio_url || '',
                    bandcampUrl: version.audio_url || '',
                    final: false,
                    recommended: version.recommended,
                    dateAdded: new Date(version.created_at).toLocaleDateString('pt-BR')
                  }}
                  projectId={project.id}
                  onDeleteVersion={deleteVersion}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">Nenhuma versão criada ainda.</p>
                <Button 
                  onClick={() => setShowAddVersionDialog(true)}
                  className="bg-harmonia-green hover:bg-harmonia-green/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeira Versão
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Add Version Dialog */}
        <AddVersionDialog
          isOpen={showAddVersionDialog}
          onOpenChange={setShowAddVersionDialog}
          projectId={project.id}
          packageType={project.package_type}
        />

        {/* Back to Waiting Dialog */}
        <BackToWaitingDialog
          isOpen={showBackToWaitingDialog}
          onOpenChange={setShowBackToWaitingDialog}
          onConfirm={handleBackToWaiting}
          isLoading={isUpdatingStatus}
        />
      </div>
    </NewAdminLayout>
  );
};

export default ProjectDetailsPage;
