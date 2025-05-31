
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FolderOpen, Clock, CheckCircle, Plus, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NewAdminLayout from '@/components/admin/layout/NewAdminLayout';

const NewAdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = {
    clients: 12,
    projects: 8,
    pending: 3,
    completed: 5
  };

  const recentProjects = [
    { id: '1', client: 'João Silva', title: 'Música Personalizada', status: 'waiting', date: '20/01/2024' },
    { id: '2', client: 'Maria Santos', title: 'Trilha Sonora', status: 'feedback', date: '18/01/2024' },
    { id: '3', client: 'Pedro Oliveira', title: 'Jingle Comercial', status: 'approved', date: '15/01/2024' }
  ];

  const handleNewClient = () => {
    navigate('/admin/clients');
  };

  const handleNewProject = () => {
    navigate('/admin/projects');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      waiting: 'text-yellow-600',
      feedback: 'text-blue-600',
      approved: 'text-green-600'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      waiting: 'Aguardando',
      feedback: 'Feedback',
      approved: 'Aprovado'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <NewAdminLayout>
      <div className="p-6 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Visão geral dos projetos e clientes</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleNewClient} 
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
            <Button 
              onClick={handleNewProject}
              className="bg-harmonia-green hover:bg-harmonia-green/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Projeto
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                  <p className="text-2xl font-bold">{stats.clients}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FolderOpen className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Projetos</p>
                  <p className="text-2xl font-bold">{stats.projects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Concluídos</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => navigate('/admin/clients')} 
                variant="outline" 
                className="h-20 flex flex-col"
              >
                <Users className="h-6 w-6 mb-2" />
                Gerenciar Clientes
              </Button>
              
              <Button 
                onClick={() => navigate('/admin/projects')} 
                variant="outline" 
                className="h-20 flex flex-col"
              >
                <FolderOpen className="h-6 w-6 mb-2" />
                Gerenciar Projetos
              </Button>
              
              <Button 
                onClick={handleNewProject}
                variant="outline" 
                className="h-20 flex flex-col bg-harmonia-green/10 border-harmonia-green text-harmonia-green hover:bg-harmonia-green hover:text-white"
              >
                <Plus className="h-6 w-6 mb-2" />
                Novo Projeto
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Projetos Recentes</CardTitle>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/admin/projects')}
              >
                Ver Todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div 
                  key={project.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/admin/projects/${project.id}`)}
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{project.title}</h4>
                    <p className="text-sm text-gray-600">{project.client}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </p>
                    <p className="text-xs text-gray-500">{project.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Resumo do Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Novos Clientes</span>
                  <span className="font-semibold">+3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Projetos Iniciados</span>
                  <span className="font-semibold">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Projetos Finalizados</span>
                  <span className="font-semibold">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de Aprovação</span>
                  <span className="font-semibold text-green-600">85%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status dos Projetos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Aguardando Feedback</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="font-semibold">{stats.pending}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Em Revisão</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="font-semibold">2</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Aprovados</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="font-semibold">{stats.completed}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </NewAdminLayout>
  );
};

export default NewAdminDashboard;
