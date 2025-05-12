
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectsListCard } from '@/components/admin/previews/ProjectsListCard';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { Clock, Music, FileText, Users } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { projects, isLoading } = usePreviewProjects();
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium">
              <Music className="w-4 h-4 mr-2 text-blue-500" />
              Projetos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 neste mês</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium">
              <Clock className="w-4 h-4 mr-2 text-amber-500" />
              Prévias Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : projects.filter(p => p.status === 'waiting').length}
            </div>
            <p className="text-xs text-muted-foreground">Aguardando avaliação</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium">
              <FileText className="w-4 h-4 mr-2 text-green-500" />
              Briefings Recebidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 novos hoje</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium">
              <Users className="w-4 h-4 mr-2 text-purple-500" />
              Clientes Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+5 neste mês</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <ProjectsListCard projects={projects} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default DashboardContent;
