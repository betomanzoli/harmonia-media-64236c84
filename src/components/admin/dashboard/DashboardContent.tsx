
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, DollarSign, Activity } from 'lucide-react';
import { useClients } from '@/hooks/admin/useClients';
import { useProjects } from '@/hooks/admin/useProjects';

const DashboardContent: React.FC = () => {
  const { clients } = useClients();
  const { projects } = useProjects();

  const stats = [
    {
      title: "Total de Clientes",
      value: clients.length,
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-600"
    },
    {
      title: "Projetos Ativos",
      value: projects.filter(p => p.status === 'waiting' || p.status === 'feedback').length,
      icon: <Activity className="h-5 w-5" />,
      color: "text-green-600"
    },
    {
      title: "Total de Projetos",
      value: projects.length,
      icon: <FileText className="h-5 w-5" />,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={stat.color}>{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardContent;
