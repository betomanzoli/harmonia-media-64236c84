
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, RefreshCw } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface ProjectItem {
  id: string;
  clientName: string;
  clientEmail: string;
  packageType: string;
  createdAt: string;
  status: string;
  versions: number;
  previewUrl: string;
  expirationDate: string;
}

interface ProjectsTableProps {
  projects: ProjectItem[];
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects }) => {
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'waiting':
        return { label: 'Aguardando Avaliação', color: 'bg-yellow-500 text-white' };
      case 'feedback':
        return { label: 'Feedback Recebido', color: 'bg-blue-500 text-white' };
      case 'approved':
        return { label: 'Música Aprovada', color: 'bg-green-500 text-white' };
      default:
        return { label: status, color: 'bg-gray-500 text-white' };
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Pacote</TableHead>
          <TableHead>Criado em</TableHead>
          <TableHead>Expira em</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Versões</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map(project => {
          const status = getStatusDisplay(project.status);
          return (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.id}</TableCell>
              <TableCell>
                <div>
                  <p>{project.clientName}</p>
                  <p className="text-sm text-gray-500">{project.clientEmail}</p>
                </div>
              </TableCell>
              <TableCell>{project.packageType}</TableCell>
              <TableCell>{project.createdAt}</TableCell>
              <TableCell>{project.expirationDate}</TableCell>
              <TableCell>
                <Badge className={status.color}>{status.label}</Badge>
              </TableCell>
              <TableCell>{project.versions}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" 
                    onClick={() => window.open(project.previewUrl, '_blank')}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline"
                    onClick={() => toast({
                      title: "Email enviado",
                      description: `Um lembrete foi enviado para ${project.clientEmail}`
                    })}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ProjectsTable;
