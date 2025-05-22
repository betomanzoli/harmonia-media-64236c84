
import React from 'react';
import { Button } from "@/components/ui/button";
import { Share2 } from 'lucide-react';

export interface PreviewHeaderProps {
  clientName?: string;  // Added clientName
  projectTitle?: string;  // Added projectTitle
  projectData?: {
    projectTitle: string;
    clientName: string;
    status: 'waiting' | 'feedback' | 'approved' | 'pending';
    packageType?: string;
    createdAt?: string;
  };
  onShareClick?: () => void;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({ 
  projectData,
  clientName,
  projectTitle,
  onShareClick
}) => {
  // Use projectData if provided, otherwise use direct props
  const title = projectData?.projectTitle || projectTitle || 'Prévia Musical';
  const client = projectData?.clientName || clientName || 'Cliente';
  const currentStatus = projectData?.status || 'waiting';
  const packageType = projectData?.packageType;
  const createdAt = projectData?.createdAt;

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
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">{title}</h1>
          <p className="text-black">Cliente: {client}</p>
          {packageType && <p className="text-sm text-gray-500">{packageType}</p>}
          {createdAt && (
            <p className="text-xs text-gray-400 mt-1">
              Criado em: {new Date(createdAt).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
        
        <div className="flex items-center mt-4 md:mt-0">
          {onShareClick && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onShareClick} 
              className="mr-2 text-sm"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Compartilhar
            </Button>
          )}
          
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus)}`}>
            {getStatusLabel(currentStatus)}
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <h2 className="text-xl font-semibold text-black mb-2">Avaliação de Prévias Musicais</h2>
        <p className="text-black">
          Abaixo você encontrará as versões musicais para avaliação. 
          Ouça cada uma delas e escolha sua favorita ou envie um feedback para ajustes.
        </p>
      </div>
    </div>
  );
};

export default PreviewHeader;
