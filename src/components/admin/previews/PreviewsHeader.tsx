import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, CreditCard, Users, Plus, BarChart4, Activity, Clock, ArrowUpRight } from 'lucide-react';
import { useProjects } from '@/hooks/admin/useProjects'; // ✅ CORRIGIDO

interface PreviewsHeaderProps {
  scrollToNewForm: () => void;
}

const PreviewsHeader: React.FC<PreviewsHeaderProps> = ({ scrollToNewForm }) => {
  const { projects } = useProjects(); // ✅ CORRIGIDO
  
  // Calcular estatísticas dinâmicas baseadas nos dados reais do projeto
  const activeProjects = projects.filter(p => p.status === 'waiting' || p.status === 'feedback').length;
  const approvalRate = projects.length > 0 
    ? Math.round((projects.filter(p => p.status === 'approved').length / projects.length) * 100) 
    : 0;
    
  // Obter clientes únicos usando email como identificador único
  const uniqueClients = [...new Set(projects.map(p => p.client_email))].length; // ✅ CORRIGIDO
  
  // Contagem total de projetos
  const totalProjects = projects.length;
  
  // Calcular tendência (comparado ao período anterior)
  // Em uma aplicação real, isso seria comparado com dados históricos
  const projectsTrend = 12; // Valor placeholder, deveria ser calculado a partir de dados históricos
  
  const stats = [
    {
      title: "Prévias Ativas",
      value: activeProjects.toString(),
      description: "Projetos em avaliação",
      icon: <BarChart4 className="h-5 w-5 text-blue-500" />,
      color: "border-blue-500 bg-blue-50/10 text-blue-500",
      trend: {
        value: projectsTrend,
        isPositive: true,
        icon: <ArrowUpRight className="h-3 w-3" />
      }
    },
    {
      title: "Taxa de Aprovação",
      value: `${approvalRate}%`,
      description: "Prévias aprovadas",
      icon: <CreditCard className="h-5 w-5 text-green-500" />,
      color: "border-green-500 bg-green-50/10 text-green-500"
    },
    {
      title: "Clientes",
      value: uniqueClients.toString(),
      description: "Total de clientes",
      icon: <Users className="h-5 w-5 text-purple-500" />,
      color: "border-purple-500 bg-purple-50/10 text-purple-500"
    },
    {
      title: "Projetos",
      value: totalProjects.toString(),
      description: "Total de projetos",
      icon: <Activity className="h-5 w-5 text-orange-500" />,
      color: "border-orange-500 bg-orange-50/10 text-orange-500"
    }
  ];

  return (
    <Card className="border-harmonia-green/30">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-harmonia-green">Prévias Musicais</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gerencie os projetos de prévias musicais para os clientes
            </p>
          </div>
          <Button
            onClick={scrollToNewForm}
            className="mt-4 sm:mt-0 bg-harmonia-green hover:bg-harmonia-green/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 flex items-center space-x-4 ${stat.color}`}
            >
              <div className="p-2 rounded-full bg-gray-900/20">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{stat.title}</p>
                <div className="flex items-center">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  {stat.trend && (
                    <span className={`ml-2 text-xs flex items-center ${stat.trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.trend.icon}
                      {stat.trend.value}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewsHeader;
