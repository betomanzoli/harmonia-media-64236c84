
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Download, Calendar } from 'lucide-react';

interface ProjectPreviewDetailsProps {
  projectData: any;
  onFeedbackSubmit: (feedback: string) => void;
  onApprove: () => void;
}

const ProjectPreviewDetails: React.FC<ProjectPreviewDetailsProps> = ({
  projectData,
  onFeedbackSubmit,
  onApprove
}) => {
  if (!projectData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Music className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Projeto não encontrado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{projectData.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <p className="capitalize">{projectData.status}</p>
            </div>
            
            {projectData.description && (
              <div>
                <label className="text-sm font-medium text-gray-600">Descrição</label>
                <p>{projectData.description}</p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button onClick={onApprove} className="bg-green-600 hover:bg-green-700">
                Aprovar Projeto
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onFeedbackSubmit('Feedback do cliente')}
              >
                Enviar Feedback
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectPreviewDetails;
