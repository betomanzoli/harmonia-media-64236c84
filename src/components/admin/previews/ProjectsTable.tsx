
import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { Eye, Mail, Clock, CheckCircle, RefreshCw, MessageSquare, AlertTriangle, Download, Trash, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProjectItem } from '@/hooks/admin/usePreviewProjects';

interface ProjectsTableProps {
  projects: ProjectItem[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onSendReminder?: (id: string) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ 
  projects, 
  isLoading = false,
  onDelete,
  onSendReminder
}) => {
  const { toast } = useToast();
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Aguardando avaliação
          </Badge>
        );
      case 'feedback':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <MessageSquare className="h-3 w-3 mr-1" />
            Feedback recebido
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprovada
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            Desconhecido
          </Badge>
        );
    }
  };

  const handleSendReminder = (project: ProjectItem) => {
    setSendingReminder(project.id);
    
    // Simulação de envio de lembrete
    setTimeout(() => {
      setSendingReminder(null);
      toast({
        title: "Lembrete enviado",
        description: `Um email de lembrete foi enviado para ${project.clientName}`,
      });
      
      if (onSendReminder) {
        onSendReminder(project.id);
      }
    }, 1500);
  };

  const handleDelete = (projectId: string) => {
    if (onDelete) {
      onDelete(projectId);
    } else {
      toast({
        title: "Função não implementada",
        description: "A exclusão de projetos será implementada em breve.",
        variant: "destructive"
      });
    }
  };

  const isNearExpiration = (expirationDate: string) => {
    const parts = expirationDate.split('/');
    const expDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-harmonia-green" />
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-700">Nenhum projeto encontrado</h3>
        <p className="text-gray-500 mt-1">Crie seu primeiro projeto clicando no botão abaixo.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>Lista de projetos de prévia</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Pacote</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Versões</TableHead>
          <TableHead>Expira em</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">{project.id}</TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{project.clientName}</div>
                <div className="text-sm text-muted-foreground">{project.clientEmail}</div>
              </div>
            </TableCell>
            <TableCell>{project.packageType}</TableCell>
            <TableCell>{getStatusBadge(project.status)}</TableCell>
            <TableCell>{project.versions || 0}</TableCell>
            <TableCell>
              <div className="flex items-center">
                {isNearExpiration(project.expirationDate) ? (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <Clock className="h-3 w-3 mr-1" />
                    {project.expirationDate}
                  </Badge>
                ) : (
                  project.expirationDate
                )}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex space-x-1 justify-end">
                <Button 
                  variant="outline" 
                  size="icon"
                  asChild
                  className="h-8 w-8"
                >
                  <Link to={`/admin-j28s7d1k/previews/${project.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8"
                  asChild
                >
                  <Link to={`/preview/${project.id}`} target="_blank">
                    <Play className="h-4 w-4" />
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleSendReminder(project)}
                  disabled={sendingReminder === project.id}
                >
                  {sendingReminder === project.id ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProjectsTable;
