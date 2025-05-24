import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import PreviewsHeader from '@/components/admin/previews/PreviewsHeader';
import ProjectsTable from '@/components/admin/previews/ProjectsTable';
import NewProjectForm from '@/components/admin/previews/NewProjectForm';
import AdminPreviewGuide from '@/components/admin/guides/AdminPreviewGuide';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import ClientSelectionDialog from '@/components/admin/ClientSelectionDialog';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
const AdminPreviews: React.FC = () => {
  const navigate = useNavigate();
  const {
    projects,
    isLoading,
    loadProjects,
    deleteProject
  } = usePreviewProjects();
  const [activeTab, setActiveTab] = useState<string>("projects");
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const newProjectFormRef = useRef<HTMLDivElement>(null);
  const {
    toast
  } = useToast();
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);
  const handleClientSelection = (option: 'new' | 'existing', clientId?: string) => {
    setIsClientDialogOpen(false);
    if (option === 'new') {
      // Navigate to create new client flow
      navigate('/admin-j28s7d1k/clients/new');
    } else if (option === 'existing' && clientId) {
      // Navigate to new preview with existing client
      navigate(`/admin-j28s7d1k/previews/new?clientId=${clientId}`);
    }
  };
  const scrollToNewForm = () => {
    newProjectFormRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const handleDeleteProject = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.')) {
      deleteProject(id);
      toast({
        title: "Projeto excluído",
        description: "O projeto foi excluído com sucesso"
      });
    }
  };
  const handleSendReminder = (id: string) => {
    // Implementação para enviar lembrete
    toast({
      title: "Lembrete enviado",
      description: "Um lembrete foi enviado para o cliente"
    });
  };
  const handleAddProject = (projectData: any) => {
    // Implementation for adding projects
    console.log("Adding project:", projectData);
    toast({
      title: "Projeto adicionado",
      description: "O projeto foi adicionado com sucesso"
    });
  };
  return <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <PreviewsHeader scrollToNewForm={scrollToNewForm} />
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin-j28s7d1k/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Dashboard
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="projects" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="projects">Projetos de Prévias</TabsTrigger>
            <TabsTrigger value="guide">Guia de Uso</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="space-y-6">
            <ProjectsTable projects={projects} isLoading={isLoading} onDelete={handleDeleteProject} onSendReminder={handleSendReminder} />
            
            {activeTab === "projects"}
          </TabsContent>
          
          <TabsContent value="guide">
            <AdminPreviewGuide />
          </TabsContent>
        </Tabs>
        
        <ClientSelectionDialog open={isClientDialogOpen} onClose={() => setIsClientDialogOpen(false)} onSelectClient={handleClientSelection} />
      </div>
    </AdminLayout>;
};
export default AdminPreviews;