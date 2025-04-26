
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare, CheckCircle } from 'lucide-react';

interface PreviewHeaderProps {
  projectData: {
    projectTitle: string;
    clientName: string;
    status: 'waiting' | 'feedback' | 'approved';
  };
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({ projectData }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="h-3 w-3" />
            Aguardando sua avaliação
          </Badge>
        );
      case 'feedback':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-blue-100 text-blue-800 border-blue-300">
            <MessageSquare className="h-3 w-3" />
            Em ajustes conforme seu feedback
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3" />
            Música aprovada
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <CardTitle className="text-2xl">{projectData.projectTitle}</CardTitle>
          {getStatusBadge(projectData.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <p className="text-gray-600">
            Cliente: <span className="font-medium">{projectData.clientName}</span>
          </p>
          <p className="text-sm text-gray-500">
            Data: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewHeader;
