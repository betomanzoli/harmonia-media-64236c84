
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, CreditCard, Users, Plus, BarChart4 } from 'lucide-react';

interface PreviewsHeaderProps {
  scrollToNewForm: () => void;
}

const PreviewsHeader: React.FC<PreviewsHeaderProps> = ({ scrollToNewForm }) => {
  const stats = [
    {
      title: "Prévias Ativas",
      value: "8",
      description: "Projetos em avaliação",
      icon: <BarChart4 className="h-5 w-5 text-blue-500" />,
      color: "border-blue-500 bg-blue-50/10 text-blue-500"
    },
    {
      title: "Taxa de Aprovação",
      value: "87%",
      description: "Prévias aprovadas",
      icon: <CreditCard className="h-5 w-5 text-green-500" />,
      color: "border-green-500 bg-green-50/10 text-green-500"
    },
    {
      title: "Clientes",
      value: "36",
      description: "Total de clientes",
      icon: <Users className="h-5 w-5 text-purple-500" />,
      color: "border-purple-500 bg-purple-50/10 text-purple-500"
    },
    {
      title: "Projetos",
      value: "42",
      description: "Total de projetos",
      icon: <DollarSign className="h-5 w-5 text-orange-500" />,
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
                <h3 className="text-2xl font-bold">{stat.value}</h3>
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
