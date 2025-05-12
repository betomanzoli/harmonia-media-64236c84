
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Clock, CheckCircle, UserCircle, MessageCircle } from 'lucide-react';

interface StatusData {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  feedback: number;
}

interface ProjectStatusCardProps {
  statusData: StatusData;
}

const ProjectStatusCard: React.FC<ProjectStatusCardProps> = ({ statusData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Status dos Projetos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Music className="h-5 w-5 text-harmonia-green mr-2" />
              <span>Total de Projetos</span>
            </div>
            <span className="font-bold">{statusData.total}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-500 mr-2" />
              <span>Pendentes</span>
            </div>
            <span className="font-bold">{statusData.pending}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserCircle className="h-5 w-5 text-blue-500 mr-2" />
              <span>Em Progresso</span>
            </div>
            <span className="font-bold">{statusData.inProgress}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 text-purple-500 mr-2" />
              <span>Aguardando Feedback</span>
            </div>
            <span className="font-bold">{statusData.feedback}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>Concluídos</span>
            </div>
            <span className="font-bold">{statusData.completed}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusCard;
