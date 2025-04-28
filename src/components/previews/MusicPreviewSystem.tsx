
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import PreviewHeader from './PreviewHeader';
import PreviewInstructions from './PreviewInstructions';
import PreviewPlayerList from './player/PreviewPlayerList';
import PreviewFeedbackForm from './PreviewFeedbackForm';
import PreviewNextSteps from './PreviewNextSteps';
import { usePreviewData } from '@/hooks/use-preview-data';
import { notificationService } from '@/services/notificationService';

interface MusicPreviewSystemProps {
  projectId?: string | null;
}

const MusicPreviewSystem: React.FC<MusicPreviewSystemProps> = ({ projectId }) => {
  const { projectData, isLoading, actualProjectId, updateProjectStatus } = usePreviewData(projectId || undefined);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmitFeedback = () => {
    if (!selectedPreview) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma das versões antes de enviar.",
        variant: "destructive"
      });
      return;
    }
    
    if (!feedback.trim()) {
      toast({
        title: "Feedback vazio",
        description: "Por favor, escreva seu feedback antes de enviar.",
        variant: "destructive"
      });
      return;
    }
    
    // Update project status with feedback
    const updated = updateProjectStatus('feedback', feedback);
    
    if (updated) {
      // Notify
      notificationService.notify('feedback_received', {
        projectId: actualProjectId,
        clientName: projectData?.clientName || 'Cliente',
        message: feedback,
        versionId: selectedPreview
      });
      
      toast({
        title: "Feedback enviado!",
        description: "Obrigado pelo seu feedback. Nossa equipe já está trabalhando nas modificações.",
      });
    }
  };
  
  const handleApprove = () => {
    if (!selectedPreview) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma das versões antes de aprovar.",
        variant: "destructive"
      });
      return;
    }
    
    // Update project status, include feedback if provided
    const updated = updateProjectStatus('approved', feedback || "Cliente aprovou sem comentários adicionais.");
    
    if (updated) {
      // Notify
      notificationService.notify('preview_approved', {
        projectId: actualProjectId,
        clientName: projectData?.clientName || 'Cliente',
        versionId: selectedPreview
      });
      
      toast({
        title: "Música aprovada!",
        description: "Estamos felizes que você gostou! Vamos finalizar sua música e entregar em breve.",
      });
    }
  };

  // Set the first preview as selected on load
  useEffect(() => {
    if (projectData?.previews && projectData.previews.length > 0 && !selectedPreview) {
      setSelectedPreview(projectData.previews[0].id);
    }
  }, [projectData, selectedPreview]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-harmonia-green"></div>
          <p className="mt-4 text-gray-500">Carregando prévias...</p>
        </div>
      </div>
    );
  }
  
  if (!projectData) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Acesso Negado</AlertTitle>
              <AlertDescription>
                A prévia que você está tentando acessar não foi encontrada ou expirou.
                Por favor, entre em contato conosco se precisar de ajuda.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PreviewHeader 
        projectData={{
          projectTitle: projectData.projectTitle,
          clientName: projectData.clientName,
          status: projectData.status
        }}
      />
      
      <PreviewInstructions status={projectData.status} />
      
      <Tabs defaultValue="versions" className="mb-10">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="versions" className="flex-1 data-[state=active]:bg-harmonia-green">
            Versões Propostas
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex-1 data-[state=active]:bg-harmonia-green">
            Enviar Feedback
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="versions">
          <PreviewPlayerList 
            versions={projectData.previews.map(preview => ({
              ...preview,
              description: preview.description || `Versão musical para ${projectData.clientName}`
            }))}
            selectedVersion={selectedPreview}
            setSelectedVersion={setSelectedPreview}
            isApproved={projectData.status === 'approved'}
          />
        </TabsContent>
        
        <TabsContent value="feedback">
          <PreviewFeedbackForm 
            selectedPreview={selectedPreview}
            feedback={feedback}
            setFeedback={setFeedback}
            handleSubmit={handleSubmitFeedback}
            handleApprove={handleApprove}
            status={projectData.status}
            versionTitle={projectData.previews.find(p => p.id === selectedPreview)?.title}
          />
        </TabsContent>
      </Tabs>
      
      <PreviewNextSteps status={projectData.status} />
    </div>
  );
};

export default MusicPreviewSystem;
