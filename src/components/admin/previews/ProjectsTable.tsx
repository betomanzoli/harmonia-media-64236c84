
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Edit, Trash, Bell, AlarmClock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface ProjectsTableProps {
  projects: any[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onSendReminder: (id: string) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  isLoading,
  onDelete,
  onSendReminder
}) => {
  const { toast } = useToast();
  
  // Helper to format dates for better display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    // If it's already in DD/MM/YYYY format, return as is
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }
    
    try {
      // Try to parse the date string
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'waiting':
      case 'em_andamento':
        return <Badge className="bg-blue-500">Em Análise</Badge>;
      case 'feedback':
        return <Badge className="bg-yellow-500">Com Feedback</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case 'expired':
        return <Badge variant="outline" className="text-red-600 border-red-600">Expirado</Badge>;
      default:
        return <Badge variant="outline">Aguardando</Badge>;
    }
  };

  const copyPreviewLink = (projectId: string) => {
    const link = `${window.location.origin}/preview/${projectId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado!",
      description: "Link de prévia copiado para a área de transferência."
    });
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Pacote</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Versões</TableHead>
            <TableHead>Atualizado</TableHead>
            <TableHead>Expira</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhum projeto de prévia encontrado.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  {project.clientName || "Cliente sem nome"}
                </TableCell>
                <TableCell>
                  {project.packageType ? (
                    <span className="capitalize">{project.packageType}</span>
                  ) : (
                    "Padrão"
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(project.status)}</TableCell>
                <TableCell>{project.versions || 0}</TableCell>
                <TableCell>{formatDate(project.lastActivityDate)}</TableCell>
                <TableCell>{formatDate(project.expirationDate)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => copyPreviewLink(project.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Copiar Link
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/admin-j28s7d1k/previews/${project.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onSendReminder(project.id)}
                      >
                        <Bell className="mr-2 h-4 w-4" />
                        Enviar Lembrete
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(project.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTable;
