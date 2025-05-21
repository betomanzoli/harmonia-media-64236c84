
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectItem } from '@/types/preview.types';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface ProjectsListCardProps {
  projects: ProjectItem[];
  isLoading: boolean;
}

export const ProjectsListCard: React.FC<ProjectsListCardProps> = ({ 
  projects, 
  isLoading 
}) => {
  const navigate = useNavigate();
  const recentProjects = projects
    .sort((a, b) => new Date(b.lastActivityDate || b.createdAt).getTime() - new Date(a.lastActivityDate || a.createdAt).getTime())
    .slice(0, 5);
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'feedback':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Feedback</Badge>;
      case 'waiting':
      default:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Aguardando</Badge>;
    }
  };
  
  const handleProjectClick = (projectId: string) => {
    navigate(`/admin-j28s7d1k/previews/${projectId}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Projetos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500">
            Carregando projetos...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Projetos Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {recentProjects.length > 0 ? (
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div 
                key={project.id} 
                className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                onClick={() => handleProjectClick(project.id)}
              >
                <div>
                  <div className="font-medium">{project.clientName}</div>
                  <div className="text-sm text-gray-500">{project.id}</div>
                </div>
                <div>
                  {getStatusBadge(project.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Nenhum projeto encontrado.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Add a default export
export default ProjectsListCard;
