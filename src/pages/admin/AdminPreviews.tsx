
import React, { useState, useRef } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { PreviewsHeader } from '@/components/admin/previews/PreviewsHeader';
import { ProjectsTable } from '@/components/admin/previews/ProjectsTable';
import { NewProjectForm } from '@/components/admin/previews/NewProjectForm';
import { AdminPreviewGuide } from '@/components/admin/guides/AdminPreviewGuide';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ClientSelectionDialog from '@/components/admin/ClientSelectionDialog';
import { usePreviewProjects, ProjectItem } from '@/hooks/admin/usePreviewProjects';

const AdminPreviews: React.FC = () => {
  const newFormRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('projects');
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const { projects, isLoading, loadProjects, deleteProject } = usePreviewProjects();
  
  const scrollToNewForm = () => {
    setActiveTab('add');
    setTimeout(() => {
      newFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const handleSelectClient = (option: 'new' | 'existing', clientId?: string) => {
    setIsClientDialogOpen(false);
    setActiveTab('add');
    
    // In a real app, this would pre-fill the form with client data
    console.log(`Selected ${option} client, ID: ${clientId || 'N/A'}`);
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <PreviewsHeader scrollToNewForm={scrollToNewForm} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-3 w-[400px]">
            <TabsTrigger value="projects">Projetos</TabsTrigger>
            <TabsTrigger value="add">Adicionar Novo</TabsTrigger>
            <TabsTrigger value="guide">Guia</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="pt-4">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Projetos de Prévias</h2>
              <Button onClick={() => setIsClientDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Projeto
              </Button>
            </div>
            
            <ProjectsTable projects={projects} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="add" className="pt-4">
            <div ref={newFormRef}>
              <NewProjectForm />
            </div>
          </TabsContent>
          
          <TabsContent value="guide" className="pt-4">
            <AdminPreviewGuide />
          </TabsContent>
        </Tabs>
      </div>
      
      <ClientSelectionDialog 
        open={isClientDialogOpen} 
        onClose={() => setIsClientDialogOpen(false)}
        onSelectClient={handleSelectClient}
      />
    </AdminLayout>
  );
};

export default AdminPreviews;
