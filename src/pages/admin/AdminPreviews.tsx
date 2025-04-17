
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import PreviewsHeader from '@/components/admin/previews/PreviewsHeader';
import ProjectsListCard from '@/components/admin/previews/ProjectsListCard';
import NewProjectForm from '@/components/admin/previews/NewProjectForm';
import { Button } from "@/components/ui/button";
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import WebhookUrlManager from '@/components/admin/integrations/WebhookUrlManager';
import AdminPreviewGuide from '@/components/admin/guides/AdminPreviewGuide';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";

const AdminPreviews: React.FC = () => {
  const { projects, addProject } = usePreviewProjects();
  const { toast } = useToast();
  const [showHelp, setShowHelp] = useState(false);
  
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
      return addProject(project);
    }
    return null;
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
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 border-white text-white hover:bg-white/10"
                >
                  <HelpCircle className="w-4 h-4" />
                  Guia do sistema
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Sistema de Prévias Musicais - Guia Detalhado</DialogTitle>
                </DialogHeader>
                <AdminPreviewGuide />
              </DialogContent>
            </Dialog>
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
          
          <ProjectsListCard projects={projects || []} />
          <NewProjectForm onAddProject={handleAddProject} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPreviews;
