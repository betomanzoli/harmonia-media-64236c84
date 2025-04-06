
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Dados das atividades recentes
const recentActivities = [
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

const RecentActivities = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>Últimas ações no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <React.Fragment key={activity.id}>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${getActivityColor(activity.type)}`}></div>
                <p className="text-sm text-gray-500">{activity.timestamp}</p>
                <p className="ml-4">{activity.description}</p>
              </div>
              {activity.id !== recentActivities.length && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
