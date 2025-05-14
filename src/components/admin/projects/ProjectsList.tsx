import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; 
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProjectEditForm from './ProjectEditForm';

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
  const [isLoading, setIsLoading] = useState(true);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();
  
  // Fetch projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        // For demonstration, using localStorage
        const storedProjects = localStorage.getItem('harmonIA_projects');
        if (storedProjects) {
          setProjects(JSON.parse(storedProjects));
        } else {
          // Sample data
          const sampleProjects = [
            {
              id: 'proj1',
              title: 'Música para Aniversário de 15 anos',
              clientName: 'Maria Silva',
              status: 'em_andamento',
              deadline: '2023-12-15',
              createdAt: '2023-10-25',
              packageType: 'Premium'
            },
            {
              id: 'proj2',
              title: 'Jingle Corporativo',
              clientName: 'Empresa ABC',
              status: 'concluido',
              deadline: '2023-11-30',
              createdAt: '2023-10-10',
              packageType: 'Profissional'
            },
            {
              id: 'proj3',
              title: 'Trilha para Vídeo de Casamento',
              clientName: 'João e Ana',
              status: 'aguardando_aprovacao',
              deadline: '2023-12-25',
              createdAt: '2023-10-15',
              packageType: 'Essencial'
            }
          ];
          setProjects(sampleProjects);
          localStorage.setItem('harmonIA_projects', JSON.stringify(sampleProjects));
        }
      } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        toast({
          title: 'Erro ao carregar dados',
          description: 'Não foi possível carregar a lista de projetos.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjects();
  }, [toast]);
  
  const confirmDeleteProject = (id: string) => {
    setProjectToDelete(id);
    setShowDeleteConfirm(true);
  };
  
  const handleDeleteProject = () => {
    if (!projectToDelete) return;
    
    try {
      const updatedProjects = projects.filter(project => project.id !== projectToDelete);
      setProjects(updatedProjects);
      localStorage.setItem('harmonIA_projects', JSON.stringify(updatedProjects));
      
      toast({
        title: 'Projeto excluído',
        description: 'O projeto foi excluído com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o projeto.',
        variant: 'destructive'
      });
    } finally {
      setProjectToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const openEditDialog = (project: Project) => {
    setCurrentProject(project);
    setShowEditDialog(true);
  };

  const openViewDialog = (project: Project) => {
    setCurrentProject(project);
    setShowViewDialog(true);
  };

  const handleCreateProject = (newProject: Project) => {
    const updatedProjects = [...projects, { ...newProject, id: `proj${projects.length + 1}` }];
    setProjects(updatedProjects);
    localStorage.setItem('harmonIA_projects', JSON.stringify(updatedProjects));
    
    toast({
      title: 'Projeto criado',
      description: 'O novo projeto foi criado com sucesso.',
    });
    
    setShowCreateDialog(false);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    const updatedProjects = projects.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    );
    
    setProjects(updatedProjects);
    localStorage.setItem('harmonIA_projects', JSON.stringify(updatedProjects));
    
    toast({
      title: 'Projeto atualizado',
      description: 'O projeto foi atualizado com sucesso.',
    });
    
    setShowEditDialog(false);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'em_andamento':
        return <Badge className="bg-blue-500">Em andamento</Badge>;
      case 'concluido':
        return <Badge className="bg-green-500">Concluído</Badge>;
      case 'aguardando_aprovacao':
        return <Badge className="bg-yellow-500">Aguardando aprovação</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      return dateString;
    }
  };
  
  if (isLoading) {
    return (
      <div className="text-center p-6">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-2 text-gray-500">Carregando projetos...</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projetos</h2>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>
    
      <Table>
        <TableCaption>Lista de projetos ativos.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome do Projeto</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Pacote</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length > 0 ? (
            projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>{project.clientName}</TableCell>
                <TableCell>{project.packageType || 'Não especificado'}</TableCell>
                <TableCell>{getStatusBadge(project.status)}</TableCell>
                <TableCell>{formatDate(project.deadline)}</TableCell>
                <TableCell>{formatDate(project.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openViewDialog(project)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openEditDialog(project)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => confirmDeleteProject(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                Nenhum projeto encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteProject}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {currentProject && (
        <>
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Editar Projeto</DialogTitle>
              </DialogHeader>
              <ProjectEditForm 
                project={currentProject}
                onSubmit={handleUpdateProject}
                onCancel={() => setShowEditDialog(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Detalhes do Projeto</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-right font-medium">ID:</p>
                  <p className="col-span-3">{currentProject.id}</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-right font-medium">Título:</p>
                  <p className="col-span-3">{currentProject.title}</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-right font-medium">Cliente:</p>
                  <p className="col-span-3">{currentProject.clientName}</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-right font-medium">Pacote:</p>
                  <p className="col-span-3">{currentProject.packageType || 'Não especificado'}</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-right font-medium">Status:</p>
                  <div className="col-span-3">{getStatusBadge(currentProject.status)}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-right font-medium">Prazo:</p>
                  <p className="col-span-3">{formatDate(currentProject.deadline)}</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-right font-medium">Criado em:</p>
                  <p className="col-span-3">{formatDate(currentProject.createdAt)}</p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setShowViewDialog(false)}>Fechar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};

export default ProjectsList;
