
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Plus, Calendar, Eye } from 'lucide-react';

export interface ProjectActionCardProps {
  projectId: string;
  onAddVersion: () => void;
  onExtendDeadline: () => void;
  previewUrl: string;
}

const ProjectActionCard: React.FC<ProjectActionCardProps> = ({
  projectId,
  onAddVersion,
  onExtendDeadline,
  previewUrl
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          className="w-full flex justify-start"
          onClick={onAddVersion}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Nova Versão
        </Button>
        
        <Button
          variant="outline"
          className="w-full flex justify-start"
          onClick={onExtendDeadline}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Estender Prazo (+ 30 dias)
        </Button>
        
        <Button
          variant="outline"
          className="w-full flex justify-start"
          asChild
        >
          <Link to={previewUrl} target="_blank">
            <Eye className="h-4 w-4 mr-2" />
            Ver Página do Cliente
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectActionCard;
