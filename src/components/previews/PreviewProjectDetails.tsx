
import React from 'react';
import { Card } from "@/components/ui/card";
import { PreviewProjectData } from '@/hooks/use-preview-data';

interface PreviewProjectDetailsProps {
  projectData: PreviewProjectData;
}

const PreviewProjectDetails: React.FC<PreviewProjectDetailsProps> = ({ projectData }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">{projectData.projectId}</h1>
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{projectData.packageType}</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{projectData.creationDate}</span>
          <span className="px-3 py-1 bg-harmonia-green/20 text-harmonia-green rounded-full text-sm font-medium">
            {projectData.status === 'waiting' ? 'Aguardando Avaliação' : 
             projectData.status === 'feedback' ? 'Em Revisão' : 'Aprovado'}
          </span>
        </div>
      </div>
      
      <Card className="p-6 mb-8 border-l-4 border-l-harmonia-green">
        <h2 className="text-xl font-bold mb-2">Olá, {projectData.clientName}!</h2>
        <p className="text-gray-600">
          Estamos felizes em apresentar as prévias musicais do seu projeto. Por favor, ouça cada versão 
          e selecione a que mais lhe agrada. Você pode adicionar comentários específicos para ajustes na versão escolhida.
        </p>
      </Card>
    </div>
  );
};

export default PreviewProjectDetails;
