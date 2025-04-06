
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Activity {
  id: number;
  timestamp: string;
  description: string;
  type: string;
}

// Dados das atividades recentes
const recentActivities: Activity[] = [
  {
    id: 1,
    timestamp: 'Hoje, 14:30',
    description: 'Novo áudio adicionado: "Aniversário de 15 Anos - Julia"',
    type: 'audio_added'
  },
  {
    id: 2,
    timestamp: 'Hoje, 11:15',
    description: 'Pedido atualizado: #2023-056 "Música Corporativa - Tech Inovação"',
    type: 'order_updated'
  },
  {
    id: 3,
    timestamp: 'Ontem, 16:45',
    description: 'Novo item adicionado ao portfólio: "Casamento - Pedro e Maria"',
    type: 'portfolio_added'
  },
  {
    id: 4,
    timestamp: 'Ontem, 10:20',
    description: 'Novo cliente registrado: João Silva',
    type: 'client_registered'
  },
  {
    id: 5,
    timestamp: '02/04/2025, 13:10',
    description: 'Novo pedido recebido: #2025-023 "Música para Campanha Publicitária"',
    type: 'order_received'
  },
  {
    id: 6,
    timestamp: '01/04/2025, 09:45',
    description: 'Pagamento confirmado: #2025-021 "Trilha para Podcast"',
    type: 'payment_confirmed'
  }
];

// Função para determinar a cor do indicador com base no tipo da atividade
const getActivityColor = (type: string) => {
  switch (type) {
    case 'audio_added':
      return 'bg-blue-500';
    case 'order_updated':
      return 'bg-yellow-500';
    case 'portfolio_added':
      return 'bg-green-500';
    case 'client_registered':
      return 'bg-purple-500';
    case 'order_received':
      return 'bg-orange-500';
    case 'payment_confirmed':
      return 'bg-emerald-500';
    default:
      return 'bg-gray-500';
  }
};

interface ActivityItemProps {
  activity: Activity;
  isLast: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, isLast }) => (
  <React.Fragment>
    <div className="flex items-start py-2">
      <div className={cn("w-2 h-2 rounded-full mt-2 mr-3", getActivityColor(activity.type))}></div>
      <div className="flex flex-col space-y-1">
        <p className="text-sm text-gray-500">{activity.timestamp}</p>
        <p className="text-sm">{activity.description}</p>
      </div>
    </div>
    {!isLast && <Separator className="my-1" />}
  </React.Fragment>
);

interface RecentActivitiesProps {
  activities?: Activity[];
  maxItems?: number;
  showTitle?: boolean;
  className?: string;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ 
  activities = recentActivities,
  maxItems = 6,
  showTitle = true,
  className
}) => {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <Card className={className}>
      {showTitle && (
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimas ações no sistema</CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-1">
          {displayActivities.map((activity, index) => (
            <ActivityItem 
              key={activity.id} 
              activity={activity} 
              isLast={index === displayActivities.length - 1} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
