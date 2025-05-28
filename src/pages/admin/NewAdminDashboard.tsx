
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FolderOpen, Activity, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NewAdminLayout from '@/components/admin/layout/NewAdminLayout';

const NewAdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Clientes Ativos',
      value: '12',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Projetos em Andamento',
      value: '8',
      icon: FolderOpen,
      color: 'text-green-600'
    },
    {
      title: 'Aguardando Feedback',
      value: '3',
      icon: Activity,
      color: 'text-orange-600'
    }
  ];

  return (
    <NewAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/admin/clients/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
            <Button onClick={() => navigate('/admin/projects/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Projetos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* This will be populated with real data */}
              <div className="text-gray-500 text-center py-8">
                Nenhum projeto recente encontrado
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </NewAdminLayout>
  );
};

export default NewAdminDashboard;
