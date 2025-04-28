
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
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200">Aguardando</Badge>;
      case 'feedback':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200">Feedback</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200">Aprovado</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'waiting':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'feedback':
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
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
          <TableRow className="bg-gray-100 border-b-2 border-gray-300">
            <TableHead className="text-gray-800 font-bold">ID</TableHead>
            <TableHead className="text-gray-800 font-bold">Cliente</TableHead>
            <TableHead className="text-gray-800 font-bold">Pacote</TableHead>
            <TableHead className="text-gray-800 font-bold">Status</TableHead>
            <TableHead className="text-gray-800 font-bold">Versões</TableHead>
            <TableHead className="text-gray-800 font-bold">Data de Expiração</TableHead>
            <TableHead className="text-right text-gray-800 font-bold">Ações</TableHead>
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
                <TableRow className="hover:bg-gray-50 border-b border-gray-200">
                  <TableCell className="font-medium text-gray-800">{project.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-gray-800 font-medium">{project.clientName}</span>
                      <span className="text-xs text-gray-600">{project.clientEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-800">{project.packageType}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(project.status)}
                      <span>{getStatusBadge(project.status)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-800">{project.versions || 0}</TableCell>
                  <TableCell className="text-gray-800">{project.expirationDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 bg-blue-50 text-blue-700 border-blue-300 hover:text-blue-800 hover:bg-blue-100"
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
                        className="h-8 w-8 p-0 bg-green-50 text-green-700 border-green-300 hover:text-green-800 hover:bg-green-100"
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
                        className="h-8 w-8 p-0 bg-amber-50 text-amber-700 border-amber-300 hover:text-amber-800 hover:bg-amber-100"
                        title="Enviar lembrete"
                        onClick={() => handleSendReminder(project.id)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>

                      {onDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 bg-red-50 text-red-700 border-red-300 hover:text-red-800 hover:bg-red-100"
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
