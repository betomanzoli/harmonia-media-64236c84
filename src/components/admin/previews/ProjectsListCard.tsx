
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import ProjectsTable from './ProjectsTable';
import { ProjectItem } from '@/hooks/admin/usePreviewProjects';

interface ProjectsListCardProps {
  projects: ProjectItem[];
}

const ProjectsListCard: React.FC<ProjectsListCardProps> = ({ projects }) => {
  return (
    <Card className="mb-10">
      <CardHeader>
        <CardTitle>Projetos de Prévias</CardTitle>
        <CardDescription>
          Lista de projetos ativos para avaliação dos clientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProjectsTable projects={projects} />
      </CardContent>
    </Card>
  );
};

export default ProjectsListCard;
