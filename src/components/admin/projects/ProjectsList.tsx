import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ChevronDown, Search, Loader2 } from "lucide-react";
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { cn } from "@/lib/utils";

interface ProjectsListProps {
  onEditProject: (projectId: string) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ onEditProject }) => {
  const { projects, isLoading, loadProjects, deleteProject } = usePreviewProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('lastActivityDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      deleteProject(id);
    }
  };

  // Custom formatDate function since it's missing from utils
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    
    try {
      // Check if it's already in dd/mm/yyyy format
      if (/\d{2}\/\d{2}\/\d{4}/.test(dateString)) {
        return dateString;
      }
      
      // Otherwise try to parse and format the date
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };
  
  const filteredProjects = projects.filter(project => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (project.id && project.id.toLowerCase().includes(searchLower)) ||
      (project.clientName && project.clientName.toLowerCase().includes(searchLower)) ||
      (project.packageType && project.packageType.toLowerCase().includes(searchLower))
    );
  });
  
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let valueA: any = a[sortField as keyof typeof a];
    let valueB: any = b[sortField as keyof typeof b];
    
    // Handle dates
    if (sortField.includes('Date')) {
      valueA = valueA ? new Date(valueA.split('/').reverse().join('-')).getTime() : 0;
      valueB = valueB ? new Date(valueB.split('/').reverse().join('-')).getTime() : 0;
    }
    
    // Handle string comparisons
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    }
    
    // Handle number comparisons
    if (sortDirection === 'asc') {
      return valueA - valueB;
    } else {
      return valueB - valueA;
    }
  });

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Projetos em Andamento</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar projetos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
              <p className="mt-4 text-gray-500">Carregando projetos...</p>
            </div>
          </div>
        ) : sortedProjects.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('id')}>
                    ID {sortField === 'id' && (
                      <ChevronDown className={`inline ml-1 h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('clientName')}>
                    Cliente {sortField === 'clientName' && (
                      <ChevronDown className={`inline ml-1 h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('packageType')}>
                    Pacote {sortField === 'packageType' && (
                      <ChevronDown className={`inline ml-1 h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                    Status {sortField === 'status' && (
                      <ChevronDown className={`inline ml-1 h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('versions')}>
                    Versões {sortField === 'versions' && (
                      <ChevronDown className={`inline ml-1 h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('lastActivityDate')}>
                    Última Atividade {sortField === 'lastActivityDate' && (
                      <ChevronDown className={`inline ml-1 h-4 w-4 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProjects.map(project => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.id || 'N/A'}</TableCell>
                    <TableCell>{project.clientName || 'N/A'}</TableCell>
                    <TableCell>{project.packageType || 'N/A'}</TableCell>
                    <TableCell>
                      <StatusBadge status={project.status} />
                    </TableCell>
                    <TableCell>{project.versions || 0}</TableCell>
                    <TableCell>{formatDate(project.lastActivityDate) || 'N/A'}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditProject(project.id)}>
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`/preview/${project.id}`, '_blank')}>
                            Visualizar prévia
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(project.id)}>
                            Excluir projeto
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="rounded-full bg-gray-100 p-3 mx-auto w-fit mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-1">Nenhum projeto encontrado</h3>
            <p className="text-gray-500">
              {searchTerm ? "Tente alterar sua busca." : "Crie seu primeiro projeto abaixo."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  // Use custom styling with tailwind classes instead of variant props
  switch (status) {
    case 'waiting':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Aguardando Avaliação</Badge>;
    case 'feedback':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Feedback Recebido</Badge>;
    case 'approved':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Aprovada</Badge>;
    case 'inprogress':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Em Progresso</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

export default ProjectsList;
