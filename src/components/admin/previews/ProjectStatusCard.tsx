
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, MessageSquare, Calendar, AlertTriangle } from 'lucide-react';

interface ProjectStatusCardProps {
  status: 'waiting' | 'feedback' | 'approved';
  createdAt: string;
  expirationDate: string;
  isNearExpiration: boolean;
}

const ProjectStatusCard: React.FC<ProjectStatusCardProps> = ({
  status,
  createdAt,
  expirationDate,
  isNearExpiration
}) => {
  const getStatusDetails = () => {
    switch (status) {
      case 'waiting':
        return {
          icon: <Clock className="h-5 w-5 text-yellow-500" />,
          badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-300",
          label: "Aguardando Avaliação",
          description: "O cliente ainda não enviou feedback para este projeto."
        };
      case 'feedback':
        return {
          icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
          badgeClass: "bg-blue-100 text-blue-800 border-blue-300",
          label: "Feedback Recebido",
          description: "O cliente enviou feedback para este projeto."
        };
      case 'approved':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          badgeClass: "bg-green-100 text-green-800 border-green-300",
          label: "Aprovado",
          description: "O cliente aprovou este projeto."
        };
      default:
        return {
          icon: <Clock className="h-5 w-5 text-gray-500" />,
          badgeClass: "bg-gray-100 text-gray-800 border-gray-300",
          label: "Status desconhecido",
          description: "Não foi possível determinar o status deste projeto."
        };
    }
  };
  
  const statusDetails = getStatusDetails();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {statusDetails.icon}
          <div>
            <Badge className={statusDetails.badgeClass}>
              {statusDetails.label}
            </Badge>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">
          {statusDetails.description}
        </p>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Criado em:</span>
            <span>{createdAt}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Prazo:</span>
            <div className="flex items-center">
              {isNearExpiration && (
                <AlertTriangle className="h-4 w-4 text-orange-500 mr-1" />
              )}
              <span className={isNearExpiration ? "text-orange-500" : ""}>
                {expirationDate}
              </span>
            </div>
          </div>
          
          {status === 'approved' && (
            <div className="flex justify-between">
              <span className="text-gray-500">Aprovado em:</span>
              <span>{new Date().toLocaleDateString('pt-BR')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusCard;
