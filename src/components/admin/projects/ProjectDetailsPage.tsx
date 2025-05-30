import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, User, Mail, Phone, Calendar, ExternalLink } from 'lucide-react';
import NewAdminLayout from '@/components/admin/layout/NewAdminLayout';
import BandcampVersionCard from './BandcampVersionCard';
import AddVersionDialog from '../shared/AddVersionDialog';

interface BandcampVersion {
  id: string;
  name: string;
  description?: string;
  embedUrl: string;
  bandcampUrl: string;
  final?: boolean;
  recommended?: boolean;
  dateAdded: string;
  albumId?: string;
  trackId?: string;
}

interface Project {
  id: string;
  clientName: string;
  title: string;
  status: 'waiting' | 'feedback' | 'approved';
  packageType?: string;
  createdAt: string;
  expirationDate?: string;
  clientEmail?: string;
  clientPhone?: string;
  versions: BandcampVersion[];
}

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [showAddVersionDialog, setShowAddVersionDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - em produção viria do Supabase
  useEffect(() => {
    const loadProject = () => {
      setIsLoading(true);
      
      // Simulação de dados do projeto
      const mockProject: Project = {
        id: projectId || '1',
        clientName: 'João Silva',
        title: 'Música Personalizada - João Silva',
        status: 'waiting',
        packageType: 'Premium',
        createdAt: '15/01/2024',
        expirationDate: '15/02/2024',
        clientEmail: 'joao@email.com',
        clientPhone: '+55 11 99999-9999',
        versions: [
          {
            id: '1',
            name: 'Versão 1 - Mix Inicial',
            description: 'Primeira versão com arranjo básico',
            embedUrl: 'https://bandcamp.com/EmbeddedPlayer/album=4290875691/size=small/bgcol=333333/linkcol=2ebd35/track=2755730140/transparent=true/',
            bandcampUrl: 'https://harmonia-media.bandcamp.com/track/vozes-em-harmonia-ex-05',
            final: false,
            recommended: true,
            dateAdded: '15/01/2024',
            albumId: '4290875691',
            trackId: '2755730140'
          }
        ]
      };
      
      setProject(mockProject);
      setIsLoading(false);
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const handleAddVersion = (newVersion: BandcampVersion) => {
    if (!project) return;

    console.log('Adding version to project:', newVersion);
    
    setProject(prev => {
      if (!prev) return null;
      return {
        ...prev,
        versions: [...prev.versions, newVersion]
      };
    });

    toast({
      title: "Versão adicionada",
      description: `${newVersion.name} foi adicionada ao projeto.`
    });
  };

  const handleDeleteVersion = (versionId: string) => {
    if (!project) return;

    const versionToDelete = project.versions.find(v => v.id === versionId);
    if (!versionToDelete) return;

    setProject(prev => {
      if (!prev) return null;
      return {
        ...prev,
        versions: prev.versions.filter(v => v.id !== versionId)
      };
    });

    toast({
      title: "Versão removida",
      description: `${versionToDelete.name} foi removida do projeto.`,
      variant: "destructive"
    });
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
    const previewUrl = `${window.location.origin}/client-preview/${projectId}`;
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
                <span>{project.clientName}</span>
              </div>
              {project.clientEmail && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{project.clientEmail}</span>
                </div>
              )}
              {project.clientPhone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{project.clientPhone}</span>
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
                <span>Criado em: {project.createdAt}</span>
              </div>
              {project.packageType && (
                <div>
                  <span className="font-medium">Pacote:</span> {project.packageType}
                </div>
              )}
              {project.expirationDate && (
                <div>
                  <span className="font-medium">Expira em:</span> {project.expirationDate}
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
              {project.versions.map((version) => (
                <BandcampVersionCard
                  key={version.id}
                  version={version}
                  projectId={project.id}
                  onDeleteVersion={handleDeleteVersion}
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
          onAddVersion={handleAddVersion}
          packageType={project.packageType}
        />
      </div>
    </NewAdminLayout>
  );
};

export default ProjectDetailsPage;
