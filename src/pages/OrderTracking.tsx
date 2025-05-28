
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search, Music, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  status: 'waiting' | 'feedback' | 'approved';
  client_name: string;
  created_at: string;
  client_email: string;
}

const OrderTracking: React.FC = () => {
  const [email, setEmail] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!email) {
      toast({
        title: "Email necessário",
        description: "Por favor, insira seu email para buscar seus projetos.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('client_email', email)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProjects: Project[] = (data || []).map(project => ({
        id: project.id,
        title: project.title || 'Projeto harmonIA',
        status: (['waiting', 'feedback', 'approved'].includes(project.status) 
          ? project.status 
          : 'waiting') as 'waiting' | 'feedback' | 'approved',
        client_name: project.client_name || 'Cliente',
        created_at: project.created_at,
        client_email: project.client_email || ''
      }));

      setProjects(formattedProjects);
      setSearched(true);

      if (formattedProjects.length === 0) {
        toast({
          title: "Nenhum projeto encontrado",
          description: "Não encontramos projetos associados a este email.",
        });
      }
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      toast({
        title: "Erro na busca",
        description: "Houve um erro ao buscar seus projetos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'feedback':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Music className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'Aguardando sua avaliação';
      case 'feedback':
        return 'Feedback enviado - Em ajustes';
      case 'approved':
        return 'Projeto aprovado';
      default:
        return 'Em processamento';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            asChild
            className="mb-6"
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-6 w-6 mr-2" />
                Acompanhar Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  type="email"
                  placeholder="Digite seu email para buscar seus projetos"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-harmonia-green hover:bg-harmonia-green/90"
                >
                  {loading ? "Buscando..." : "Buscar"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {searched && (
            <div className="space-y-4">
              {projects.length > 0 ? (
                <>
                  <h2 className="text-xl font-bold mb-4">
                    {projects.length} projeto(s) encontrado(s)
                  </h2>
                  {projects.map((project) => (
                    <Card key={project.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{project.title}</span>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(project.status)}
                            <span className="text-sm">{getStatusText(project.status)}</span>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Cliente</label>
                            <p>{project.client_name}</p>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-600">Data de Criação</label>
                            <p>{new Date(project.created_at).toLocaleDateString('pt-BR')}</p>
                          </div>

                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-600">Status Atual</label>
                            <p className="capitalize">{getStatusText(project.status)}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Button asChild variant="outline" className="w-full md:w-auto">
                            <Link to={`/client-dashboard/${project.id}`}>
                              Ver Detalhes Completos
                            </Link>
                          </Button>
                        </div>

                        {project.status === 'waiting' && (
                          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                            <p className="text-yellow-800">
                              Suas prévias musicais estão prontas para avaliação. 
                              Em breve você receberá o link para acessá-las.
                            </p>
                          </div>
                        )}

                        {project.status === 'feedback' && (
                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-blue-800">
                              Recebemos seu feedback e estamos trabalhando nos ajustes solicitados.
                            </p>
                          </div>
                        )}

                        {project.status === 'approved' && (
                          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                            <p className="text-green-800">
                              Projeto aprovado! Estamos finalizando sua música.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Music className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">Nenhum projeto encontrado</h3>
                    <p className="text-gray-600 mb-4">
                      Não encontramos projetos associados ao email "{email}".
                    </p>
                    <p className="text-sm text-gray-500">
                      Verifique se o email está correto ou entre em contato conosco.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
