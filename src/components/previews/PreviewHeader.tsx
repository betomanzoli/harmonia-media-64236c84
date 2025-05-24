
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProjectHeaderData {
  projectTitle: string;
  clientName: string;
  status: string;
}

interface PreviewHeaderProps {
  projectData: ProjectHeaderData;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({ projectData }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Aguardando feedback</Badge>;
      case 'feedback':
        return <Badge variant="secondary">Feedback enviado</Badge>;
      case 'approved':
        return <Badge variant="success">Aprovado</Badge>;
      case 'completed':
        return <Badge variant="success">Concluído</Badge>;
      default:
        return <Badge variant="secondary">Em andamento</Badge>;
    }
  };

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">{projectData.projectTitle}</h1>
      <div className="flex flex-wrap gap-2 items-center text-gray-600">
        <span>Cliente: {projectData.clientName}</span>
        <span className="mx-2">•</span>
        {getStatusBadge(projectData.status)}
      </div>
    </div>
  );
};

export default PreviewHeader;
