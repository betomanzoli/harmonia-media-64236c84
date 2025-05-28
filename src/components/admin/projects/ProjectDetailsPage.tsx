
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Copy, Clock, Mail, Phone, User, Calendar } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import NewAdminLayout from '../layout/NewAdminLayout';
import AddVersionDialog from './AddVersionDialog';
import BandcampVersionCard from './BandcampVersionCard';

interface Project {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  title: string;
  packageType: string;
  status: 'waiting' | 'feedback' | 'approved';
  createdAt: string;
  expirationDate: string;
  versions: any[];
}

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [isAddVersionOpen, setIsAddVersionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - em produção viria do Supabase
    if (projectId) {
      setTimeout(() => {
        const mockProject: Project = {
          id: projectId,
          clientName: 'João Silva',
          clientEmail: 'joao@email.com',
          clientPhone: '+55 11 99999-9999',
          title: 'Música Personalizada - João Silva',
          packageType: 'Profissional',
          status: 'waiting',
          createdAt: '2024-01-15',
          expirationDate: '2024-02-15',
          versions: [
            {
              id: '1',
              name: 'Versão 1 - Mix Inicial',
              description: 'Primeira versão com arranjo básico',
              embedUrl: 'https://bandcamp.com/EmbeddedPlayer/album=4290875691/track=1/',
              bandcampUrl: 'https://harmonia-media.bandcamp.com/album/promocionais-harmonia-01?t=1',
              albumId: '4290875691',
              trackId: '1',
              final: false,
              recommended: true,
              dateAdded: '2024-01-15'
            }
          ]
        };
        setProject(mockProject);
        setIsLoading(false);
      }, 1000);
    }
  }, [projectId]);

  const handleAddVersion = async (newVersion: any) => {
    if (!project) return;

    // Simular adição de versão
    const updatedProject = {
      ...project,
      versions: [...project.versions, newVersion]
    };
    
    setProject(updatedProject);
    
    toast({
      title: "Versão adicionada",
      description: `${newVersion.name} foi adicionada com player do Bandcamp.`
    });
  };

  const handleDeleteVersion = async (versionId: string) => {
    if (!project) return;

    const updatedProject = {
      ...project,
      versions: project.versions.filter(v => v.id !== versionId)
    };
    
    setProject(updatedProject);
    
    toast({
      title: "Versão removida",
      description: "A versão foi removida com sucesso."
    });
  };

  const copyClientPreviewLink = () => {
    const previewUrl = `${window.location.origin}/client-preview/${projectId}`;
    navigator.clipboard.writeText(previewUrl).then(() => {
      toast({
        title: "Link copiado!",
        description: "Link de prévia para o cliente foi copiado."
      });
    });
  };

  const handleWhatsApp = () => {
    if (project?.clientPhone) {
      const phone = project.clientPhone.replace(/\D/g, '');
      const message = `Olá ${project.clientName}! Suas prévias estão prontas. Acesse: ${window.location.origin}/client-preview/${projectId}`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const handleEmail = () => {
    if (project?.clientEmail) {
      const subject = `Suas prévias estão prontas - ${project.title}`;
      const body = `Olá ${project.clientName}!\n\nSuas prévias estão prontas para avaliação.\n\nAcesse: ${window.location.origin}/client-preview/${projectId}\n\nAtenciosamente,\nEquipe harmonIA`;
      window.open(`mailto:${project.clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      waiting: { label: 'Aguardando', color: 'bg-yellow-500' },
      feedback: { label: 'Feedback', color: 'bg-blue-500' },
      approved: { label: 'Aprovado', color: 'bg-green-500' }
    };
    
    const config = configs[status as keyof typeof configs];
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <NewAdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-harmonia-green"></div>
          </div>
        </div>
      </NewAdminLayout>
    );
  }

  if (!project) {
    return (
      <NewAdminLayout>
        <div className="p-6">
          <Button onClick={() => navigate('/admin/projects')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="text-center mt-16">
            <h2 className="text-2xl font-semibold mb-4">Projeto não encontrado</h2>
            <Button onClick={() => navigate('/admin/projects')}>
              Voltar para Projetos
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
          <Button variant="ghost" onClick={() => navigate('/admin/projects')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Projetos
          </Button>
          
          <div className="flex gap-2">
            <Button onClick={() => setIsAddVersionOpen(true)} className="bg-harmonia-green hover:bg-harmonia-green/90">
              <Plus className="mr-2 h-4 w-4" />
              Nova Versão
            </Button>
            
            <Button variant="outline" onClick={copyClientPreviewLink}>
              <Copy className="mr-2 h-4 w-4" />
              Link Cliente
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Project Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{project.title}</CardTitle>
                    <p className="text-gray-600 mt-1">Cliente: {project.clientName}</p>
                  </div>
                  {getStatusBadge(project.status)}
                </div>
              </CardHeader>
            </Card>

            {/* Versions */}
            <Card>
              <CardHeader>
                <CardTitle>Versões ({project.versions.length})</CardTitle>
              </CardHeader>
              <CardContent>
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
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhuma versão adicionada ainda.</p>
                    <Button 
                      onClick={() => setIsAddVersionOpen(true)}
                      className="mt-4"
                    >
                      Adicionar Primeira Versão
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Informações do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong>Nome:</strong>
                  <p className="text-gray-600">{project.clientName}</p>
                </div>
                <div>
                  <strong>Email:</strong>
                  <p className="text-gray-600">{project.clientEmail}</p>
                </div>
                {project.clientPhone && (
                  <div>
                    <strong>Telefone:</strong>
                    <p className="text-gray-600">{project.clientPhone}</p>
                  </div>
                )}
                <div>
                  <strong>Pacote:</strong>
                  <p className="text-gray-600">{project.packageType}</p>
                </div>
              </CardContent>
            </Card>

            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Informações do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong>Criado em:</strong>
                  <p className="text-gray-600">{project.createdAt}</p>
                </div>
                <div>
                  <strong>Expira em:</strong>
                  <p className="text-gray-600 flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {project.expirationDate}
                  </p>
                </div>
                <div>
                  <strong>Status:</strong>
                  <div className="mt-1">{getStatusBadge(project.status)}</div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Contatar Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleWhatsApp}
                  disabled={!project.clientPhone}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleEmail}
                  disabled={!project.clientEmail}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Add Version Dialog */}
        <AddVersionDialog
          isOpen={isAddVersionOpen}
          onOpenChange={setIsAddVersionOpen}
          projectId={project.id}
          onAddVersion={handleAddVersion}
          packageType={project.packageType}
        />

      </div>
    </NewAdminLayout>
  );
};

export default ProjectDetailsPage;
