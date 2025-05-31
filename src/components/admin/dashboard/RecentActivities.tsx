import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useProjects } from '@/hooks/admin/useProjects'; // ✅ CORRIGIDO

interface Activity {
  id: number;
  timestamp: string;
  description: string;
  type: string;
}

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
    case 'project_updated':
      return 'bg-indigo-500';
    case 'feedback_received':
      return 'bg-pink-500';
    default:
      return 'bg-gray-500';
  }
};

interface RecentActivitiesProps {
  activities?: Activity[];
  maxItems?: number;
  showTitle?: boolean;
  className?: string;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ 
  activities: initialActivities,
  maxItems = 6,
  showTitle = true,
  className
}) => {
  const { projects } = useProjects(); // ✅ CORRIGIDO
  const [activities, setActivities] = useState<Activity[]>([]);

  // Gerar atividades baseadas nos projetos atuais do sistema
  useEffect(() => {
    if (initialActivities && initialActivities.length > 0) {
      setActivities(initialActivities);
      return;
    }

    const generatedActivities: Activity[] = [];
    let id = 1;

    // Adicionar atividades baseadas em projetos recentes
    if (projects && projects.length > 0) {
      projects.forEach(project => {
        // Atividade para projeto adicionado
        const createdAt = new Date(project.created_at); // ✅ CORRIGIDO
        const formattedCreationDate = createdAt.toLocaleDateString('pt-BR'); // ✅ CORRIGIDO

        generatedActivities.push({
          id: id++,
          timestamp: formattedCreationDate,
          description: `Novo projeto criado: "${project.client_name || 'Cliente'}" - ${project.package_type || 'Projeto de Música'}`, // ✅ CORRIGIDO
          type: 'order_received'
        });

        // Atividade para versões adicionadas
        if (project.versions && project.versions.length > 0) { // ✅ CORRIGIDO
          const latestVersion = project.versions[project.versions.length - 1]; // ✅ CORRIGIDO
          const versionDate = new Date(createdAt);
          versionDate.setDate(versionDate.getDate() + 1);
          
          generatedActivities.push({
            id: id++,
            timestamp: new Date(latestVersion.created_at || versionDate).toLocaleDateString('pt-BR'), // ✅ CORRIGIDO
            description: `Nova versão adicionada: "${latestVersion.name}" para o projeto de ${project.client_name || 'Cliente'}`, // ✅ CORRIGIDO
            type: 'audio_added'
          });
        }

        // Atividade para feedback recebido
        if (project.status === 'feedback') {
          const feedbackDate = new Date(createdAt);
          feedbackDate.setDate(feedbackDate.getDate() + 2);
          
          generatedActivities.push({
            id: id++,
            timestamp: feedbackDate.toLocaleDateString('pt-BR'),
            description: `Feedback recebido: ${project.client_name || 'Cliente'} comentou sobre o projeto`, // ✅ CORRIGIDO
            type: 'feedback_received'
          });
        }

        // Atividade para projetos aprovados
        if (project.status === 'approved') {
          const approvedDate = new Date(createdAt);
          approvedDate.setDate(approvedDate.getDate() + 3);
          
          generatedActivities.push({
            id: id++,
            timestamp: approvedDate.toLocaleDateString('pt-BR'),
            description: `Projeto aprovado: ${project.client_name || 'Cliente'} aprovou a prévia final`, // ✅ CORRIGIDO
            type: 'project_updated'
          });
        }
      });
    }

    // Se não tiver atividades suficientes, adicione algumas atividades de exemplo
    if (generatedActivities.length < maxItems) {
      const sampleActivities: Activity[] = [
        {
          id: 90,
          timestamp: new Date().toLocaleDateString('pt-BR'),
          description: 'Novo áudio adicionado: "Aniversário de 15 Anos - Julia"',
          type: 'audio_added'
        },
        {
          id: 91,
          timestamp: new Date().toLocaleDateString('pt-BR'),
          description: 'Pedido atualizado: #2023-056 "Música Corporativa - Tech Inovação"',
          type: 'order_updated'
        },
        {
          id: 92,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
          description: 'Novo item adicionado ao portfólio: "Casamento - Pedro e Maria"',
          type: 'portfolio_added'
        },
        {
          id: 93,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
          description: 'Novo cliente registrado: João Silva',
          type: 'client_registered'
        }
      ];

      // Adicione apenas o número necessário para completar maxItems
      const needed = Math.max(0, maxItems - generatedActivities.length);
      generatedActivities.push(...sampleActivities.slice(0, needed));
    }

    // Ordenar por timestamp (mais recentes primeiro)
    const sortedActivities = generatedActivities.sort((a, b) => {
      try {
        const dateA = new Date(a.timestamp.split('/').reverse().join('-'));
        const dateB = new Date(b.timestamp.split('/').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
      } catch (e) {
        return 0;
      }
    });

    setActivities(sortedActivities.slice(0, maxItems));
  }, [projects, initialActivities, maxItems]);

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
