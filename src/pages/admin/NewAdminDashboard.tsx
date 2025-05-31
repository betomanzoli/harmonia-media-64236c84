
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import NewAdminLayout from '@/components/admin/layout/NewAdminLayout';
import { useProjects } from '@/hooks/admin/useProjects';

const NewAdminDashboard: React.FC = () => {
  const { projects, isLoading } = useProjects();

  const stats = {
    total: projects.length,
    waiting: projects.filter(p => p.status === 'waiting').length,
    feedback: projects.filter(p => p.status === 'feedback').length,
    approved: projects.filter(p => p.status === 'approved').length
  };

  return (
    <NewAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.total}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.waiting}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.feedback}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.approved}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Projetos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : projects.length > 0 ? (
              <div className="space-y-2">
                {projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-sm text-gray-600">{project.client_name}</p>
                    </div>
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        project.status === 'approved' ? 'bg-green-100 text-green-800' :
                        project.status === 'feedback' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status === 'approved' ? 'Aprovado' :
                         project.status === 'feedback' ? 'Feedback' : 'Aguardando'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Nenhum projeto encontrado</p>
            )}
          </CardContent>
        </Card>
      </div>
    </NewAdminLayout>
  );
};

export default NewAdminDashboard;
