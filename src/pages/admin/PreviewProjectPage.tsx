
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { ArrowLeft, FileMusic, MessageCircle, Clock, Calendar } from 'lucide-react';

const PreviewProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    // Simulate loading project data
    setTimeout(() => {
      setProject({
        id: projectId,
        title: `Projeto de Prévia #${projectId}`,
        clientName: 'Cliente Exemplo',
        clientEmail: 'cliente@exemplo.com',
        status: 'feedback',
        createdAt: '15/03/2023',
        expirationDate: '15/04/2023',
        feedback: 'Gostei muito da melodia, mas gostaria que o tempo fosse um pouco mais rápido. Também seria bom ter mais ênfase nos graves.',
        versions: [
          { id: 1, name: 'Versão Inicial', url: '#', dateAdded: '15/03/2023' },
          { id: 2, name: 'Versão Revisada', url: '#', dateAdded: '22/03/2023' }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [projectId]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Carregando detalhes do projeto...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!project) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-semibold mb-2">Projeto não encontrado</h2>
          <p className="text-gray-500 mb-4">O projeto solicitado não existe ou foi removido.</p>
          <Button asChild>
            <Link to="/admin-j28s7d1k/previews">Voltar para lista de projetos</Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Button variant="outline" asChild className="mb-2">
            <Link to="/admin-j28s7d1k/previews">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para lista de projetos
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{project.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Adicionar versão</Button>
          <Button>Enviar notificação</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações do cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Nome:</span>
                <p className="font-medium">{project.clientName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Email:</span>
                <p className="font-medium">{project.clientEmail}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status do projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-blue-600">Feedback recebido</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>Criado em: {project.createdAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Expira em: {project.expirationDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileMusic className="mr-2 h-4 w-4" />
                Enviar nova versão
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Estender prazo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="versions">
        <TabsList>
          <TabsTrigger value="versions">Versões</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>
        <TabsContent value="versions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Versões do projeto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.versions.map((version: any) => (
                  <div key={version.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">{version.name}</h3>
                      <p className="text-sm text-gray-500">Adicionado em {version.dateAdded}</p>
                    </div>
                    <Button variant="outline">Ouvir</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="feedback" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback do cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                <p>{project.feedback}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de atividades</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Cliente enviou feedback</span>
                  <span className="text-gray-500">25/03/2023 14:30</span>
                </li>
                <li className="flex justify-between">
                  <span>Versão 2 adicionada</span>
                  <span className="text-gray-500">22/03/2023 10:15</span>
                </li>
                <li className="flex justify-between">
                  <span>Cliente visualizou o projeto</span>
                  <span className="text-gray-500">18/03/2023 09:45</span>
                </li>
                <li className="flex justify-between">
                  <span>Versão 1 adicionada</span>
                  <span className="text-gray-500">15/03/2023 16:20</span>
                </li>
                <li className="flex justify-between">
                  <span>Projeto criado</span>
                  <span className="text-gray-500">15/03/2023 11:00</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default PreviewProjectPage;
