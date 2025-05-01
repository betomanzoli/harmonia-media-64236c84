
import React from 'react';
import { Share } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PreviewHeaderProps {
  projectTitle: string;
  clientName: string;
  packageType: string;
  status: string;
  createdAt: string;
  onShareClick: () => void;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  projectTitle,
  clientName,
  packageType,
  status,
  createdAt,
  onShareClick
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-500 hover:bg-green-600 uppercase text-xs font-semibold">
            Aprovada
          </Badge>
        );
      case 'feedback':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 uppercase text-xs font-semibold">
            Em Revisão
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 uppercase text-xs font-semibold">
            Aguardando Feedback
          </Badge>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-black">{projectTitle}</h1>
          <p className="text-gray-500">{packageType}</p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 sm:mt-0"
          onClick={onShareClick}
        >
          <Share className="h-4 w-4 mr-2" />
          Compartilhar
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Cliente:</span>
            <span className="text-sm font-medium">{clientName}</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Data de criação:</span>
            <span className="text-sm">{formatDate(createdAt)}</span>
          </div>
        </div>
        
        <div className="mt-2 sm:mt-0">
          {getStatusBadge(status)}
        </div>
      </div>
    </div>
  );
};

export default PreviewHeader;
