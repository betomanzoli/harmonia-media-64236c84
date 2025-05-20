
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Project {
  id: string;
  clientName: string;
  title: string;
  status: string;
  date: string;
}

interface RecentProjectsListProps {
  projects: Project[];
}

const RecentProjectsList: React.FC<RecentProjectsListProps> = ({ projects }) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
      case 'waiting':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">Em Progresso</Badge>;
      case 'completed':
      case 'approved':
        return <Badge className="bg-green-500">Concluído</Badge>;
      case 'feedback':
        return <Badge className="bg-purple-500">Feedback</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Projetos Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Nenhum projeto encontrado. Crie um novo projeto para começar.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.id}</TableCell>
                  <TableCell>{project.clientName}</TableCell>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{getStatusBadge(project.status)}</TableCell>
                  <TableCell>{project.date}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                    >
                      <Link to={`/admin-j28s7d1k/previews/${project.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentProjectsList;
