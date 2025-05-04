
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import MusicPreviewContainer from '@/components/previews/MusicPreviewContainer';
import PreviewLoader from '@/components/previews/PreviewLoader';
import PreviewError from '@/components/previews/PreviewError';
import PreviewContent from '@/components/previews/PreviewContent';
import { usePreviewData } from '@/hooks/usePreviewData';
import { notificationService } from '@/services/notificationService';

const MusicPreviews: React.FC = () => {
  const { previewId } = useParams<{ previewId: string }>();
  const { toast } = useToast();
  
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  
  // Direct use of previewId in usePreviewData - it will handle both encoded and direct IDs
  const { projectData, isLoading, actualProjectId, updateProjectStatus } = usePreviewData(previewId);
  
  useEffect(() => {
    console.log("Preview ID recebido:", previewId);
    console.log("ID de projeto real (após decodificação):", actualProjectId);
    console.log("Dados do projeto carregados:", projectData);
    
    if (!isLoading && !projectData && actualProjectId) {
      console.log("Dados da prévia não encontrados");
      toast({
        title: "Prévia não encontrada",
        description: "O código de prévia fornecido não é válido ou expirou.",
        variant: "destructive"
      });
    }
  }, [previewId, projectData, isLoading, toast, actualProjectId]);
  
  const handleSubmitFeedback = () => {
    if (!selectedPreview) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma das versões antes de enviar.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Feedback enviado!",
      description: "Obrigado pelo seu feedback. Nossa equipe está trabalhando nas modificações.",
    });
    
    // Notify about feedback
    notificationService.notify('feedback_received', {
      projectId: actualProjectId || previewId,
      clientName: projectData?.clientName || 'Cliente',
      message: feedback
    });
    
    if (updateProjectStatus) {
      // Use the type-safe value
      updateProjectStatus('feedback', feedback);
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
    
    toast({
      title: "Música aprovada!",
      description: "Ficamos felizes que você gostou! Finalizaremos sua música e entregaremos em breve.",
    });
    
    // Notify about approval
    notificationService.notify('preview_approved', {
      projectId: actualProjectId || previewId,
      clientName: projectData?.clientName || 'Cliente',
      versionId: selectedPreview
    });
    
    if (updateProjectStatus) {
      // Use the type-safe value
      updateProjectStatus('approved', feedback);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <MusicPreviewContainer>
        <PreviewLoader />
      </MusicPreviewContainer>
    );
  }
  
  // Project not found state
  if (!projectData) {
    return (
      <MusicPreviewContainer>
        <PreviewError 
          title="Prévia não encontrada"
          description="O código de prévia fornecido não é válido ou expirou." 
        />
      </MusicPreviewContainer>
    );
  }
  
  console.log("Renderizando com dados do projeto:", projectData);
  console.log("Listas de versões disponíveis:", projectData?.versionsList, projectData?.previews);
  
  // Make sure versionsForPlayer is always an array
  const versionsForPlayer = Array.isArray(projectData?.versionsList) 
    ? projectData.versionsList 
    : (Array.isArray(projectData?.previews) ? projectData.previews : []);
  
  console.log("Versões para o player:", versionsForPlayer);
  
  return (
    <MusicPreviewContainer>
      <PreviewContent
        projectData={projectData}
        selectedPreview={selectedPreview}
        setSelectedPreview={setSelectedPreview}
        feedback={feedback}
        setFeedback={setFeedback}
        handleSubmitFeedback={handleSubmitFeedback}
        handleApprove={handleApprove}
        versionsForPlayer={versionsForPlayer}
      />
    </MusicPreviewContainer>
  );
};

export default MusicPreviews;
