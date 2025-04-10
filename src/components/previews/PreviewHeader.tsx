
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from 'lucide-react';

interface PreviewHeaderProps {
  projectData: {
    projectTitle: string;
    clientName: string;
    status: 'waiting' | 'feedback' | 'approved';
  };
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({ projectData }) => {
  return (
    <Card className="mb-6 border-b-4 border-harmonia-green">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{projectData.projectTitle}</h1>
            <p className="text-gray-500">Olá, {projectData.clientName}! Aqui estão suas prévias musicais.</p>
          </div>
          <div className="bg-harmonia-green/10 p-2 rounded-md flex items-center text-harmonia-green">
            <Lock className="w-4 h-4 mr-2" />
            <span className="text-xs font-medium">Prévias Protegidas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewHeader;
