
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; 

export interface ProjectStatusCardProps {
  status: 'waiting' | 'feedback' | 'approved';
  onStatusUpdate: (newStatus: 'waiting' | 'feedback' | 'approved') => void;
  projectId?: string;
}

const ProjectStatusCard: React.FC<ProjectStatusCardProps> = ({
  status,
  onStatusUpdate,
  projectId
}) => {
  const { toast } = useToast();

  useEffect(() => {
    // Este efeito é executado quando o status do projeto muda
    // poderia ser usado para sincronizar os status com outras partes do sistema
    if (projectId) {
      console.log(`Status do projeto ${projectId} atualizado: ${status}`);
      // Aqui você poderia disparar alguma ação para sincronizar o status
    }
  }, [status, projectId]);

  const getStatusDetails = () => {
    switch (status) {
      case 'waiting':
        return {
          icon: <Clock className="h-5 w-5 text-yellow-500" />,
          label: <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Aguardando Avaliação</Badge>,
          description: "O cliente ainda não avaliou as prévias enviadas.",
          actions: [
            { label: "Marcar como Feedback", onClick: () => handleStatusUpdate('feedback'), variant: "outline" as const },
            { label: "Marcar como Aprovado", onClick: () => handleStatusUpdate('approved'), variant: "outline" as const }
          ]
        };
      case 'feedback':
        return {
          icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
          label: <Badge className="bg-blue-100 text-blue-800 border-blue-300">Feedback Recebido</Badge>,
          description: "O cliente enviou feedback para as prévias.",
          actions: [
            { label: "Marcar como Aguardando", onClick: () => handleStatusUpdate('waiting'), variant: "outline" as const },
            { label: "Marcar como Aprovado", onClick: () => handleStatusUpdate('approved'), variant: "outline" as const }
          ]
        };
      case 'approved':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          label: <Badge className="bg-green-100 text-green-800 border-green-300">Música Aprovada</Badge>,
          description: "O cliente aprovou uma das prévias enviadas.",
          actions: [
            { label: "Marcar como Aguardando", onClick: () => handleStatusUpdate('waiting'), variant: "outline" as const },
            { label: "Marcar como Feedback", onClick: () => handleStatusUpdate('feedback'), variant: "outline" as const }
          ]
        };
      default:
        return {
          icon: <Clock className="h-5 w-5 text-gray-500" />,
          label: <Badge>Status Desconhecido</Badge>,
          description: "Status do projeto não reconhecido.",
          actions: []
        };
    }
  };
  
  const handleStatusUpdate = (newStatus: 'waiting' | 'feedback' | 'approved') => {
    // Atualiza o status e notifica sobre a mudança
    onStatusUpdate(newStatus);
    
    toast({
      title: "Status atualizado",
      description: `Status do projeto alterado para ${
        newStatus === 'waiting' ? 'Aguardando Avaliação' : 
        newStatus === 'feedback' ? 'Feedback Recebido' : 'Aprovado'
      }`
    });
  };
  
  const statusInfo = getStatusDetails();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Status do Projeto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          {statusInfo.icon}
          <div>
            <div className="mb-1">{statusInfo.label}</div>
            <p className="text-sm text-gray-500">{statusInfo.description}</p>
          </div>
        </div>
        
        <div className="pt-2 space-y-2">
          {statusInfo.actions.map((action, index) => (
            <Button 
              key={index}
              variant={action.variant} 
              size="sm" 
              className="w-full"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusCard;
