import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Calendar, Edit, Trash2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  clientName: string;
  status: string;
  deadline: string;
  createdAt: string;
  packageType?: string;
}

const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    status: 'em_andamento',
    deadline: '',
    packageType: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load projects from localStorage
    const storedProjects = localStorage.getItem('harmonIA_projects');
    if (storedProjects) {
      try {
        setProjects(JSON.parse(storedProjects));
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedProject && showEditDialog) {
      setFormData({
        title: selectedProject.title,
        clientName: selectedProject.clientName,
        status: selectedProject.status,
        deadline: selectedProject.deadline,
        packageType: selectedProject.packageType || ''
      });
    }
  }, [selectedProject, showEditDialog]);

  const saveProjects = (updatedProjects: Project[]) => {
    localStorage.setItem('harmonIA_projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  const handleAddProject = () => {
    const newProject = {
      id: `P${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`,
      title: formData.title,
      clientName: formData.clientName,
      status: formData.status,
      deadline: formData.deadline,
      createdAt: new Date().toISOString().split('T')[0],
      packageType: formData.packageType
    };

    const updatedProjects = [...projects, newProject];
    saveProjects(updatedProjects);
    
    toast({
      title: "Projeto criado",
      description: `O projeto "${newProject.title}" foi adicionado com sucesso.`
    });
    
    setShowNewProjectDialog(false);
    // Reset form data
    setFormData({
      title: '',
      clientName: '',
      status: 'em_andamento',
      deadline: '',
      packageType: ''
    });
  };

  const handleEditProject = () => {
    if (!selectedProject) return;

    const updatedProjects = projects.map(project => 
      project.id === selectedProject.id 
        ? { ...project, ...formData }
        : project
    );
    
    saveProjects(updatedProjects);
    
    toast({
      title: "Projeto atualizado",
      description: `O projeto "${formData.title}" foi atualizado com sucesso.`
    });
    
    setShowEditDialog(false);
    setSelectedProject(null);
  };

  const handleDeleteProject = () => {
    if (!selectedProject) return;

    const updatedProjects = projects.filter(project => project.id !== selectedProject.id);
    saveProjects(updatedProjects);
    
    toast({
      title: "Projeto excluído",
      description: `O projeto "${selectedProject.title}" foi excluído com sucesso.`,
      variant: "destructive"
    });
    
    setShowDeleteDialog(false);
    setSelectedProject(null);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'em_andamento':
        return <Badge className="bg-blue-500">Em Andamento</Badge>;
      case 'concluido':
        return <Badge className="bg-green-500">Concluído</Badge>;
      case 'atrasado':
        return <Badge className="bg-red-500">Atrasado</Badge>;
      case 'pausado':
        return <Badge className="bg-yellow-500">Pausado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projetos</h2>
        <Button onClick={() => setShowNewProjectDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Projeto</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Limite</TableHead>
              <TableHead>Pacote</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum projeto encontrado.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.id}</TableCell>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.clientName}</TableCell>
                  <TableCell>{getStatusBadge(project.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                      {formatDate(project.deadline)}
                    </div>
                  </TableCell>
                  <TableCell>{project.packageType || "Não especificado"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedProject(project);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedProject(project);
                            setShowDeleteDialog(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* New Project Dialog */}
      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Projeto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium" htmlFor="title">
                Título do Projeto
              </label>
              <input
                id="title"
                name="title"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="Digite o título do projeto"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="clientName">
                Nome do Cliente
              </label>
              <input
                id="clientName"
                name="clientName"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="Nome do cliente"
                value={formData.clientName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="packageType">
                Pacote
              </label>
              <select
                id="packageType"
                name="packageType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.packageType}
                onChange={handleChange}
              >
                <option value="">Selecione um pacote</option>
                <option value="Essencial">Essencial</option>
                <option value="Profissional">Profissional</option>
                <option value="Premium">Premium</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
                <option value="atrasado">Atrasado</option>
                <option value="pausado">Pausado</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="deadline">
                Data Limite
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowNewProjectDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddProject}>Criar Projeto</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Projeto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium" htmlFor="edit-title">
                Título do Projeto
              </label>
              <input
                id="edit-title"
                name="title"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="Digite o título do projeto"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="edit-clientName">
                Nome do Cliente
              </label>
              <input
                id="edit-clientName"
                name="clientName"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="Nome do cliente"
                value={formData.clientName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="edit-packageType">
                Pacote
              </label>
              <select
                id="edit-packageType"
                name="packageType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.packageType}
                onChange={handleChange}
              >
                <option value="">Selecione um pacote</option>
                <option value="Essencial">Essencial</option>
                <option value="Profissional">Profissional</option>
                <option value="Premium">Premium</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="edit-status">
                Status
              </label>
              <select
                id="edit-status"
                name="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
                <option value="atrasado">Atrasado</option>
                <option value="pausado">Pausado</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="edit-deadline">
                Data Limite
              </label>
              <input
                id="edit-deadline"
                name="deadline"
                type="date"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditProject}>Salvar Alterações</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o projeto "{selectedProject?.title}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteProject}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectsList;
