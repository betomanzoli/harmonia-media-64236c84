
import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Send } from 'lucide-react';
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
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="secondary">Aguardando</Badge>;
      case 'feedback':
        return <Badge variant="outline">Feedback</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Processando</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando projetos...</div>;
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Pacote</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum projeto encontrado.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.id}</TableCell>
                <TableCell>
                  <div>
                    {project.clientName}
                    <div className="text-xs text-gray-500">{project.clientEmail}</div>
                  </div>
                </TableCell>
                <TableCell>{project.packageType}</TableCell>
                <TableCell>{project.createdAt}</TableCell>
                <TableCell>{getStatusBadge(project.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {project.status === 'feedback' && onSendReminder && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={() => onSendReminder(project.id)}
                      >
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Enviar lembrete</span>
                      </Button>
                    )}
                    
                    {onDelete && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    )}
                  </div>
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
