import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, FolderOpen, Clock, CheckCircle } from 'lucide-react';
import { useClients } from '@/hooks/admin/useClients';
import { useProjects } from '@/hooks/admin/useProjects';

const NewAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { clients, isLoading: clientsLoading } = useClients();
  const { projects, loading: projectsLoading } = useProjects();

  // Calcular estatísticas reais baseadas nos dados do Supabase
  const stats = {
    clients: clients.length,
    projects: projects.length,
    pending: projects.filter(p => p.status === 'waiting').length,
    completed: projects.filter(p => p.status === 'approved').length
  };

  // Projetos recentes reais (últimos 3)
  const recentProjects = projects
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      client: p.client_name || 'Cliente',
      title: p.title,
      status: p.status,
      date: new Date(p.created_at).toLocaleDateString('pt-BR')
    }));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Aguardando</Badge>;
      case 'feedback':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Feedback</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Aprovado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const isLoading = clientsLoading || projectsLoading;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral do sistema administrativo</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => navigate('/admin/clients')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Gerenciar Clientes
          </Button>
          <Button 
            onClick={() => navigate('/admin/projects')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Projeto
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Carregando dados...</div>
        </div>
      )}

      {/* Statistics Cards */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.clients}</div>
              <p className="text-xs text-muted-foreground">
                Clientes cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.projects}</div>
              <p className="text-xs text-muted-foreground">
                Projetos criados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando feedback
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                Projetos aprovados
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Projects */}
      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Projetos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum projeto encontrado</p>
                <Button 
                  onClick={() => navigate('/admin/projects')}
                  className="mt-4"
                >
                  Criar Primeiro Projeto
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div 
                    key={project.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/admin/projects/${project.id}`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font
