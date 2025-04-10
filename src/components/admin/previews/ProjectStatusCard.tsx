
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';

interface ProjectStatusCardProps {
  status: string;
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
  const getStatusInfo = () => {
    switch (status) {
      case 'waiting':
        return {
          icon: <Clock className="h-4 w-4 text-yellow-500" />,
          text: 'Aguardando avaliação',
          color: 'text-yellow-600'
        };
      case 'feedback':
        return {
          icon: <MessageCircle className="h-4 w-4 text-blue-500" />,
          text: 'Feedback recebido',
          color: 'text-blue-600'
        };
      case 'approved':
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          text: 'Música aprovada',
          color: 'text-green-600'
        };
      default:
        return {
          icon: <Clock className="h-4 w-4 text-gray-500" />,
          text: 'Status desconhecido',
          color: 'text-gray-600'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Status do projeto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {statusInfo.icon}
            <span className={`font-medium ${statusInfo.color}`}>{statusInfo.text}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>Criado em: {createdAt}</span>
          </div>
          <div className="flex items-center gap-2">
            {isNearExpiration ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : (
              <Calendar className="h-4 w-4 text-gray-500" />
            )}
            <span className={isNearExpiration ? 'text-red-600 font-medium' : ''}>
              {isNearExpiration ? 'Expira em breve: ' : 'Expira em: '} 
              {expirationDate}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusCard;
