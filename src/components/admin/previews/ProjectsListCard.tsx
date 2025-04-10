
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectsTable from '@/components/admin/previews/ProjectsTable';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectItem } from '@/hooks/admin/usePreviewProjects';
import { Search, Filter } from 'lucide-react';

interface ProjectsListCardProps {
  projects: ProjectItem[];
}

const ProjectsListCard: React.FC<ProjectsListCardProps> = ({ projects }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  
  // Filtrar projetos baseado na pesquisa e filtros
  const filteredProjects = projects.filter(project => {
    // Pesquisa por ID ou nome do cliente
    const matchesSearch = searchTerm === '' || 
      project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por status
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    // Filtro por pacote
    const matchesPackage = packageFilter === 'all' || 
      project.packageType.toLowerCase() === packageFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesPackage;
  });

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Projetos de prévia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Pesquisar por ID ou cliente..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="waiting">Aguardando avaliação</SelectItem>
                  <SelectItem value="feedback">Feedback recebido</SelectItem>
                  <SelectItem value="approved">Aprovada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-48">
              <Select value={packageFilter} onValueChange={setPackageFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por pacote" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os pacotes</SelectItem>
                  <SelectItem value="essencial">Essencial</SelectItem>
                  <SelectItem value="profissional">Profissional</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <ProjectsTable projects={filteredProjects} />
      </CardContent>
    </Card>
  );
};

export default ProjectsListCard;
