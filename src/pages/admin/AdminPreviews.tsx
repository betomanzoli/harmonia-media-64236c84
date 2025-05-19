
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import ProjectsTable from '@/components/admin/previews/ProjectsTable';
import NewProjectForm from '@/components/admin/previews/NewProjectForm';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';

const AdminPreviews: React.FC = () => {
  const { projects, addProject, deleteProject, loadProjects } = usePreviewProjects();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    loadProjects().then(() => {
      setIsLoading(false);
    });
  }, [loadProjects]);

  const handleAddProject = async (project: any) => {
    // Check if project exists to avoid type error
    if (project) {
      try {
        const newProjectId = await addProject(project);
        toast({
          title: "Projeto criado",
          description: `Projeto ${newProjectId} criado com sucesso.`
        });
        setShowAddForm(false);
        return newProjectId;
      } catch (error) {
        console.error("Error adding project:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao criar o projeto.",
          variant: "destructive"
        });
        return null;
      }
    }
    return null;
  };
  
  const confirmDeleteProject = (projectId: string) => {
    setProjectToDelete(projectId);
    setShowDeleteConfirm(true);
  };
  
  const handleDeleteProject = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      toast({
        title: "Projeto excluído",
        description: "O projeto foi excluído com sucesso."
      });
      setShowDeleteConfirm(false);
      setProjectToDelete(null);
    }
  };
  
  const handleSendReminder = (projectId: string) => {
    // Em uma implementação real, isso enviaria um email de lembrete
    toast({
      title: "Lembrete enviado",
      description: "Um lembrete foi enviado para o cliente."
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    loadProjects().then(() => {
      setIsLoading(false);
      toast({
        title: "Dados atualizados",
        description: "Os projetos foram atualizados."
      });
    });
  };
  
  return (
    <AdminLayout>
      <div className="flex flex-col h-full bg-gray-100">
        <div className="flex justify-between items-center p-6 border-b bg-white">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="mr-4"
            >
              <Link to="/admin-j28s7d1k/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-black">Projetos de Prévias</h1>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            
            <Button 
              size="sm"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
          </div>
        </div>
        
        <div className="p-6 flex-1 overflow-auto">
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6 border-b">
              <h2 className="text-xl font-medium text-black">Projetos de Prévias</h2>
              <p className="text-gray-500 text-sm mt-1">Lista de todos os projetos de prévias musicais.</p>
            </div>
            
            <ProjectsTable 
              projects={projects}
              isLoading={isLoading}
              onDelete={confirmDeleteProject}
              onSendReminder={handleSendReminder}
            />
          </div>
        </div>
        
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Projeto de Prévia</DialogTitle>
            </DialogHeader>
            <Separator className="my-4" />
            <NewProjectForm onAddProject={handleAddProject} />
          </DialogContent>
        </Dialog>
        
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Você tem certeza que deseja excluir este projeto de prévia? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDeleteProject}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPreviews;
