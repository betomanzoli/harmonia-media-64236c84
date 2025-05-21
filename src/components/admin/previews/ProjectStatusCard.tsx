
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MessageSquare, CheckCircle, Calendar, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StatusBadge } from '@/components/ui/status-badge';

export interface ProjectStatusCardProps {
  status: 'waiting' | 'feedback' | 'approved';
  onStatusUpdate?: (newStatus: 'waiting' | 'feedback' | 'approved') => void;
  projectId?: string;
  createdAt?: string;
  expirationDate?: string;
  lastActivityDate?: string;
  feedback?: string;
}

const ProjectStatusCard: React.FC<ProjectStatusCardProps> = ({
  status,
  onStatusUpdate,
  projectId,
  createdAt,
  expirationDate,
  lastActivityDate,
  feedback
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
          label: <StatusBadge status="pending" customLabel="Aguardando Avaliação" className="bg-yellow-100 text-yellow-800 border-yellow-300" />,
          description: "O cliente ainda não avaliou as prévias enviadas.",
          actions: onStatusUpdate ? [
            { label: "Marcar como Feedback", onClick: () => handleStatusUpdate('feedback'), variant: "outline" as const },
            { label: "Marcar como Aprovado", onClick: () => handleStatusUpdate('approved'), variant: "outline" as const }
          ] : []
        };
      case 'feedback':
        return {
          icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
          label: <StatusBadge status="in_progress" customLabel="Feedback Recebido" className="bg-blue-100 text-blue-800 border-blue-300" />,
          description: "O cliente enviou feedback para as prévias.",
          actions: onStatusUpdate ? [
            { label: "Marcar como Aguardando", onClick: () => handleStatusUpdate('waiting'), variant: "outline" as const },
            { label: "Marcar como Aprovado", onClick: () => handleStatusUpdate('approved'), variant: "outline" as const }
          ] : []
        };
      case 'approved':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          label: <StatusBadge status="approved" customLabel="Música Aprovada" className="bg-green-100 text-green-800 border-green-300" />,
          description: "O cliente aprovou uma das prévias enviadas.",
          actions: onStatusUpdate ? [
            { label: "Marcar como Aguardando", onClick: () => handleStatusUpdate('waiting'), variant: "outline" as const },
            { label: "Marcar como Feedback", onClick: () => handleStatusUpdate('feedback'), variant: "outline" as const }
          ] : []
        };
      default:
        return {
          icon: <Clock className="h-5 w-5 text-gray-500" />,
          label: <StatusBadge status="pending" customLabel="Status Desconhecido" />,
          description: "Status do projeto não reconhecido.",
          actions: []
        };
    }
  };
  
  const handleStatusUpdate = (newStatus: 'waiting' | 'feedback' | 'approved') => {
    if (!onStatusUpdate) return;
    
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
        
        {createdAt && (
          <div className="flex items-start gap-2 mt-4 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Criado em: {createdAt}</span>
          </div>
        )}
        
        {lastActivityDate && (
          <div className="flex items-start gap-2 mt-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Última atividade: {lastActivityDate}</span>
          </div>
        )}
        
        {expirationDate && (
          <div className="flex items-start gap-2 mt-2 text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4" />
            <span>Expira em: {expirationDate}</span>
          </div>
        )}
        
        {feedback && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm font-medium mb-1">Feedback do cliente:</p>
            <p className="text-sm text-gray-600">{feedback}</p>
          </div>
        )}
        
        {statusInfo.actions.length > 0 && (
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
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectStatusCard;
