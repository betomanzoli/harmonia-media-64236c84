
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, User, Calendar, MailIcon, AlarmClock, Bell, Trash2, Eye } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ProjectItem } from '@/types/preview.types';
import { StatusBadge } from '@/components/ui/status-badge';
import { Input } from '@/components/ui/input';

export interface ProjectsTableProps {
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
  const [filter, setFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const navigate = useNavigate();
  
  const filteredProjects = projects
    .filter(project => 
      (project.clientName.toLowerCase().includes(filter.toLowerCase()) || 
       project.id.toLowerCase().includes(filter.toLowerCase()) ||
       (project.clientEmail && project.clientEmail.toLowerCase().includes(filter.toLowerCase()))) &&
      (selectedStatus === 'all' || project.status === selectedStatus)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const handleRowClick = (projectId: string) => {
    navigate(`/admin-j28s7d1k/previews/${projectId}`);
  };
  
  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      onDelete(id);
    }
  };
  
  const handleSendReminderClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onSendReminder(id);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <StatusBadge status="approved" customLabel="Aprovado" />;
      case 'feedback':
        return <StatusBadge status="in_progress" customLabel="Feedback" />;
      case 'waiting':
      default:
        return <StatusBadge status="pending" customLabel="Aguardando" />;
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Projetos de Prévia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Carregando projetos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-xl">Projetos de Prévia ({filteredProjects.length})</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Filtrar projetos..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-[200px]"
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="all">Todos</option>
              <option value="waiting">Aguardando</option>
              <option value="feedback">Feedback</option>
              <option value="approved">Aprovados</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Versões</TableHead>
                <TableHead className="hidden md:table-cell">Criado em</TableHead>
                <TableHead className="hidden md:table-cell">Atividade</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <TableRow 
                    key={project.id} 
                    className="cursor-pointer"
                    onClick={() => handleRowClick(project.id)}
                  >
                    <TableCell className="font-medium">{project.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{project.clientName}</span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <MailIcon className="h-3 w-3 mr-1" />
                          {project.clientEmail}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(project.status)}</TableCell>
                    <TableCell>{project.versions || 0}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{project.createdAt}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {project.lastActivityDate ? (
                        <div className="flex items-center">
                          <AlarmClock className="h-4 w-4 mr-2" />
                          <span>{project.lastActivityDate}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {project.status === 'waiting' && (
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={(e) => handleSendReminderClick(e, project.id)}
                          >
                            <Bell className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin-j28s7d1k/previews/${project.id}`);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={(e) => handleDeleteClick(e, project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {filter ? 'Nenhum projeto encontrado com o filtro aplicado.' : 'Nenhum projeto disponível.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsTable;
