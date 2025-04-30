
import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Calendar, Music, Package } from 'lucide-react';

interface PreviewProjectDetailsProps {
  projectData: {
    projectTitle: string;
    clientName: string;
    status: string;
    packageType?: string;
    creationDate?: string;
  };
}

const PreviewProjectDetails: React.FC<PreviewProjectDetailsProps> = ({ projectData }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <CardTitle className="text-lg font-medium text-black mb-4">Detalhes do Projeto</CardTitle>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <Package className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-900">Pacote</div>
              <div className="text-sm text-gray-700">
                {projectData.packageType || projectData.projectTitle}
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <Music className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-900">Tipo de Projeto</div>
              <div className="text-sm text-gray-700">
                Música Personalizada
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-900">Data de Criação</div>
              <div className="text-sm text-gray-700">
                {projectData.creationDate || new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewProjectDetails;
