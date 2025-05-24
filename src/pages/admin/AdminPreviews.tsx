
import React, { useState, useRef } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import PreviewsHeader from '@/components/admin/previews/PreviewsHeader';
import ProjectsTable from '@/components/admin/previews/ProjectsTable';
import NewProjectForm from '@/components/admin/previews/NewProjectForm';
import AdminPreviewGuide from '@/components/admin/guides/AdminPreviewGuide';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import ClientSelectionDialog from '@/components/admin/ClientSelectionDialog';
import { useCustomers } from '@/hooks/admin/useCustomers';
import { useToast } from '@/hooks/use-toast';

const AdminPreviews: React.FC = () => {
  const { projects } = usePreviewProjects();
  const { toast } = useToast();
  const newFormRef = useRef<HTMLDivElement>(null);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [showClientSelectionDialog, setShowClientSelectionDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  
  // Add missing functions
  const isLoading = false; // Simulated loading state
  
  const loadProjects = () => {
    console.log('Loading projects...');
    // Implementation would fetch projects from API
  };
  
  const deleteProject = (id: string) => {
    console.log(`Deleting project ${id}...`);
    setProjectToDelete(id);
    setShowDeleteConfirm(true);
  };
  
  const handleConfirmDelete = () => {
    if (projectToDelete) {
      console.log(`Confirmed delete for project ${projectToDelete}`);
      // In a real implementation, this would call an API to delete the project
      setShowDeleteConfirm(false);
      setProjectToDelete(null);
      
      toast({
        title: "Projeto excluído",
        description: `O projeto foi removido com sucesso.`
      });
    }
  };
  
  const handleAddProject = (projectData: any) => {
    console.log('Adding new project:', projectData);
    // In a real implementation, this would call an API to add the project
    
    setShowNewForm(false);
    
    toast({
      title: "Projeto criado",
      description: `O projeto para ${projectData.clientName} foi criado com sucesso.`
    });
  };
  
  const handleSendReminder = (projectId: string) => {
    console.log(`Sending reminder for project ${projectId}`);
    
    toast({
      title: "Lembrete enviado",
      description: `Um lembrete foi enviado para o cliente.`
    });
  };
  
  const scrollToNewForm = () => {
    setShowNewForm(true);
    setTimeout(() => {
      newFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const handleClientSelection = (option: 'new' | 'existing', clientId?: string) => {
    setShowClientSelectionDialog(false);
    
    if (option === 'new') {
      setSelectedClient(null);
      setShowNewForm(true);
    } else if (option === 'existing' && clientId) {
      // Here you would fetch client details or use a hook
      const mockClient = {
        id: clientId,
        name: `Cliente ${clientId.substring(0, 4)}`,
        email: `cliente${clientId.substring(0, 4)}@example.com`
      };
      
      setSelectedClient(mockClient);
      setShowNewForm(true);
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <PreviewsHeader scrollToNewForm={scrollToNewForm} />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ProjectsTable 
              projects={projects} 
              isLoading={isLoading} 
              onDelete={deleteProject} 
              onSendReminder={handleSendReminder} 
            />
            
            {showNewForm && (
              <div ref={newFormRef} className="bg-white p-6 border rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Criar Nova Prévia</h2>
                <NewProjectForm 
                  onSubmit={handleAddProject} 
                  onCancel={() => setShowNewForm(false)}
                  initialData={selectedClient}
                />
              </div>
            )}
          </div>
          
          <div>
            <AdminPreviewGuide />
          </div>
        </div>
        
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <ClientSelectionDialog 
          open={showClientSelectionDialog}
          onClose={() => setShowClientSelectionDialog(false)}
          onSelectClient={handleClientSelection}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminPreviews;
