
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { Eye, Send, Clock, FileCheck, MessageSquare, Loader2 } from 'lucide-react';
import { ProjectItem } from '@/hooks/admin/usePreviewProjects';

interface ProjectsListCardProps {
  projects: ProjectItem[];
  isLoading?: boolean;
}

export const ProjectsListCard: React.FC<ProjectsListCardProps> = ({ 
  projects,
  isLoading = false
}) => {
  // Status label helper function
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-300">Aguardando</Badge>;
      case 'feedback':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-300">Feedback</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-300">Aprovado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  // Status icon helper function
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'feedback':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'approved':
        return <FileCheck className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Projetos de prévias
          {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center p-8 border rounded-md border-dashed">
            <p className="text-muted-foreground mb-2">Nenhum projeto de prévia encontrado</p>
            <p className="text-xs text-muted-foreground">Crie um novo projeto para enviar prévias aos clientes</p>
          </div>
        ) : (
          <div className="rounded-md overflow-hidden border">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Projeto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Criado em</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Expira em</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map(project => (
                  <tr key={project.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(project.status)}
                        <span className="ml-2 font-medium">{project.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>{project.client_name || project.clientName}</div>
                      <div className="text-xs text-muted-foreground">{project.client_email || project.clientEmail}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusLabel(project.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {project.created_at || project.createdAt}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {project.expiration_date || project.expirationDate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admin-j28s7d1k/previews/${project.id}`}>
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Ver
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                        >
                          <Send className="h-3.5 w-3.5 mr-1" />
                          Enviar lembrete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
