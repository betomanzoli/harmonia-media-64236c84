
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Folder, FolderOpen, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectPhases from '@/components/admin/projects/ProjectPhases';
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Project {
  id: string;
  clientName: string;
  title: string;
  createdAt: string;
  status: 'pendente' | 'em_andamento' | 'concluido';
  currentPhase: 'briefing' | 'composicao' | 'producao' | 'aprovacao' | 'entrega';
  packageType: string;
}

const AdminProjects: React.FC = () => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<'all' | 'inProgress' | 'completed'>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [showExample, setShowExample] = useState(true);

  useEffect(() => {
    // Carregar projetos do localStorage ou usar exemplos padrão
    try {
      const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      
      if (savedProjects.length > 0) {
        setProjects(savedProjects);
        setShowExample(false);
      } else {
        // Projetos exemplo
        const defaultProjects: Project[] = [
          {
            id: 'PROJ-2025-001',
            clientName: 'Maria Silva',
            title: 'Música para Casamento',
            createdAt: '10/04/2025',
            status: 'em_andamento',
            currentPhase: 'producao',
            packageType: 'Premium'
          },
          {
            id: 'PROJ-2025-002',
            clientName: 'Carlos Oliveira',
            title: 'Jingle Comercial',
            createdAt: '05/04/2025',
            status: 'pendente',
            currentPhase: 'briefing',
            packageType: 'Profissional'
          },
          {
            id: 'PROJ-2025-003',
            clientName: 'Ana Rodrigues',
            title: 'Música para Aniversário',
            createdAt: '01/04/2025',
            status: 'concluido',
            currentPhase: 'entrega',
            packageType: 'Essencial'
          }
        ];
        
        setProjects(defaultProjects);
        localStorage.setItem('projects', JSON.stringify(defaultProjects));
      }
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      // Fallback para projetos exemplo
      setProjects([
        {
          id: 'PROJ-2025-001',
          clientName: 'Maria Silva',
          title: 'Música para Casamento',
          createdAt: '10/04/2025',
          status: 'em_andamento',
          currentPhase: 'producao',
          packageType: 'Premium'
        }
      ]);
    }
  }, []);

  const handleViewProjects = (view: 'all' | 'inProgress' | 'completed') => {
    setActiveView(view);
  };

  const filteredProjects = projects.filter(project => {
    if (activeView === 'all') return true;
    if (activeView === 'inProgress') return project.status === 'em_andamento';
    if (activeView === 'completed') return project.status === 'concluido';
    return true;
  });

  const createNewProject = () => {
    const newProject: Project = {
      id: `PROJ-2025-${String(projects.length + 1).padStart(3, '0')}`,
      clientName: 'Novo Cliente',
      title: 'Novo Projeto Musical',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      status: 'pendente',
      currentPhase: 'briefing',
      packageType: 'Essencial'
    };
    
    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    
    toast({
      title: "Projeto criado",
      description: `O projeto ${newProject.id} foi criado com sucesso!`
    });
    
    setShowExample(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">Projetos</h1>
            <p className="text-muted-foreground">
              Gerencie os projetos musicais em andamento
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={createNewProject}
              className="border-harmonia-green text-harmonia-green hover:bg-harmonia-green/10"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Projeto
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="border-harmonia-green text-harmonia-green hover:bg-harmonia-green/10"
            >
              <Link to="/admin-j28s7d1k/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Dashboard
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className={activeView === 'all' ? 'border-harmonia-green' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Folder className="mr-2 h-5 w-5 text-harmonia-green" />
                Todos os Projetos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualize e gerencie todos os projetos musicais em andamento.
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleViewProjects('all')}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Ver Projetos
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className={activeView === 'inProgress' ? 'border-harmonia-green' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Folder className="mr-2 h-5 w-5 text-amber-500" />
                Projetos em Andamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Projetos que estão atualmente em desenvolvimento ativo.
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleViewProjects('inProgress')}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Ver Andamento
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className={activeView === 'completed' ? 'border-harmonia-green' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Folder className="mr-2 h-5 w-5 text-green-500" />
                Projetos Concluídos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Projetos que foram finalizados e entregues aos clientes.
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleViewProjects('completed')}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Ver Concluídos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {showExample && activeView === 'all' && (
          <ProjectPhases 
            projectId="PROJ-2023-01" 
            projectType="Música Personalizada - Pacote Premium" 
            currentPhase="producao" 
          />
        )}
        
        {filteredProjects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                {activeView === 'all' && 'Todos os Projetos'}
                {activeView === 'inProgress' && 'Projetos em Andamento'}
                {activeView === 'completed' && 'Projetos Concluídos'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Fase Atual</TableHead>
                      <TableHead>Pacote</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map(project => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.id}</TableCell>
                        <TableCell>{project.clientName}</TableCell>
                        <TableCell>{project.title}</TableCell>
                        <TableCell>{project.createdAt}</TableCell>
                        <TableCell>
                          {project.status === 'pendente' && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              Pendente
                            </Badge>
                          )}
                          {project.status === 'em_andamento' && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Em Andamento
                            </Badge>
                          )}
                          {project.status === 'concluido' && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Concluído
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {project.currentPhase === 'briefing' && 'Briefing'}
                            {project.currentPhase === 'composicao' && 'Composição'}
                            {project.currentPhase === 'producao' && 'Produção'}
                            {project.currentPhase === 'aprovacao' && 'Aprovação'}
                            {project.currentPhase === 'entrega' && 'Entrega Final'}
                          </Badge>
                        </TableCell>
                        <TableCell>{project.packageType}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Gerenciar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
        
        {filteredProjects.length === 0 && (
          <div className="bg-card p-6 rounded-lg border text-center">
            <p className="text-muted-foreground mb-4">Nenhum projeto encontrado nesta categoria.</p>
            <Button onClick={createNewProject}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Novo Projeto
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
