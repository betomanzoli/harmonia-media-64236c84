
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import PreviewsHeader from '@/components/admin/previews/PreviewsHeader';
import ProjectsListCard from '@/components/admin/previews/ProjectsListCard';
import NewProjectForm from '@/components/admin/previews/NewProjectForm';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminPreviews: React.FC = () => {
  const { projects } = usePreviewProjects();
  const { toast } = useToast();
  const [showHelp, setShowHelp] = useState(false);
  
  const scrollToNewForm = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
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
  
  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold">Painel de Prévias Musicais</h1>
          <Button 
            variant="outline" 
            size="sm" 
            className={`gap-2 ${showHelp ? 'bg-blue-100 border-blue-300' : ''}`}
            onClick={toggleHelp}
          >
            <HelpCircle className="w-4 h-4" />
            {showHelp ? 'Desativar ajuda' : 'Ativar ajuda'}
          </Button>
        </div>
        <ScrollArea className="flex-1 p-8">
          <PreviewsHeader scrollToNewForm={scrollToNewForm} />
          <ProjectsListCard projects={projects} />
          <NewProjectForm />
        </ScrollArea>
      </div>
    </AdminLayout>
  );
};

export default AdminPreviews;
