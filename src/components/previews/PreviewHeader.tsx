
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package2, Calendar, Music, AlertTriangle } from 'lucide-react';

interface ProjectData {
  clientName: string;
  projectTitle: string;
  projectId?: string;
  packageType?: string;
  creationDate?: string;
  expirationDate?: string;
  status: 'waiting' | 'feedback' | 'approved';
}

interface PreviewHeaderProps {
  projectData: ProjectData;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({ projectData }) => {
  const getStatusBadge = () => {
    switch (projectData.status) {
      case 'waiting':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-300">
            Aguardando avaliação
          </Badge>
        );
      case 'feedback':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-300">
            Feedback enviado
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-300">
            Música aprovada
          </Badge>
        );
      default:
        return null;
    }
  };
  
  const isNearExpiration = () => {
    if (!projectData.expirationDate) return false;
    
    const expirationParts = projectData.expirationDate.split('/');
    const expirationDate = new Date(
      parseInt(expirationParts[2]), 
      parseInt(expirationParts[1]) - 1, 
      parseInt(expirationParts[0])
    );
    const today = new Date();
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 3 && diffDays >= 0;
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-harmonia-green mb-2 md:mb-0">
            {projectData.projectTitle}
          </h1>
          {getStatusBadge()}
        </div>
        
        <div className="text-gray-600 mb-4">
          <p className="mb-1">Olá, <span className="font-medium">{projectData.clientName}</span>!</p>
          <p>Estamos felizes em compartilhar as versões preliminares da sua música personalizada.</p>
        </div>
        
        {projectData.packageType && projectData.projectId && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
            <div className="flex items-center">
              <Package2 className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-gray-600">Pacote:</span>
              <span className="font-medium ml-1">{projectData.packageType}</span>
            </div>
            
            <div className="flex items-center">
              <Music className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-gray-600">Número do projeto:</span>
              <span className="font-medium ml-1">{projectData.projectId}</span>
            </div>
            
            {projectData.expirationDate && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-600">Prazo para avaliação:</span>
                <span className={`font-medium ml-1 ${isNearExpiration() ? 'text-orange-500' : ''}`}>
                  {projectData.expirationDate}
                  {isNearExpiration() && <AlertTriangle className="h-3 w-3 ml-1 inline" />}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PreviewHeader;
