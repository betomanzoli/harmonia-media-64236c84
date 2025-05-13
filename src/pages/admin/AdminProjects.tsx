
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Music, 
  HeartPulse, 
  Calendar, 
  FilePlus,
  Trash2,
  Pencil,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseData } from '@/hooks/use-supabase-data';

interface Project {
  id: string;
  title: string;
  client: string;
  client_id?: string;
  status: 'completed' | 'in_progress' | 'pending';
  progress: number;
  deadline: string;
  type: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  package_id?: string;
}

const AdminProjects: React.FC = () => {
  const { data: projects, isLoading, addItem, updateItem, deleteItem } = useSupabaseData<Project>('projects', {
    transformData: (data) => data.map(item => ({
      ...item,
      client: item.client || 'Cliente não especificado',
      progress: item.progress || (item.status === 'completed' ? 100 : item.status === 'in_progress' ? 50 : 0)
    }))
  });
  const [activeTab, setActiveTab] = useState('all');
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    client: '',
    type: '',
    deadline: '',
    description: ''
  });
  const { toast } = useToast();
  
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
  
  const handleNewProjectClick = () => {
    setIsNewProjectDialogOpen(true);
  };
  
  const handleNewProjectChange = (field: string, value: string) => {
    setNewProject({
      ...newProject,
      [field]: value
    });
  };
  
  const handleNewProjectSubmit = async () => {
    // Validar campos obrigatórios
    if (!newProject.title || !newProject.client || !newProject.type) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // Criar novo projeto
    await addItem({
      title: newProject.title,
      client: newProject.client,
      status: 'pending',
      progress: 0,
      deadline: newProject.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      type: newProject.type,
      description: newProject.description
    });
    
    // Fechar o diálogo e resetar o formulário
    setIsNewProjectDialogOpen(false);
    setNewProject({
      title: '',
      client: '',
      type: '',
      deadline: '',
      description: ''
    });
  };

  const handleEditClick = (project: Project) => {
    setCurrentProject(project);
    setIsEditProjectDialogOpen(true);
  };

  const handleDeleteClick = (project: Project) => {
    setCurrentProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleEditProjectSubmit = async () => {
    if (!currentProject) return;

    // Validar campos obrigatórios
    if (!currentProject.title || !currentProject.client || !currentProject.type) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // Atualizar projeto
    await updateItem(currentProject.id, {
      title: currentProject.title,
      client: currentProject.client,
      type: currentProject.type,
      deadline: currentProject.deadline,
      description: currentProject.description,
      status: currentProject.status,
      progress: currentProject.progress
    });
    
    // Fechar o diálogo
    setIsEditProjectDialogOpen(false);
    setCurrentProject(null);
  };

  const handleDeleteConfirm = async () => {
    if (!currentProject) return;
    
    await deleteItem(currentProject.id);
    
    setIsDeleteDialogOpen(false);
    setCurrentProject(null);
  };

  const handleEditProjectChange = (field: string, value: string | number) => {
    if (!currentProject) return;

    setCurrentProject({
      ...currentProject,
      [field]: value
    });
  };
  
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      return dateStr;
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciamento de Projetos</h1>
          <Button onClick={handleNewProjectClick}>
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
                {isLoading ? '...' : projects.length}
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
                {isLoading ? '...' : inProgressCount}
              </div>
              <Progress value={(inProgressCount / (projects.length || 1)) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {isLoading ? '...' : pendingCount}
              </div>
              <Progress value={(pendingCount / (projects.length || 1)) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {isLoading ? '...' : completedCount}
              </div>
              <Progress value={(completedCount / (projects.length || 1)) * 100} className="h-2 mt-2" />
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
                {isLoading ? (
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
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProjects.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.id.substring(0, 6)}</TableCell>
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
                                {formatDate(project.deadline)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" asChild>
                                  <Link to={`/admin-j28s7d1k/projects/${project.id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleEditClick(project)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteClick(project)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
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
        
        <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Projeto</DialogTitle>
              <DialogDescription>
                Preencha os detalhes do novo projeto musical.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="project-title" className="text-right">
                  Título
                </Label>
                <Input
                  id="project-title"
                  className="col-span-3"
                  value={newProject.title}
                  onChange={(e) => handleNewProjectChange('title', e.target.value)}
                  placeholder="Nome do projeto musical"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="project-client" className="text-right">
                  Cliente
                </Label>
                <Input
                  id="project-client"
                  className="col-span-3"
                  value={newProject.client}
                  onChange={(e) => handleNewProjectChange('client', e.target.value)}
                  placeholder="Nome do cliente"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="project-type" className="text-right">
                  Tipo
                </Label>
                <Select 
                  value={newProject.type} 
                  onValueChange={(value) => handleNewProjectChange('type', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o tipo de projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Música Romântica">Música Romântica</SelectItem>
                    <SelectItem value="Jingle Comercial">Jingle Comercial</SelectItem>
                    <SelectItem value="Trilha Corporativa">Trilha Corporativa</SelectItem>
                    <SelectItem value="Música Comemorativa">Música Comemorativa</SelectItem>
                    <SelectItem value="Trilha para Mídia">Trilha para Mídia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="project-deadline" className="text-right">
                  Prazo
                </Label>
                <Input
                  id="project-deadline"
                  type="date"
                  className="col-span-3"
                  value={newProject.deadline}
                  onChange={(e) => handleNewProjectChange('deadline', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="project-description" className="text-right">
                  Descrição
                </Label>
                <Textarea
                  id="project-description"
                  className="col-span-3"
                  value={newProject.description}
                  onChange={(e) => handleNewProjectChange('description', e.target.value)}
                  placeholder="Descrição detalhada do projeto"
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" onClick={handleNewProjectSubmit}>
                Criar Projeto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditProjectDialogOpen} onOpenChange={setIsEditProjectDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Projeto</DialogTitle>
              <DialogDescription>
                Atualize os detalhes do projeto musical.
              </DialogDescription>
            </DialogHeader>
            
            {currentProject && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-project-title" className="text-right">
                    Título
                  </Label>
                  <Input
                    id="edit-project-title"
                    className="col-span-3"
                    value={currentProject.title}
                    onChange={(e) => handleEditProjectChange('title', e.target.value)}
                    placeholder="Nome do projeto musical"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-project-client" className="text-right">
                    Cliente
                  </Label>
                  <Input
                    id="edit-project-client"
                    className="col-span-3"
                    value={currentProject.client}
                    onChange={(e) => handleEditProjectChange('client', e.target.value)}
                    placeholder="Nome do cliente"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-project-type" className="text-right">
                    Tipo
                  </Label>
                  <Select 
                    value={currentProject.type} 
                    onValueChange={(value) => handleEditProjectChange('type', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o tipo de projeto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Música Romântica">Música Romântica</SelectItem>
                      <SelectItem value="Jingle Comercial">Jingle Comercial</SelectItem>
                      <SelectItem value="Trilha Corporativa">Trilha Corporativa</SelectItem>
                      <SelectItem value="Música Comemorativa">Música Comemorativa</SelectItem>
                      <SelectItem value="Trilha para Mídia">Trilha para Mídia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-project-status" className="text-right">
                    Status
                  </Label>
                  <Select 
                    value={currentProject.status} 
                    onValueChange={(value: any) => handleEditProjectChange('status', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="in_progress">Em Progresso</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-project-progress" className="text-right">
                    Progresso
                  </Label>
                  <Input
                    id="edit-project-progress"
                    type="number"
                    min="0"
                    max="100"
                    className="col-span-3"
                    value={currentProject.progress}
                    onChange={(e) => handleEditProjectChange('progress', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-project-deadline" className="text-right">
                    Prazo
                  </Label>
                  <Input
                    id="edit-project-deadline"
                    type="date"
                    className="col-span-3"
                    value={currentProject.deadline ? new Date(currentProject.deadline).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleEditProjectChange('deadline', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-project-description" className="text-right">
                    Descrição
                  </Label>
                  <Textarea
                    id="edit-project-description"
                    className="col-span-3"
                    value={currentProject.description || ''}
                    onChange={(e) => handleEditProjectChange('description', e.target.value)}
                    placeholder="Descrição detalhada do projeto"
                    rows={4}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button type="submit" onClick={handleEditProjectSubmit}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Você tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
