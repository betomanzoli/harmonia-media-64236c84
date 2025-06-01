
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Clock, User, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: {
    id: string;
    clientName: string;
    title: string;
    status: 'waiting' | 'feedback' | 'approved';
    versionsCount: number;
    createdAt: string;
    lastActivity: string;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      waiting: { label: 'Aguardando', color: 'bg-yellow-500' },
      feedback: { label: 'Feedback', color: 'bg-blue-500' },
      approved: { label: 'Aprovado', color: 'bg-green-500' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: 'bg-gray-500' };
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const handleViewProject = () => {
    navigate(`/admin/projects/${project.id}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{project.title}</CardTitle>
            <p className="text-gray-600 text-sm flex items-center">
              <User className="w-4 h-4 mr-1" />
              {project.clientName}
            </p>
          </div>
          {getStatusBadge(project.status)}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Music className="w-4 h-4 mr-1" />
            {project.versionsCount} versões
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {project.lastActivity}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleViewProject}
            className="flex-1 bg-harmonia-green hover:bg-harmonia-green/90"
          >
            <Eye className="w-4 h-4 mr-1" />
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
