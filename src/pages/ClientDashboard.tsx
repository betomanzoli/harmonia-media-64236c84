
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2, Music, Clock, CheckCircle, AlertTriangle, FileAudio, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoogleDrivePreviewsList from '@/components/previews/GoogleDrivePreviewsList';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';

interface Project {
  id: string;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
  preview_link?: string;
  delivery_files?: string[];
  versions?: number;
  versionsList?: any[];
  previewUrl?: string;
}

const ClientDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projects: adminProjects } = usePreviewProjects();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/auth/preview/login');
          return;
        }
        
        setUser(session.user);
        fetchProjects(session.user.id);
      } catch (error) {
        console.error('Error checking auth:', error);
        toast({
          title: 'Erro de autenticação',
          description: 'Não foi possível verificar seu login. Por favor, tente novamente.',
          variant: 'destructive'
        });
        navigate('/auth/preview/login');
      }
    };
    
    checkAuth();
  }, [navigate, toast]);
  
  const fetchProjects = async (userId: string) => {
    setIsLoading(true);
    try {
      // Use the admin projects from usePreviewProjects hook for now
      // Later this will be replaced with a query to the actual user projects
      
      // Map admin projects to client projects format
      const clientProjects = adminProjects.map(adminProject => {
        // Convert status from admin format to client format
        let clientStatus = 'em_andamento';
        if (adminProject.status === 'approved') {
          clientStatus = 'aprovado';
        } else if (adminProject.status === 'feedback') {
          clientStatus = 'aguardando_feedback';
        }
        
        return {
          id: adminProject.id,
          title: adminProject.packageType || 'Música Personalizada',
          status: clientStatus,
          created_at: adminProject.createdAt,
          updated_at: adminProject.lastActivityDate || adminProject.createdAt,
          preview_link: `/preview/${adminProject.id}`,
          versions: adminProject.versions || 0,
          versionsList: adminProject.versionsList || [],
          previewUrl: adminProject.previewUrl
        };
      });
      
      // If there are no admin projects, use mockProjects
      if (clientProjects.length === 0) {
        const mockProjects: Project[] = [
          {
            id: 'P0001',
            title: 'Música para Casamento',
            status: 'em_andamento',
            created_at: '2023-11-10T14:23:00Z',
            updated_at: '2023-11-12T09:15:00Z',
            preview_link: '/preview/P0001'
          },
          {
            id: 'P0002',
            title: 'Jingle Publicitário',
            status: 'aprovado',
            created_at: '2023-10-05T11:30:00Z',
            updated_at: '2023-10-20T16:45:00Z',
            preview_link: '/preview/P0002',
            delivery_files: ['música_final.wav', 'música_final.mp3', 'stems.zip']
          },
          {
            id: 'P0003',
            title: 'Trilha para Vídeo Corporativo',
            status: 'aguardando_feedback',
            created_at: '2023-11-18T08:20:00Z',
            updated_at: '2023-11-20T14:10:00Z',
            preview_link: '/preview/P0003'
          }
        ];
        
        setProjects(mockProjects);
      } else {
        setProjects(clientProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Erro ao carregar projetos',
        description: 'Não foi possível carregar seus projetos. Por favor, atualize a página.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'em_andamento':
        return <div className="flex items-center"><Clock className="h-4 w-4 text-blue-500 mr-1" /> <span className="text-blue-500">Em andamento</span></div>;
      case 'aprovado':
        return <div className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-1" /> <span className="text-green-500">Aprovado</span></div>;
      case 'aguardando_feedback':
        return <div className="flex items-center"><AlertTriangle className="h-4 w-4 text-amber-500 mr-1" /> <span className="text-amber-500">Aguardando feedback</span></div>;
      default:
        return <div className="flex items-center"><Clock className="h-4 w-4 text-gray-500 mr-1" /> <span className="text-gray-500">{status}</span></div>;
    }
  };
  
  const viewProjectDetails = (project: Project) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };
  
  const backToProjectsList = () => {
    setSelectedProject(null);
    setShowProjectDetails(false);
  };
  
  const viewDeliveryFiles = (projectId: string) => {
    navigate(`/deliveries/${projectId}`);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-harmonia-green mb-4" />
        <h2 className="text-xl font-medium text-gray-700">Carregando seus projetos...</h2>
      </div>
    );
  }

  if (showProjectDetails && selectedProject) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center text-gray-600"
            onClick={backToProjectsList}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar aos projetos
          </Button>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedProject.title}</h1>
            <div className="flex items-center space-x-3">
              {getStatusBadge(selectedProject.status)}
              <span className="text-sm text-gray-500">
                Última atualização: {new Date(selectedProject.updated_at).toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
          
          <div className="space-y-8">
            <GoogleDrivePreviewsList projectId={selectedProject.id} title="Prévias disponíveis" />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Ações disponíveis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {selectedProject.status === 'aprovado' && (
                    <Button 
                      variant="default"
                      className="bg-harmonia-green hover:bg-harmonia-green/90"
                      onClick={() => viewDeliveryFiles(selectedProject.id)}
                    >
                      <FileAudio className="h-4 w-4 mr-2" />
                      Ver arquivos finais
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/preview/${selectedProject.id}`)}
                  >
                    <Music className="h-4 w-4 mr-2" />
                    Ver página de prévias
                  </Button>
                  
                  {selectedProject.status !== 'aprovado' && (
                    <Button variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Enviar feedback
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard do Cliente</h1>
          <p className="text-gray-600">
            Bem-vindo, {user?.email}! Aqui você pode acompanhar todos os seus projetos.
          </p>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="active">Em Andamento</TabsTrigger>
            <TabsTrigger value="completed">Concluídos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <Card key={project.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription>
                        Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Status:</span>
                          {getStatusBadge(project.status)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Última atualização:</span>
                          <span className="text-sm">{new Date(project.updated_at).toLocaleString('pt-BR')}</span>
                        </div>
                        {project.versions && project.versions > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Versões disponíveis:</span>
                            <span className="text-sm">{project.versions}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 justify-end pt-3 border-t">
                      {project.preview_link && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(project.preview_link!)}
                          className="flex items-center gap-1"
                        >
                          <Music className="h-4 w-4" />
                          Ver prévias
                        </Button>
                      )}
                      
                      <Button 
                        variant="default" 
                        size="sm"
                        className="bg-harmonia-green hover:bg-harmonia-green/90"
                        onClick={() => viewProjectDetails(project)}
                      >
                        Ver detalhes
                      </Button>
                      
                      {project.status === 'aprovado' && project.delivery_files && project.delivery_files.length > 0 && (
                        <Button 
                          variant="default" 
                          size="sm"
                          className="bg-harmonia-green hover:bg-harmonia-green/90 flex items-center gap-1"
                          onClick={() => viewDeliveryFiles(project.id)}
                        >
                          <FileAudio className="h-4 w-4" />
                          Download
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 bg-white rounded-lg border">
                  <Music className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">Nenhum projeto encontrado</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Você ainda não possui projetos. Comece criando um novo projeto.
                  </p>
                  <div className="mt-6">
                    <Button 
                      onClick={() => navigate('/briefing')}
                      className="bg-harmonia-green hover:bg-harmonia-green/90"
                    >
                      Iniciar novo projeto
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {projects.filter(p => p.status === 'em_andamento' || p.status === 'aguardando_feedback').length > 0 ? (
                projects
                  .filter(p => p.status === 'em_andamento' || p.status === 'aguardando_feedback')
                  .map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>
                          Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Status:</span>
                            {getStatusBadge(project.status)}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Última atualização:</span>
                            <span className="text-sm">{new Date(project.updated_at).toLocaleString('pt-BR')}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2 justify-end pt-3 border-t">
                        {project.preview_link && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(project.preview_link!)}
                            className="flex items-center gap-1"
                          >
                            <Music className="h-4 w-4" />
                            Ver prévias
                          </Button>
                        )}
                        <Button 
                          variant="default" 
                          size="sm"
                          className="bg-harmonia-green hover:bg-harmonia-green/90"
                          onClick={() => viewProjectDetails(project)}
                        >
                          Ver detalhes
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
              ) : (
                <div className="col-span-2 text-center py-12 bg-white rounded-lg border">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">Nenhum projeto em andamento</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Você não possui projetos em andamento no momento.
                  </p>
                  <div className="mt-6">
                    <Button 
                      onClick={() => navigate('/briefing')}
                      className="bg-harmonia-green hover:bg-harmonia-green/90"
                    >
                      Iniciar novo projeto
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {projects.filter(p => p.status === 'aprovado').length > 0 ? (
                projects
                  .filter(p => p.status === 'aprovado')
                  .map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>
                          Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Status:</span>
                            {getStatusBadge(project.status)}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Entregue em:</span>
                            <span className="text-sm">{new Date(project.updated_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2 justify-end pt-3 border-t">
                        <Button 
                          variant="default" 
                          size="sm"
                          className="bg-harmonia-green hover:bg-harmonia-green/90"
                          onClick={() => viewProjectDetails(project)}
                        >
                          Ver detalhes
                        </Button>
                        {project.delivery_files && project.delivery_files.length > 0 && (
                          <Button 
                            variant="default" 
                            size="sm"
                            className="bg-harmonia-green hover:bg-harmonia-green/90 flex items-center gap-1"
                            onClick={() => viewDeliveryFiles(project.id)}
                          >
                            <FileAudio className="h-4 w-4" />
                            Download
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate('/briefing')}
                          className="flex items-center gap-1"
                        >
                          <Music className="h-4 w-4" />
                          Novo projeto
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
              ) : (
                <div className="col-span-2 text-center py-12 bg-white rounded-lg border">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">Nenhum projeto concluído</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Você ainda não possui projetos concluídos.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Componente ArrowLeft para ser utilizado no botão de voltar
const ArrowLeft: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export default ClientDashboard;
