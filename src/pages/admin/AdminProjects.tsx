
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Music, 
  HeartPulse, 
  Calendar, 
  FilePlus,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for projects
const mockProjects = [
  {
    id: 'P001',
    title: 'Música para Aniversário de Casamento',
    client: 'João e Maria Silva',
    status: 'in_progress',
    progress: 65,
    deadline: '28/07/2023',
    type: 'Música Romântica',
    team: ['compositor1', 'produtor2']
  },
  {
    id: 'P002',
    title: 'Jingle para Marca de Roupas',
    client: 'ModaStyle Ltda.',
    status: 'pending',
    progress: 20,
    deadline: '15/08/2023',
    type: 'Jingle Comercial',
    team: ['compositor2', 'produtor1', 'vocal3']
  },
  {
    id: 'P003',
    title: 'Trilha para Vídeo Institucional',
    client: 'TechSolutions Inc.',
    status: 'completed',
    progress: 100,
    deadline: '10/07/2023',
    type: 'Trilha Corporativa',
    team: ['compositor1', 'produtor3']
  },
  {
    id: 'P004',
    title: 'Música para Formatura',
    client: 'Turma de Medicina 2023',
    status: 'in_progress',
    progress: 45,
    deadline: '05/08/2023',
    type: 'Música Comemorativa',
    team: ['compositor3', 'produtor2', 'vocal1']
  },
  {
    id: 'P005',
    title: 'Tema Musical para Podcast',
    client: 'Carlos Mendes',
    status: 'in_progress',
    progress: 80,
    deadline: '20/07/2023',
    type: 'Trilha para Mídia',
    team: ['compositor2', 'produtor1']
  }
];

const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 800);
  }, []);
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" /> Concluído
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="mr-1 h-3 w-3" /> Em Progresso
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="mr-1 h-3 w-3" /> Pendente
          </Badge>
        );
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };
  
  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(p => p.status === activeTab);
  
  // Count projects by status
  const completedCount = projects.filter(p => p.status === 'completed').length;
  const inProgressCount = projects.filter(p => p.status === 'in_progress').length;
  const pendingCount = projects.filter(p => p.status === 'pending').length;
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciamento de Projetos</h1>
          <Button>
            <FilePlus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : projects.length}
              </div>
              <p className="text-xs text-muted-foreground">
                +2 novos este mês
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
              <HeartPulse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {loading ? '...' : inProgressCount}
              </div>
              <Progress value={(inProgressCount / projects.length) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {loading ? '...' : pendingCount}
              </div>
              <Progress value={(pendingCount / projects.length) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {loading ? '...' : completedCount}
              </div>
              <Progress value={(completedCount / projects.length) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Projetos Musicais</CardTitle>
            <CardDescription>Gerencie todos os projetos de composição musical.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="in_progress">Em Progresso</TabsTrigger>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                <TabsTrigger value="completed">Concluídos</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200"></div>
                    <p className="mt-2 text-sm text-gray-500">Carregando projetos...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Projeto</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Progresso</TableHead>
                          <TableHead>Prazo</TableHead>
                          <TableHead>Equipe</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProjects.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.id}</TableCell>
                            <TableCell>{project.title}</TableCell>
                            <TableCell>{project.client}</TableCell>
                            <TableCell>{project.type}</TableCell>
                            <TableCell>{getStatusBadge(project.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Progress value={project.progress} className="h-2 w-24 mr-2" />
                                <span className="text-sm">{project.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-4 w-4 text-gray-500" />
                                {project.deadline}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Users className="mr-1 h-4 w-4 text-gray-500" />
                                {project.team.length}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button asChild variant="ghost" size="sm">
                                <Link to={`/admin-j28s7d1k/projects/${project.id}`}>
                                  <span className="sr-only">Ver projeto</span>
                                  <ChevronRight className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
