
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { n8nIntegrationService } from '@/services/webhookIntegrationService';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { useBriefings } from '@/hooks/admin/useBriefings';

interface Activity {
  id: number;
  timestamp: string;
  description: string;
  type: string;
}

interface RecentActivitiesProps {
  activities?: Activity[];
  maxItems?: number;
  showTitle?: boolean;
  className?: string;
}

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
        <p className="text-sm text-gray-400">{activity.timestamp}</p>
        <p className="text-sm text-gray-200">{activity.description}</p>
      </div>
    </div>
    {!isLast && <Separator className="my-1 bg-gray-700" />}
  </React.Fragment>
);

const RecentActivities: React.FC<RecentActivitiesProps> = ({ 
  maxItems = 6,
  showTitle = true,
  className
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { projects } = usePreviewProjects();
  const { briefings } = useBriefings();
  
  // Função para gerar atividades com base nos dados atuais do sistema
  useEffect(() => {
    const generateRecentActivities = () => {
      const newActivities: Activity[] = [];
      
      // Adicionar atividades de projetos
      if (projects && projects.length > 0) {
        projects.forEach((project, index) => {
          if (index < 5) { // Limitar a 5 projetos para não sobrecarregar
            newActivities.push({
              id: newActivities.length + 1,
              timestamp: formatDate(project.lastActivityDate),
              description: `Projeto atualizado: ${project.packageType || 'Música Personalizada'} - ${project.clientName}`,
              type: project.status === 'approved' ? 'order_updated' : project.status === 'feedback' ? 'order_received' : 'audio_added'
            });
          }
        });
      }
      
      // Adicionar atividades de briefings
      if (briefings && briefings.length > 0) {
        briefings.forEach((briefing, index) => {
          if (index < 5) { // Limitar a 5 briefings para não sobrecarregar
            newActivities.push({
              id: newActivities.length + 1,
              timestamp: formatDate(briefing.createdAt),
              description: `Novo briefing recebido: ${briefing.packageType || 'Música Personalizada'}`,
              type: 'order_received'
            });
          }
        });
      }
      
      // Ordenar por data (mais recente primeiro)
      newActivities.sort((a, b) => {
        const dateA = new Date(a.timestamp.split(', ')[0].split('/').reverse().join('-'));
        const dateB = new Date(b.timestamp.split(', ')[0].split('/').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
      });
      
      // Adicionar algumas atividades fixas se não tiver o suficiente
      if (newActivities.length < 3) {
        newActivities.push(
          {
            id: newActivities.length + 1,
            timestamp: 'Hoje, 14:30',
            description: 'Novo áudio adicionado: "Aniversário de 15 Anos - Julia"',
            type: 'audio_added'
          },
          {
            id: newActivities.length + 2,
            timestamp: 'Ontem, 16:45',
            description: 'Novo item adicionado ao portfólio: "Casamento - Pedro e Maria"',
            type: 'portfolio_added'
          }
        );
      }
      
      return newActivities.slice(0, maxItems);
    };
    
    setActivities(generateRecentActivities());
  }, [projects, briefings, maxItems]);
  
  // Função para formatar datas
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Hoje, 12:00';
    
    const now = new Date();
    const date = new Date(dateString);
    
    // Verificar se a data é de hoje
    if (date.toDateString() === now.toDateString()) {
      return `Hoje, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // Verificar se a data é de ontem
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Ontem, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // Outras datas
    return `${date.toLocaleDateString('pt-BR')}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const displayActivities = activities.slice(0, maxItems);

  return (
    <Card className={cn("bg-gray-800/60 border-gray-700 shadow-md", className)}>
      {showTitle && (
        <CardHeader>
          <CardTitle className="text-gray-100">Atividades Recentes</CardTitle>
          <CardDescription className="text-gray-400">Últimas ações no sistema</CardDescription>
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
