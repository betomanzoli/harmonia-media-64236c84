import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Music, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  title: string;
  status: 'waiting' | 'feedback' | 'approved';
  client_name: string;
  created_at: string;
}

const ClientDashboard: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      if (!orderId) return;
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', orderId)
          .single();

        if (error) throw error;
        
        // Transform the data to match the Project interface
        const transformedProject: Project = {
          id: data.id,
          title: data.title || 'Projeto harmonIA',
          status: (data.status === 'waiting' || data.status === 'feedback' || data.status === 'approved') 
            ? data.status 
            : 'waiting',
          client_name: data.client_name || 'Cliente',
          created_at: data.created_at
        };
        
        setProject(transformedProject);
      } catch (error) {
        console.error('Erro ao carregar projeto:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold mb-2">Projeto não encontrado</h2>
            <p className="text-gray-600 mb-4">O projeto solicitado não foi encontrado.</p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (project.status) {
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

  const getStatusText = () => {
    switch (project.status) {
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
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{project.title}</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon()}
                  <span className="text-sm">{getStatusText()}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Cliente</label>
                  <p>{project.client_name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Data de Criação</label>
                  <p>{new Date(project.created_at).toLocaleDateString('pt-BR')}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p className="capitalize">{getStatusText()}</p>
                </div>

                {project.status === 'waiting' && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-yellow-800">
                      Suas prévias musicais estão prontas para avaliação. 
                      Em breve você receberá o link para acessá-las.
                    </p>
                  </div>
                )}

                {project.status === 'feedback' && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-blue-800">
                      Recebemos seu feedback e estamos trabalhando nos ajustes solicitados.
                    </p>
                  </div>
                )}

                {project.status === 'approved' && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
                    <p className="text-green-800">
                      Projeto aprovado! Estamos finalizando sua música.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
