
import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { Eye, Mail, Clock, CheckCircle, RefreshCw, MessageSquare, AlertTriangle, Trash, Play } from 'lucide-react';
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'waiting':
        return <Badge className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Aguardando</Badge>;
      case 'feedback':
        return <Badge className="bg-purple-500/20 text-purple-700 hover:bg-purple-500/30">Feedback</Badge>;
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Aprovado</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'waiting':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'feedback':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleSendReminder = (id: string) => {
    if (onSendReminder) {
      onSendReminder(id);
    } else {
      toast({
        title: "Lembrete enviado",
        description: "Um lembrete foi enviado para o cliente.",
      });
    }
  };

  const getPreviewLink = (projectId: string) => {
    return `/preview/${projectId}`;
  };

  const getAdminDetailLink = (projectId: string) => {
    return `/admin-j28s7d1k/previews/${projectId}`;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        {projects.length === 0 && !isLoading && (
          <TableCaption>Nenhum projeto encontrado.</TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Pacote</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Versões</TableHead>
            <TableHead>Data de Expiração</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <div className="flex justify-center items-center">
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Carregando projetos...
                </div>
              </TableCell>
            </TableRow>
          ) : projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhum projeto encontrado.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <React.Fragment key={project.id}>
                <TableRow className="hover:bg-gray-50">
                  <TableCell className="font-medium">{project.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{project.clientName}</span>
                      <span className="text-xs text-muted-foreground">{project.clientEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>{project.packageType}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(project.status)}
                      <span>{getStatusBadge(project.status)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{project.versions || 0}</TableCell>
                  <TableCell>{project.expirationDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        title="Ver detalhes"
                        asChild
                      >
                        <Link to={getAdminDetailLink(project.id)}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-harmonia-green hover:text-harmonia-green hover:bg-harmonia-green/10"
                        title="Ver prévia do cliente"
                        asChild
                      >
                        <Link to={getPreviewLink(project.id)} target="_blank">
                          <Play className="h-4 w-4" />
                        </Link>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                        title="Enviar lembrete"
                        onClick={() => handleSendReminder(project.id)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>

                      {onDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          title="Excluir projeto"
                          onClick={() => onDelete(project.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTable;
