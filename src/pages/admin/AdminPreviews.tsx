
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import PreviewsHeader from '@/components/admin/previews/PreviewsHeader';
import ProjectsListCard from '@/components/admin/previews/ProjectsListCard';
import NewProjectForm from '@/components/admin/previews/NewProjectForm';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const AdminPreviews: React.FC = () => {
  const { projects } = usePreviewProjects();
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
  
  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <h1 className="text-xl font-bold">Painel de Prévias Musicais</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin-j28s7d1k/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Dashboard
              </Link>
            </Button>
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
        </div>
        <div className="flex-1 overflow-auto p-8">
          <PreviewsHeader scrollToNewForm={scrollToNewForm} />
          <ProjectsListCard projects={projects} />
          <NewProjectForm />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPreviews;
