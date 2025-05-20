
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoIcon, CalendarIcon } from 'lucide-react';

interface ProjectDisplayData {
  projectTitle: string;
  clientName: string;
  status: string;
  packageType?: string;
  creationDate?: string;
}

interface PreviewProjectDetailsProps {
  projectData: ProjectDisplayData;
}

const PreviewProjectDetails: React.FC<PreviewProjectDetailsProps> = ({ projectData }) => {
  const getStatusLabel = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'waiting':
        return 'Aguardando feedback';
      case 'feedback':
        return 'Com feedback';
      case 'approved':
        return 'Aprovado';
      default:
        return 'Aguardando análise';
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <InfoIcon className="mr-2 h-4 w-4 text-gray-500" />
          Detalhes do Projeto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-gray-500">Projeto</span>
            <span className="text-base font-semibold">{projectData.projectTitle}</span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-gray-500">Cliente</span>
            <span className="text-base">{projectData.clientName}</span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-gray-500">Pacote</span>
            <span className="text-base">{projectData.packageType || "Pacote Personalizado"}</span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-gray-500">Status</span>
            <span className="text-base">{getStatusLabel(projectData.status)}</span>
          </div>
          
          {projectData.creationDate && (
            <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
              <CalendarIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Criado em {projectData.creationDate}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewProjectDetails;
