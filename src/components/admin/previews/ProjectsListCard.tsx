
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectItem } from '@/hooks/admin/usePreviewProjects';
import { Link } from 'react-router-dom';
import { Eye, Send, Clock, FileCheck, MessageSquare, Loader2, AlarmCheck } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { notificationService } from '@/services/notificationService';

interface ProjectsListCardProps {
  projects: ProjectItem[];
  isLoading?: boolean;
}

const ProjectsListCard: React.FC<ProjectsListCardProps> = ({ 
  projects,
  isLoading = false
}) => {
  const { toast } = useToast();
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="outline" className="bg-yellow-900/20 text-yellow-500 border-yellow-500/30">Aguardando avaliação</Badge>;
      case 'feedback':
        return <Badge variant="outline" className="bg-blue-900/20 text-blue-500 border-blue-500/30">Feedback recebido</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-900/20 text-green-500 border-green-500/30">Música aprovada</Badge>;
      default:
        return <Badge variant="outline">Não definido</Badge>;
    }
  };
  
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
  
  const sendReminder = async (projectId: string) => {
    setSendingReminder(projectId);
    
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      try {
        // Simular envio de lembrete
        notificationService.notify('new_preview', {
          projectId,
          clientName: project.clientName,
          clientEmail: project.clientEmail,
          message: 'Este é um lembrete para avaliação das prévias musicais enviadas a você.'
        });
        
        toast({
          title: "Lembrete enviado",
          description: `Um lembrete foi enviado para ${project.clientName}.`,
        });
      } catch (error) {
        console.error('Erro ao enviar lembrete:', error);
        toast({
          title: "Erro",
          description: "Não foi possível enviar o lembrete.",
          variant: "destructive"
        });
      } finally {
        setSendingReminder(null);
      }
    }
  };
  
  const isExpiringToday = (date: string) => {
    const today = new Date();
    const expirationDate = date.split('/').reverse().join('-');
    return new Date(expirationDate).toDateString() === today.toDateString();
  };

  const sortProjects = (projectsList: ProjectItem[]) => {
    return [...projectsList].sort((a, b) => {
      // Primeiro os com status 'waiting'
      if (a.status === 'waiting' && b.status !== 'waiting') return -1;
      if (a.status !== 'waiting' && b.status === 'waiting') return 1;
      
      // Em seguida, os com status 'feedback'
      if (a.status === 'feedback' && b.status !== 'feedback') return -1;
      if (a.status !== 'feedback' && b.status === 'feedback') return 1;
      
      // Por fim, por data de criação (mais recentes primeiro)
      const dateA = a.createdAt.split('/').reverse().join('-');
      const dateB = b.createdAt.split('/').reverse().join('-');
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
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
                {sortProjects(projects).map(project => (
                  <tr key={project.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(project.status)}
                        <span className="ml-2 font-medium">{project.id}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {project.packageType} • {project.versions} versões
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>{project.clientName}</div>
                      <div className="text-xs text-muted-foreground">{project.clientEmail}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusLabel(project.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {project.createdAt}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        {isExpiringToday(project.expirationDate) && (
                          <AlarmCheck className="h-4 w-4 text-orange-500 mr-1" />
                        )}
                        {project.expirationDate}
                      </div>
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
                          onClick={() => sendReminder(project.id)}
                          disabled={sendingReminder === project.id || project.status === 'approved'}
                        >
                          {sendingReminder === project.id ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Send className="h-3.5 w-3.5 mr-1" />
                              Enviar lembrete
                            </>
                          )}
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

export default ProjectsListCard;
