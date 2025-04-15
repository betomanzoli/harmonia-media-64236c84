
import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { Eye, Mail, Clock, CheckCircle, RefreshCw, MessageSquare, AlertTriangle } from 'lucide-react';
import { ProjectItem } from '@/hooks/admin/usePreviewProjects';
import { useToast } from '@/hooks/use-toast';

interface ProjectsTableProps {
  projects: ProjectItem[];
  isLoading?: boolean;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects, isLoading = false }) => {
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
    }, 1500);
  };

  // Verifica se o projeto está próximo da expiração (menos de 3 dias)
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
      <div className="rounded-md border p-8 text-center">
        <div className="animate-spin h-8 w-8 border-2 border-harmonia-green border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">Carregando projetos...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-gray-500 mb-4">Nenhum projeto de prévia encontrado</p>
        <Button variant="outline">Criar novo projeto</Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto max-w-full">
      <Table>
        <TableCaption>Lista de projetos de prévia musical</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">ID</TableHead>
            <TableHead className="whitespace-nowrap">Cliente</TableHead>
            <TableHead className="whitespace-nowrap">Status</TableHead>
            <TableHead className="whitespace-nowrap">Pacote</TableHead>
            <TableHead className="whitespace-nowrap">Criado em</TableHead>
            <TableHead className="whitespace-nowrap">Expiração</TableHead>
            <TableHead className="whitespace-nowrap">Versões</TableHead>
            <TableHead className="text-right whitespace-nowrap">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium whitespace-nowrap">{project.id}</TableCell>
              <TableCell className="whitespace-nowrap">{project.clientName}</TableCell>
              <TableCell className="whitespace-nowrap">{getStatusBadge(project.status)}</TableCell>
              <TableCell className="whitespace-nowrap">{project.packageType}</TableCell>
              <TableCell className="whitespace-nowrap">{project.createdAt}</TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center">
                  {isNearExpiration(project.expirationDate) && (
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                  )}
                  <span className={isNearExpiration(project.expirationDate) ? 'text-amber-600' : ''}>
                    {project.expirationDate}
                  </span>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">{project.versions}</TableCell>
              <TableCell className="text-right whitespace-nowrap">
                <div className="flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    asChild
                  >
                    <Link to={`/admin-j28s7d1k/previews/${project.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleSendReminder(project)}
                    disabled={sendingReminder === project.id || project.status === 'approved'}
                  >
                    {sendingReminder === project.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTable;
