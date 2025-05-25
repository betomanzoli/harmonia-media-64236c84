
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, FileText, Download, Eye, Music, Play } from 'lucide-react';
import { usePreviewProjects, ProjectItem } from '@/hooks/admin/usePreviewProjects';

interface Project {
  id: string;
  title: string;
  client: string;
  date: string;
  lastActivity: string;
  status: string;
  versions: number;
  hasVersions: boolean;
  previewLink: string;
  created_at: string;
  updated_at: string;
  delivery_files?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

const ClientDashboard: React.FC = () => {
  const [clientEmail, setClientEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { projects: allProjects } = usePreviewProjects();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, informe seu email para acessar seus projetos.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simular autenticação
    setTimeout(() => {
      const clientProjects = allProjects.filter(p => 
        p.client_email.toLowerCase() === clientEmail.toLowerCase()
      );
      
      if (clientProjects.length === 0) {
        toast({
          title: "Nenhum projeto encontrado",
          description: "Não encontramos projetos associados a este email.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Convert ProjectItem to Project format
      const formattedProjects: Project[] = clientProjects.map(p => ({
        id: p.id,
        title: `Projeto ${p.package_type || 'Musical'}`,
        client: p.client_name,
        date: p.created_at,
        lastActivity: p.last_activity_date || p.created_at,
        status: p.status,
        versions: p.versions_list?.length || 0,
        hasVersions: (p.versions_list?.length || 0) > 0,
        previewLink: p.preview_url || `/preview/${p.id}`,
        created_at: p.created_at,
        updated_at: p.last_activity_date || p.created_at
      }));

      setProjects(formattedProjects);
      setIsAuthenticated(true);
      setIsLoading(false);
      
      toast({
        title: "Acesso autorizado",
        description: `Encontramos ${formattedProjects.length} projeto(s) para você.`
      });
    }, 1000);
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'waiting':
        return 'Aguardando sua avaliação';
      case 'feedback':
        return 'Em ajustes conforme seu feedback';
      case 'approved':
        return 'Projeto aprovado - Finalização em andamento';
      default:
        return 'Em processamento';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'feedback':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const mockProjects: Project[] = [
    {
      id: 'P0001',
      title: 'Música Comercial - Projeto Empresa ABC',
      client: 'João Silva',
      date: '2024-01-15',
      lastActivity: '2024-01-20',
      status: 'approved',
      versions: 3,
      hasVersions: true,
      previewLink: '/preview/P0001',
      created_at: '2024-01-15',
      updated_at: '2024-01-20',
      delivery_files: [
        { name: 'Musica_Final_Master.wav', url: '#', type: 'audio' },
        { name: 'Stems_Separados.zip', url: '#', type: 'archive' }
      ]
    },
    {
      id: 'P0002', 
      title: 'Trilha Sonora - Vídeo Institucional',
      client: 'Maria Santos',
      date: '2024-01-18',
      lastActivity: '2024-01-22',
      status: 'feedback',
      versions: 2,
      hasVersions: true,
      previewLink: '/preview/P0002',
      created_at: '2024-01-18',
      updated_at: '2024-01-22'
    },
    {
      id: 'P0003',
      title: 'Música para Podcast - Vinheta',
      client: 'Carlos Oliveira',
      date: '2024-01-20',
      lastActivity: '2024-01-20',
      status: 'waiting',
      versions: 1,
      hasVersions: true,
      previewLink: '/preview/P0003',
      created_at: '2024-01-20',
      updated_at: '2024-01-20'
    }
  ];

  // Função para adicionar projetos mock se não houver projetos reais
  const displayProjects = projects.length > 0 ? projects : (isAuthenticated ? mockProjects : []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20 px-6 md:px-10">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Acesso à Área do Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email cadastrado no projeto
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-harmonia-green"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Verificando...' : 'Acessar Meus Projetos'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Meus Projetos</h1>
            <p className="text-gray-600">Acompanhe o andamento dos seus projetos musicais</p>
          </div>

          <div className="grid gap-6">
            {displayProjects.map(project => (
              <Card key={project.id} className="border border-gray-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Criado em {project.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Última atividade: {project.lastActivity}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {getStatusText(project.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Status do Projeto</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Versões disponíveis:</span>
                          <span className="font-medium">{project.versions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tem versões para avaliar:</span>
                          <span className={`font-medium ${project.hasVersions ? 'text-green-600' : 'text-gray-400'}`}>
                            {project.hasVersions ? 'Sim' : 'Não'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Ações Disponíveis</h4>
                      <div className="space-y-2">
                        {project.hasVersions && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
                            onClick={() => navigate(project.previewLink)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Ouvir Prévias
                          </Button>
                        )}
                        
                        {project.status === 'approved' && project.delivery_files && project.delivery_files.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-700">Arquivos finais:</p>
                            {project.delivery_files.map((file, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => window.open(file.url, '_blank')}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                {file.name}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {project.status === 'waiting' && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex items-center">
                        <Music className="h-5 w-5 text-yellow-600 mr-2" />
                        <div>
                          <p className="font-medium text-yellow-800">Prévias disponíveis para avaliação</p>
                          <p className="text-sm text-yellow-700">
                            Suas prévias musicais estão prontas! Clique em "Ouvir Prévias" para avaliar e dar seu feedback.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {project.status === 'feedback' && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-600 mr-2" />
                        <div>
                          <p className="font-medium text-blue-800">Aguardando novas versões</p>
                          <p className="text-sm text-blue-700">
                            Recebemos seu feedback e estamos trabalhando nos ajustes. Novas versões serão disponibilizadas em breve.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {project.status === 'approved' && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center">
                        <Download className="h-5 w-5 text-green-600 mr-2" />
                        <div>
                          <p className="font-medium text-green-800">Projeto aprovado e finalizado</p>
                          <p className="text-sm text-green-700">
                            Parabéns! Seu projeto foi aprovado e finalizado. Os arquivos finais estão disponíveis para download.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {displayProjects.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum projeto encontrado</h3>
                <p className="text-gray-500">
                  Não encontramos projetos associados ao seu email. Verifique se digitou corretamente ou entre em contato conosco.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientDashboard;
