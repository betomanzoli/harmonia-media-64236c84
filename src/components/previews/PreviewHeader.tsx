
import React from 'react';

interface PreviewHeaderProps {
  projectData: {
    projectTitle: string;
    clientName: string;
    status: 'waiting' | 'feedback' | 'approved';
  };
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({ projectData }) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'Aguardando avaliação';
      case 'feedback':
        return 'Feedback enviado';
      case 'approved':
        return 'Prévia aprovada';
      default:
        return 'Em andamento';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-700';
      case 'feedback':
        return 'bg-blue-100 text-blue-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">{projectData.projectTitle}</h1>
          <p className="text-gray-700">Cliente: {projectData.clientName}</p>
        </div>
        
        <div className={`mt-4 md:mt-0 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(projectData.status)}`}>
          {getStatusLabel(projectData.status)}
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <h2 className="text-xl font-semibold text-black mb-2">Avaliação de Prévias Musicais</h2>
        <p className="text-gray-700">
          Abaixo você encontrará as versões musicais para avaliação. 
          Ouça cada uma delas e escolha sua favorita ou envie um feedback para ajustes.
        </p>
      </div>
    </div>
  );
};

export default PreviewHeader;
