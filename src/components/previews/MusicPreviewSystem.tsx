
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { usePreviewData } from '@/hooks/use-preview-data';
import PreviewHeader from './PreviewHeader';
import PreviewInstructions from './PreviewInstructions';
import PreviewPlayerList from './PreviewPlayerList';
import PreviewFeedbackForm from './PreviewFeedbackForm';
import PreviewNextSteps from './PreviewNextSteps';
import PreviewLoadingState from './PreviewLoadingState';
import PreviewFooter from './PreviewFooter';

const MusicPreviewSystem: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  
  // Usar o hook personalizado para buscar dados do projeto
  const { projectData, setProjectData, isLoading } = usePreviewData(projectId);
  
  // Adicionar proteção para impedir downloads de áudio
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest('audio')) {
        e.preventDefault();
        toast({
          title: "Proteção de conteúdo",
          description: "O download direto das prévias não é permitido nesta fase.",
          variant: "destructive"
        });
        return false;
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [toast]);

  const handleSubmitFeedback = () => {
    if (!selectedVersion) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma das versões antes de enviar seu feedback.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Feedback enviado!",
      description: "Obrigado pelo seu feedback. Nossa equipe já está analisando.",
    });
    
    // Atualizar status localmente para propósitos de demonstração
    setProjectData(prev => prev ? {...prev, status: 'feedback' as const} : null);
  };
  
  const handleApprove = () => {
    if (!selectedVersion) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma das versões antes de aprovar.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Música aprovada!",
      description: "Excelente escolha! Vamos finalizar sua música e entregar em breve.",
    });
    
    // Atualizar status localmente para propósitos de demonstração
    setProjectData(prev => prev ? {...prev, status: 'approved' as const} : null);
  };
  
  if (isLoading || !projectData) {
    return <PreviewLoadingState />;
  }
  
  return (
    <div className="max-w-4xl mx-auto pt-10">
      <PreviewHeader projectData={projectData} />
      
      <PreviewInstructions status={projectData.status} />
      
      <Tabs defaultValue="versions" className="mt-6">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="versions" className="flex-1 data-[state=active]:bg-harmonia-green data-[state=active]:text-white">
            Versões Propostas
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex-1 data-[state=active]:bg-harmonia-green data-[state=active]:text-white">
            Enviar Feedback
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="versions">
          <PreviewPlayerList
            previews={projectData.previews}
            selectedPreview={selectedVersion}
            setSelectedPreview={setSelectedVersion}
            isApproved={projectData.status === 'approved'}
          />
        </TabsContent>
        
        <TabsContent value="feedback">
          <PreviewFeedbackForm 
            selectedPreview={selectedVersion}
            feedback={feedback}
            setFeedback={setFeedback}
            handleSubmit={handleSubmitFeedback}
            handleApprove={handleApprove}
            status={projectData.status}
            versionTitle={projectData.previews.find(p => p.id === selectedVersion)?.title}
          />
        </TabsContent>
      </Tabs>
      
      <PreviewNextSteps status={projectData.status} />
      
      <PreviewFooter />
    </div>
  );
};

export default MusicPreviewSystem;
