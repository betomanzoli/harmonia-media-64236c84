
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PreviewProjectData } from '@/hooks/use-preview-data';

interface PreviewProjectDetailsProps {
  projectData: PreviewProjectData;
}

const PreviewProjectDetails: React.FC<PreviewProjectDetailsProps> = ({ projectData }) => {
  const getStatusBadge = (status: 'waiting' | 'feedback' | 'approved') => {
    switch (status) {
      case 'waiting':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Aguardando Avaliação</Badge>;
      case 'feedback':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Feedback Recebido</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Aprovado</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {projectData.projectTitle}
            </h1>
            <p className="text-gray-500 mt-1">
              Cliente: {projectData.clientName}
            </p>
          </div>
          <div>
            {getStatusBadge(projectData.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600">
          {projectData.packageType && (
            <div className="mb-1">
              <span className="font-medium">Pacote:</span> {projectData.packageType}
            </div>
          )}
          {projectData.creationDate && (
            <div>
              <span className="font-medium">Data de criação:</span> {projectData.creationDate}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewProjectDetails;
