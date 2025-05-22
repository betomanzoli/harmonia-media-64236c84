
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
import { supabase } from '@/lib/supabase';

const AdminPreviews: React.FC = () => {
  const navigate = useNavigate();
  const { projects, isLoading, loadProjects, deleteProject, addProject } = usePreviewProjects();
  const [activeTab, setActiveTab] = useState<string>("projects");
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const newProjectFormRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

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
    newProjectFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.')) {
      try {
        setIsDeleting(true);
        console.log(`Excluindo projeto: ${id}`);
        
        // Primeiro, verificar se o projeto existe no Supabase
        const { data: projectData, error: projectError } = await supabase
          .from('preview_projects')
          .select('id')
          .eq('id', id)
          .maybeSingle();
          
        if (projectError) {
          console.error("Erro ao verificar projeto:", projectError);
        }
        
        // Se não existe no Supabase, não tente excluir de lá
        if (!projectData) {
          console.log("Projeto não encontrado no Supabase, excluindo apenas localmente");
          deleteProject(id);
          toast({
            title: "Projeto excluído",
            description: "O projeto foi excluído localmente"
          });
          return;
        }
        
        // Projeto existe, prosseguir com exclusão
        const success = await deleteProject(id);
        
        if (success) {
          toast({
            title: "Projeto excluído",
            description: "O projeto foi excluído com sucesso"
          });
        } else {
          toast({
            title: "Erro ao excluir",
            description: "Houve um problema ao excluir o projeto"
          });
        }
      } catch (error) {
        console.error("Erro ao excluir projeto:", error);
        toast({
          title: "Erro ao excluir",
          description: "Houve um problema ao excluir o projeto"
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  const handleSendReminder = (id: string) => {
    // Implementação para enviar lembrete
    toast({
      title: "Lembrete enviado",
      description: "Um lembrete foi enviado para o cliente"
    });
  };
  
  const handleAddProject = async (projectData: any) => {
    try {
      console.log("Adicionando projeto:", projectData);
      
      // Gerar ID único se não fornecido
      const projectId = projectData.id || `P${Date.now().toString().substring(6)}`;
      
      // Adicionar projeto no Supabase
      const newProjectId = await addProject({
        ...projectData,
        id: projectId
      });
      
      if (newProjectId) {
        toast({
          title: "Projeto adicionado",
          description: "O projeto foi adicionado com sucesso"
        });
        
        // Recarregar lista de projetos
        loadProjects();
      } else {
        toast({
          title: "Erro ao adicionar",
          description: "Não foi possível adicionar o projeto"
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar projeto:", error);
      toast({
        title: "Erro ao adicionar",
        description: "Houve um problema ao adicionar o projeto"
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <PreviewsHeader scrollToNewForm={scrollToNewForm} />
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
            >
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
            <ProjectsTable 
              projects={projects} 
              isLoading={isLoading || isDeleting} 
              onDelete={handleDeleteProject}
              onSendReminder={handleSendReminder}
            />
            
            {activeTab === "projects" && (
              <div className="mt-8" ref={newProjectFormRef}>
                <h2 className="text-2xl font-semibold mb-4">Criar Novo Projeto de Prévias</h2>
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <div className="mb-6 text-center">
                    <p className="text-gray-500 mb-4">Para criar um novo projeto de prévias, é recomendado seguir o fluxo completo:</p>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsClientDialogOpen(true)}
                      >
                        Criar Novo Projeto de Prévia
                      </Button>
                      <span className="text-gray-400">ou</span>
                      <Button
                        variant="default"
                        asChild
                      >
                        <Link to="/admin-j28s7d1k/briefings">
                          Iniciar pelo Briefing (Recomendado)
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <NewProjectForm onAddProject={handleAddProject} />
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="guide">
            <AdminPreviewGuide />
          </TabsContent>
        </Tabs>
        
        <ClientSelectionDialog 
          open={isClientDialogOpen}
          onClose={() => setIsClientDialogOpen(false)}
          onSelectClient={handleClientSelection}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminPreviews;
