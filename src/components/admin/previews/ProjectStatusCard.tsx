
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare, CheckCircle } from 'lucide-react';

export interface ProjectStatusCardProps {
  status: string;
  lastActivityDate?: string;
  onStatusUpdate?: (newStatus: 'waiting' | 'feedback' | 'approved') => void;
}

const ProjectStatusCard: React.FC<ProjectStatusCardProps> = ({ 
  status, 
  lastActivityDate,
  onStatusUpdate 
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'waiting':
        return (
          <div className="flex items-center">
            <Clock className="text-yellow-500 mr-2 h-5 w-5" />
            <span className="font-medium">Aguardando Avaliação</span>
          </div>
        );
      case 'feedback':
        return (
          <div className="flex items-center">
            <MessageSquare className="text-blue-500 mr-2 h-5 w-5" />
            <span className="font-medium">Feedback Recebido</span>
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
            <span className="font-medium">Projeto Aprovado</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <Clock className="text-gray-500 mr-2 h-5 w-5" />
            <span className="font-medium">Status Desconhecido</span>
          </div>
        );
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Status do Projeto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            {getStatusBadge()}
          </div>
          
          {lastActivityDate && (
            <div className="text-sm text-gray-500">
              <p>Última atividade: {lastActivityDate}</p>
            </div>
          )}
          
          {onStatusUpdate && (
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-500 mb-2">Atualizar Status:</p>
              <Select 
                value={status} 
                onValueChange={(value: 'waiting' | 'feedback' | 'approved') => onStatusUpdate(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="waiting">Aguardando Avaliação</SelectItem>
                  <SelectItem value="feedback">Feedback Recebido</SelectItem>
                  <SelectItem value="approved">Projeto Aprovado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusCard;
