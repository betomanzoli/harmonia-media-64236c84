
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileMusic, Calendar, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ProjectActionCardProps {
  projectId: string; 
  onAddVersion: () => void;
  onExtendDeadline: () => void;
  previewUrl?: string;
}

const ProjectActionCard: React.FC<ProjectActionCardProps> = ({ 
  projectId,
  onAddVersion, 
  onExtendDeadline,
  previewUrl = ''
}) => {
  // Format the preview URL correctly to ensure it works
  const formattedPreviewUrl = previewUrl || `/preview/${projectId}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ações rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={onAddVersion}
          >
            <FileMusic className="mr-2 h-4 w-4" />
            Enviar nova versão
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={onExtendDeadline}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Estender prazo
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start text-harmonia-green border-harmonia-green hover:bg-harmonia-green/10"
            asChild
          >
            <Link to={formattedPreviewUrl} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Ver como cliente
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectActionCard;
