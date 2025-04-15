
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Folder, FolderOpen, Plus, Eye, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectPhases from '@/components/admin/projects/ProjectPhases';
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Project {
  id: string;
  clientName: string;
  clientEmail: string;
  title: string;
  createdAt: string;
  status: 'pendente' | 'em_andamento' | 'concluido';
  currentPhase: 'briefing' | 'composicao' | 'producao' | 'aprovacao' | 'entrega';
  packageType: string;
  briefingId?: string;
  projectDescription?: string;
}

const projectSchema = z.object({
  clientName: z.string().min(3, { message: "O nome do cliente deve ter pelo menos 3 caracteres" }),
  clientEmail: z.string().email({ message: "Email inválido" }),
  title: z.string().min(5, { message: "O título deve ter pelo menos 5 caracteres" }),
  packageType: z.string(),
  projectDescription: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres" }),
  briefingId: z.string().optional()
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const AdminProjects: React.FC = () => {
  const { toast } = useToast();
  const { addProject: addPreviewProject } = usePreviewProjects();
  const [activeView, setActiveView] = useState<'all' | 'inProgress' | 'completed'>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [showExample, setShowExample] = useState(true);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showManageDialog, setShowManageDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      clientName: '',
      clientEmail: '',
      title: '',
      packageType: 'Profissional',
      projectDescription: '',
      briefingId: ''
    }
  });

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
            clientEmail: 'maria.silva@email.com',
            title: 'Música para Casamento',
            createdAt: '10/04/2025',
            status: 'em_andamento',
            currentPhase: 'producao',
            packageType: 'Premium',
            projectDescription: 'Música para cerimônia de casamento com tema romântico'
          },
          {
            id: 'PROJ-2025-002',
            clientName: 'Carlos Oliveira',
            clientEmail: 'carlos.oliveira@email.com',
            title: 'Jingle Comercial',
            createdAt: '05/04/2025',
            status: 'pendente',
            currentPhase: 'briefing',
            packageType: 'Profissional',
            projectDescription: 'Jingle para marca de produtos naturais'
          },
          {
            id: 'PROJ-2025-003',
            clientName: 'Ana Rodrigues',
            clientEmail: 'ana.rodrigues@email.com',
            title: 'Música para Aniversário',
            createdAt: '01/04/2025',
            status: 'concluido',
            currentPhase: 'entrega',
            packageType: 'Essencial',
            projectDescription: 'Música de aniversário personalizada para criança de 5 anos'
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
          clientEmail: 'maria.silva@email.com',
          title: 'Música para Casamento',
          createdAt: '10/04/2025',
          status: 'em_andamento',
          currentPhase: 'producao',
          packageType: 'Premium',
          projectDescription: 'Música para cerimônia de casamento com tema romântico'
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

  const createNewProject = (data: ProjectFormValues) => {
    // Gerar ID com base na data e número de projetos
    const year = new Date().getFullYear();
    const projectNumber = (projects.length + 1).toString().padStart(3, '0');
    const newId = `PROJ-${year}-${projectNumber}`;
    
    const now = new Date();
    const formattedDate = now.toLocaleDateString('pt-BR');
    
    const newProject: Project = {
      id: newId,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      title: data.title,
      createdAt: formattedDate,
      status: 'pendente',
      currentPhase: 'briefing',
      packageType: data.packageType,
      projectDescription: data.projectDescription,
      briefingId: data.briefingId || undefined
    };
    
    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    
    // Também criar um projeto de prévia correspondente
    const previewProjectId = addPreviewProject({
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      packageType: data.packageType,
      createdAt: formattedDate,
      status: 'waiting',
      versions: 0,
      previewUrl: '',
      expirationDate: new Date(now.setDate(now.getDate() + 7)).toLocaleDateString('pt-BR'),
      lastActivityDate: formattedDate
    });
    
    toast({
      title: "Projeto criado",
      description: `O projeto ${newId} foi criado com sucesso e vinculado à prévia ${previewProjectId}!`
    });
    
    setShowExample(false);
    setShowNewProjectDialog(false);
    form.reset();
  };

  const openManageProject = (project: Project) => {
    setSelectedProject(project);
    setShowManageDialog(true);
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
              onClick={() => setShowNewProjectDialog(true)}
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
            onPhaseAction={(phaseId, action) => {
              toast({
                title: `Ação ${action} na fase ${phaseId}`,
                description: "Essa é uma demonstração. Crie um projeto real para gerenciar."
              });
            }} 
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
              <div className="overflow-x-auto border rounded-md">
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openManageProject(project)}
                          >
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
            <Button onClick={() => setShowNewProjectDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Novo Projeto
            </Button>
          </div>
        )}
      </div>

      {/* Dialog for creating new project */}
      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Projeto</DialogTitle>
            <DialogDescription>
              Preencha as informações para criar um novo projeto musical.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(createNewProject)} className="space-y-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo do cliente" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email do Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" type="email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Projeto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Música para Casamento de João e Maria" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="packageType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pacote</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o pacote" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Essencial">Essencial</SelectItem>
                        <SelectItem value="Profissional">Profissional</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="projectDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do Projeto</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva brevemente o projeto musical" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="briefingId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID do Briefing (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Se houver um briefing associado" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowNewProjectDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-harmonia-green hover:bg-harmonia-green/90">
                  Criar Projeto
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog for managing project */}
      <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Projeto: {selectedProject?.id}</DialogTitle>
            <DialogDescription>
              Detalhes e gerenciamento do projeto {selectedProject?.title}.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Informações do Cliente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Nome:</dt>
                        <dd>{selectedProject.clientName}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Email:</dt>
                        <dd>{selectedProject.clientEmail}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Pacote:</dt>
                        <dd>{selectedProject.packageType}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Detalhes do Projeto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Título:</dt>
                        <dd>{selectedProject.title}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Criado em:</dt>
                        <dd>{selectedProject.createdAt}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Status:</dt>
                        <dd>
                          <Badge variant="outline" className={
                            selectedProject.status === 'pendente' ? "bg-yellow-50 text-yellow-700" :
                            selectedProject.status === 'em_andamento' ? "bg-blue-50 text-blue-700" :
                            "bg-green-50 text-green-700"
                          }>
                            {selectedProject.status === 'pendente' ? 'Pendente' :
                             selectedProject.status === 'em_andamento' ? 'Em Andamento' :
                             'Concluído'}
                          </Badge>
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Descrição do Projeto</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{selectedProject.projectDescription}</p>
                </CardContent>
              </Card>
              
              <ProjectPhases 
                projectId={selectedProject.id}
                projectType={`${selectedProject.title} - Pacote ${selectedProject.packageType}`}
                currentPhase={selectedProject.currentPhase}
                onPhaseAction={(phaseId, action) => {
                  toast({
                    title: `Ação ${action} na fase ${phaseId}`,
                    description: "Esta funcionalidade será implementada em breve."
                  });
                }}
              />
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  asChild
                >
                  <Link to={`/admin-j28s7d1k/previews/${selectedProject.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver prévias do projeto
                  </Link>
                </Button>
                
                <Button
                  variant="outline"
                  className="border-harmonia-green text-harmonia-green"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Enviar mensagem ao cliente
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProjects;
