
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
import WebhookUrlManager from '@/components/admin/integrations/WebhookUrlManager';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";

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
          <h1 className="text-xl font-bold text-harmonia-green">Painel de Prévias Musicais</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="border-harmonia-green text-harmonia-green hover:bg-harmonia-green/10"
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
                  className="gap-2 border-harmonia-green text-harmonia-green hover:bg-harmonia-green/10"
                >
                  <HelpCircle className="w-4 h-4" />
                  Guia do sistema
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Sistema de Prévias Musicais - Guia Rápido</DialogTitle>
                  <DialogDescription>
                    Este guia explica como gerenciar o fluxo de trabalho com as prévias musicais.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  <h3 className="text-lg font-medium">Fluxo de trabalho de prévias musicais</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md p-4 bg-yellow-50 border-yellow-200">
                      <h4 className="font-medium text-yellow-800 mb-2">1. Criação</h4>
                      <ul className="text-sm space-y-2 text-yellow-700">
                        <li>Crie um novo projeto de prévia</li>
                        <li>Adicione múltiplas versões musicais</li>
                        <li>Notifique o cliente automaticamente</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-blue-50 border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">2. Feedback</h4>
                      <ul className="text-sm space-y-2 text-blue-700">
                        <li>O cliente seleciona uma versão</li>
                        <li>Envia feedback detalhado</li>
                        <li>Você recebe notificação</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-green-50 border-green-200">
                      <h4 className="font-medium text-green-800 mb-2">3. Aprovação</h4>
                      <ul className="text-sm space-y-2 text-green-700">
                        <li>Cliente aprova uma versão</li>
                        <li>Projeto avança para produção final</li>
                        <li>Sistema notifica equipe interna</li>
                      </ul>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium pt-4">Prazos e Lembretes</h3>
                  <p className="text-sm text-gray-600">
                    Projetos têm um prazo para avaliação. A tabela destaca projetos com prazos próximos do vencimento.
                    Envie lembretes se o cliente não responder.
                  </p>
                  
                  <h3 className="text-lg font-medium pt-4">Experiência do cliente</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    O cliente acessa uma interface simplificada que permite:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                    <li>Ouvir todas as versões</li>
                    <li>Selecionar a versão preferida</li>
                    <li>Enviar feedback detalhado</li>
                    <li>Aprovar diretamente uma versão</li>
                  </ul>
                  
                  <div className="pt-4">
                    <a 
                      href="/PREVIEWS_README.md" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-harmonia-green hover:underline text-sm inline-flex items-center"
                    >
                      <HelpCircle className="h-4 w-4 mr-1" />
                      Ver documentação completa
                    </a>
                  </div>
                </div>
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
          
          <ProjectsListCard projects={projects} />
          <NewProjectForm />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPreviews;
