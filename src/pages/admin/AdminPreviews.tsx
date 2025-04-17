
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import PreviewsHeader from '@/components/admin/previews/PreviewsHeader';
import ProjectsListCard from '@/components/admin/previews/ProjectsListCard';
import NewProjectForm from '@/components/admin/previews/NewProjectForm';
import { Button } from "@/components/ui/button";
import { HelpCircle, ArrowLeft, Download, Trash, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import WebhookUrlManager from '@/components/admin/integrations/WebhookUrlManager';
import PreviewsAdminGuide from '@/components/admin/guides/PreviewsAdminGuide';
import { 
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

const AdminPreviews: React.FC = () => {
  const { projects, addProject, deleteProject } = usePreviewProjects();
  const { toast } = useToast();
  const [showHelp, setShowHelp] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  const scrollToNewForm = () => {
    document.getElementById('new-project-form')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const toggleHelp = () => {
    setShowHelp(!showHelp);
    if (!showHelp) {
      toast({
        title: "Modo de ajuda ativado",
        description: "Passe o mouse sobre elementos da interface para ver dicas contextuais."
      });
    }
  };

  const handleAddProject = (project: any) => {
    // Check if project exists to avoid type error
    if (project) {
      const newProjectId = addProject(project);
      toast({
        title: "Projeto criado",
        description: `Projeto ${newProjectId} criado com sucesso.`
      });
      return newProjectId;
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
    // In a real implementation, this would send an email reminder
    toast({
      title: "Lembrete enviado",
      description: "Um lembrete foi enviado para o cliente."
    });
  };
  
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'feedback':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'waiting':
        return 'Aguardando Avaliação';
      case 'feedback':
        return 'Feedback Recebido';
      case 'approved':
        return 'Música Aprovada';
      default:
        return 'Desconhecido';
    }
  };
  
  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex items-center justify-between p-4 border-b bg-harmonia-green text-white">
          <h1 className="text-xl font-bold">Painel de Prévias Musicais</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="border-white text-white hover:bg-white/10"
            >
              <Link to="/admin-j28s7d1k/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Dashboard
              </Link>
            </Button>
            
            <PreviewsAdminGuide />
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <PreviewsHeader scrollToNewForm={scrollToNewForm} />
            </div>
            <div>
              <WebhookUrlManager 
                title="Integração de Prévias" 
                description="Configure o webhook para notificações de feedback de prévias"
                serviceType="previews"
                storageUrl="https://drive.google.com/drive/folders/1lLw3oBgNhlpUiYbo3wevgUvjA0RTV7tN"
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Projetos de Prévias</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Lista de todos os projetos de prévias musicais.</p>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Pacote</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Versões</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Expira em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">
                          <Link to={`/admin-j28s7d1k/previews/${project.id}`} className="text-harmonia-green hover:underline">
                            {project.id}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{project.clientName}</div>
                            <div className="text-gray-500">{project.clientEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>{project.packageType}</TableCell>
                        <TableCell>
                          <Badge className={getStatusClass(project.status)}>
                            {getStatusText(project.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{project.versions}</TableCell>
                        <TableCell>{project.createdAt}</TableCell>
                        <TableCell>{project.expirationDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              asChild
                              className="text-harmonia-green"
                            >
                              <Link to={`/admin-j28s7d1k/previews/${project.id}`}>
                                Ver
                              </Link>
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSendReminder(project.id)}
                            >
                              <Clock className="h-4 w-4 mr-1" />
                              Lembrar
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 hover:bg-red-50 border-red-200"
                              onClick={() => confirmDeleteProject(project.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        Nenhum projeto de prévia encontrado. Crie seu primeiro projeto abaixo.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div id="new-project-form">
            <NewProjectForm onAddProject={handleAddProject} />
          </div>
        </div>
      </div>
      
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
    </AdminLayout>
  );
};

export default AdminPreviews;
