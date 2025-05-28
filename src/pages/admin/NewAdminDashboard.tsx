
import React, { useState } from 'react';
import NewAdminLayout from '@/components/admin/layout/NewAdminLayout';
import AdminAuth from '@/components/admin/AdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Users, Clock, CheckCircle, Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjectManagement } from '@/hooks/useProjectManagement';

const NewAdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { projects } = useProjectManagement();

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const stats = {
    total: projects.length,
    waiting: projects.filter(p => p.status === 'waiting').length,
    feedback: projects.filter(p => p.status === 'feedback').length,
    approved: projects.filter(p => p.status === 'approved').length,
    clients: new Set(projects.map(p => p.client_email)).size
  };

  const recentProjects = projects.slice(0, 5);

  return (
    <NewAdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Visão geral do sistema harmonIA</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Music className="h-8 w-8 text-harmonia-green" />
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-gray-600 text-sm">Total Projetos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.waiting}</div>
                  <p className="text-gray-600 text-sm">Aguardando</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Music className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.feedback}</div>
                  <p className="text-gray-600 text-sm">Com Feedback</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.approved}</div>
                  <p className="text-gray-600 text-sm">Aprovados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.clients}</div>
                  <p className="text-gray-600 text-sm">Clientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full bg-harmonia-green hover:bg-harmonia-green/90">
                <Link to="/admin">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Projeto
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Todos os Projetos
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Projetos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {recentProjects.length > 0 ? (
                <div className="space-y-3">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="text-sm text-gray-600">{project.client_name}</p>
                      </div>
                      <div className="text-right">
                        <div className={`px-2 py-1 rounded text-xs ${
                          project.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                          project.status === 'feedback' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {project.status === 'waiting' ? 'Aguardando' :
                           project.status === 'feedback' ? 'Feedback' : 'Aprovado'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum projeto encontrado</p>
                  <Button asChild className="mt-4 bg-harmonia-green hover:bg-harmonia-green/90">
                    <Link to="/admin">
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Primeiro Projeto
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </NewAdminLayout>
  );
};

export default NewAdminDashboard;
