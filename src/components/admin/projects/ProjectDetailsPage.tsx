
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, User, Mail, Phone, Calendar, ExternalLink } from 'lucide-react';
import NewAdminLayout from '@/components/admin/layout/NewAdminLayout';
import BandcampVersionCard from './BandcampVersionCard';
import AddVersionDialog from './AddVersionDialog';
import { useProjects } from '@/hooks/admin/useProjects';

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projects, isLoading, loadProjects, deleteVersion } = useProjects();
  
  const [showAddVersionDialog, setShowAddVersionDialog] = useState(false);

  console.log('[ProjectDetailsPage] Render iniciado:', { projectId, isLoading, projectsCount: projects.length });

  const project = projects.find(p => p.id === projectId);
  
  console.log('[ProjectDetailsPage] Projeto encontrado:', project ? 'SIM' : 'NÃO', project?.id);

  useEffect(() => {
    console.log('[ProjectDetailsPage] useEffect executado:', { projectId, project: !!project, isLoading });
    
    if (!isLoading && !project && projectId) {
      console.log('[ProjectDetailsPage] Recarregando projetos...');
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

  console.log('[ProjectDetailsPage] Estado antes do render:', { isLoading, project: !!project });

  if (isLoading) {
    console.log('[ProjectDetailsPage] Renderizando loading...');
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
    console.log('[ProjectDetailsPage] Projeto não encontrado, renderizando erro...');
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

  console.log('[ProjectDetailsPage] Renderizando projeto:', project.id, 'Versões:', project.versions.length);

  try {
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
              </div>
            </CardContent>
          </Card>

          {/* Versions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Versões do Projeto</h2>
              <span className="text-gray-500">{project.versions.length} versões</span>
            </div>
            
            {project.versions.length > 0 ? (
              <div className="space-y-4">
                {project.versions.map((version, index) => {
                  console.log(`[ProjectDetailsPage] Renderizando versão ${index}:`, version.id, version.name);
                  
                  try {
                    return (
                      <BandcampVersionCard
                        key={version.id}
                        version={{
                          id: version.id,
                          name: version.name,
                          description: version.description,
                          embed_url: version.audio_url || '',
                          bandcamp_url: version.audio_url || '',
                          original_bandcamp_url: version.audio_url || '',
                          audio_url: version.audio_url || '',
                          recommended: version.recommended,
                          created_at: version.created_at
                        }}
                        projectId={project.id}
                        onDeleteVersion={handleDeleteVersion}
                      />
                    );
                  } catch (error) {
                    console.error(`[ProjectDetailsPage] Erro ao renderizar versão ${version.id}:`, error);
                    return (
                      <Card key={version.id} className="p-4 border-red-200">
                        <p className="text-red-600">Erro ao carregar versão: {version.name}</p>
                      </Card>
                    );
                  }
                })}
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
            setIsOpen={setShowAddVersionDialog}
            projectId={project.id}
            packageType={project.package_type}
            onVersionAdded={loadProjects}
          />
        </div>
      </NewAdminLayout>
    );
  } catch (error) {
    console.error('[ProjectDetailsPage] Erro geral no render:', error);
    return (
      <NewAdminLayout>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Erro na página</h2>
            <p className="text-gray-600 mb-4">Ocorreu um erro ao carregar a página do projeto.</p>
            <Button onClick={() => navigate('/admin/projects')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Projetos
            </Button>
          </div>
        </div>
      </NewAdminLayout>
    );
  }
};

export default ProjectDetailsPage;
