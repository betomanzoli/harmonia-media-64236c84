
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Bell, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProjectItem } from '@/hooks/admin/usePreviewProjects';

interface ProjectsTableProps {
  projects: ProjectItem[];
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
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'waiting':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Aguardando</Badge>;
      case 'feedback':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Feedback Recebido</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Aprovado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    
    // Check if the date is already in the desired format DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      return dateStr;
    }
    
    // Otherwise, try to parse it
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-2 text-gray-500">Carregando projetos...</p>
      </div>
    );
  }
  
  if (projects.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Nenhum projeto encontrado.</p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableCaption>Lista de projetos de prévias musicais.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] text-black">ID</TableHead>
          <TableHead className="text-black">Cliente</TableHead>
          <TableHead className="text-black">Pacote</TableHead>
          <TableHead className="text-center text-black">Versões</TableHead>
          <TableHead className="text-black">Status</TableHead>
          <TableHead className="text-black">Criado em</TableHead>
          <TableHead className="text-black">Expira em</TableHead>
          <TableHead className="text-right text-black">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map(project => (
          <TableRow key={project.id}>
            <TableCell className="font-medium text-black">{project.id}</TableCell>
            <TableCell className="text-black">{project.clientName}</TableCell>
            <TableCell className="text-black">{project.packageType}</TableCell>
            <TableCell className="text-center text-black">{project.versions}</TableCell>
            <TableCell>{getStatusBadge(project.status)}</TableCell>
            <TableCell className="text-black">{formatDate(project.createdAt)}</TableCell>
            <TableCell className="text-black">{formatDate(project.expirationDate)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                  title="Editar projeto"
                >
                  <Link to={`/admin-j28s7d1k/previews/edit/${project.id}`}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                  title="Ver detalhes do projeto"
                >
                  <Link to={`/admin-j28s7d1k/previews/${project.id}`}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Ver</span>
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onSendReminder(project.id)}
                >
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Lembrete</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDelete(project.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Excluir</span>
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
