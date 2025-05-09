
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { Eye, Trash } from 'lucide-react';
import { ProjectItem } from '@/hooks/admin/usePreviewProjects';

interface ProjectsTableProps {
  projects: ProjectItem[];
  isLoading?: boolean;
  onDelete: (id: string) => void;
  onSendReminder?: (id: string) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ 
  projects, 
  isLoading = false,
  onDelete,
  onSendReminder 
}) => {
  // Format package type with capitalized first letter
  const formatPackageType = (packageType: string): string => {
    if (!packageType) return "Projeto de Música Personalizada";
    
    // Split by spaces and capitalize first letter of each word
    return packageType
      .split(' ')
      .map(word => {
        if (word.toLowerCase() === 'essencial' || 
            word.toLowerCase() === 'premium' || 
            word.toLowerCase() === 'profissional') {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word;
      })
      .join(' ');
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'waiting':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'feedback':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const statusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'waiting': return 'Aguardando';
      case 'feedback': return 'Feedback';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-medium text-black">Cliente</TableHead>
            <TableHead className="font-medium text-black">Pacote</TableHead>
            <TableHead className="font-medium text-black">Status</TableHead>
            <TableHead className="font-medium text-black">Versões</TableHead>
            <TableHead className="font-medium text-black">Criado em</TableHead>
            <TableHead className="font-medium text-black">Expira em</TableHead>
            <TableHead className="font-medium text-black text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                </div>
                <p className="mt-2">Carregando projetos...</p>
              </TableCell>
            </TableRow>
          ) : projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-black">
                <h3 className="font-bold text-xl mb-2">Projetos de Prévias</h3>
                <p>Nenhum projeto de prévia encontrado.</p>
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium text-black">{project.clientName}</TableCell>
                <TableCell className="text-black">{formatPackageType(project.packageType || "")}</TableCell>
                <TableCell>
                  <Badge className={statusColor(project.status)}>
                    {statusText(project.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-black">{project.versions || 0}</TableCell>
                <TableCell className="text-black">{project.createdAt}</TableCell>
                <TableCell className="text-black">{project.expirationDate || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-primary"
                      asChild
                    >
                      <Link to={`/admin-j28s7d1k/previews/${project.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-red-600"
                      onClick={() => onDelete(project.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
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
