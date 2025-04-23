
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { usePreviewData } from '@/hooks/usePreviewData';
import PreviewHeader from './PreviewHeader';
import PreviewInstructions from './PreviewInstructions';
import PreviewPlayerList from './PreviewPlayerList';
import PreviewFeedbackForm from './PreviewFeedbackForm';
import PreviewNextSteps from './PreviewNextSteps';
import PreviewLoadingState from './PreviewLoadingState';
import PreviewFooter from './PreviewFooter';
import { notificationService } from '@/services/notificationService';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface MusicPreviewSystemProps {
  projectId?: string;
}

const MusicPreviewSystem: React.FC<MusicPreviewSystemProps> = ({ projectId: propProjectId }) => {
  const params = useParams<{ projectId: string }>();
  const projectId = propProjectId || params.projectId;
  const { toast } = useToast();
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Use the hook to fetch preview data
  const { projectData, setProjectData, isLoading } = usePreviewData(projectId);
  
  // Add protection to prevent audio downloads
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

  // Check if project exists once loading is complete
  useEffect(() => {
    if (!isLoading && !projectData) {
      setError("Prévias não encontradas ou expiradas. Este link pode não ser mais válido.");
    }
  }, [isLoading, projectData]);

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
    
    // Send notification for feedback received
    notificationService.notify('feedback_received', {
      projectId: projectId,
      clientName: projectData?.clientName || 'Cliente',
      message: feedback
    });
    
    // Update status locally for demonstration purposes
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
    
    // Send notification for approved preview
    notificationService.notify('preview_approved', {
      projectId: projectId,
      clientName: projectData?.clientName || 'Cliente',
      versionId: selectedVersion
    });
    
    // Update status locally
    setProjectData(prev => prev ? {...prev, status: 'approved' as const} : null);
  };
  
  if (isLoading) {
    return <PreviewLoadingState />;
  }

  if (error || !projectData) {
    return (
      <div className="max-w-4xl mx-auto pt-10 px-4">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {error || "Prévia não encontrada ou expirada. Este link pode não ser mais válido."}
          </AlertDescription>
        </Alert>
        
        <div className="text-center mt-8">
          <Button 
            onClick={() => navigate('/')}
            className="bg-harmonia-green hover:bg-harmonia-green/90"
          >
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto pt-10 px-4">
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
            versions={projectData.previews}
            selectedVersion={selectedVersion}
            setSelectedVersion={setSelectedVersion}
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
