
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import MusicPreviewContainer from '@/components/previews/MusicPreviewContainer';
import PreviewLoader from '@/components/previews/PreviewLoader';
import PreviewError from '@/components/previews/PreviewError';
import PreviewContent from '@/components/previews/PreviewContent';
import { usePreviewData } from '@/hooks/usePreviewData';
import { notificationService } from '@/services/notificationService';
import { ProjectItem, MusicPreview } from '@/types/project.types';

const MusicPreviews: React.FC = () => {
  const { previewId } = useParams<{ previewId: string }>();
  const { toast } = useToast();
  
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  
  // Direct use of previewId in usePreviewData - it will handle both encoded and direct IDs
  const { projectData, isLoading, actualProjectId, updateProjectStatus } = usePreviewData(previewId);
  
  useEffect(() => {
    console.log("Preview ID received:", previewId);
    console.log("Actual project ID (after decoding):", actualProjectId);
    console.log("Project data loaded:", projectData);
    
    if (!isLoading && !projectData && actualProjectId) {
      console.log("Preview data not found");
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
    
    // Make sure to log what we're doing
    console.log("Submitting feedback for project:", actualProjectId);
    console.log("Selected preview:", selectedPreview);
    console.log("Feedback content:", feedback);
    
    // Update project status - ensure this saves to localStorage
    const success = updateProjectStatus('feedback', feedback);
    
    if (success) {
      console.log("Successfully updated project status to 'feedback'");
      
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
    } else {
      console.error("Failed to update project status");
      
      toast({
        title: "Erro ao enviar feedback",
        description: "Houve um problema ao salvar seu feedback. Por favor, tente novamente.",
        variant: "destructive"
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
    
    // Make sure to log what we're doing
    console.log("Approving project:", actualProjectId);
    console.log("Selected preview:", selectedPreview);
    console.log("Approval comments:", feedback);
    
    // Update project status - ensure this saves to localStorage
    const success = updateProjectStatus('approved', feedback);
    
    if (success) {
      console.log("Successfully updated project status to 'approved'");
      
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
    } else {
      console.error("Failed to update project status");
      
      toast({
        title: "Erro ao aprovar prévia",
        description: "Houve um problema ao processar sua aprovação. Por favor, tente novamente.",
        variant: "destructive"
      });
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
  
  console.log("Rendering with project data:", projectData);
  console.log("Available version lists:", projectData?.versionsList, projectData?.previews);
  
  // Make sure versionsForPlayer is always an array of MusicPreview
  const versionsForPlayer: MusicPreview[] = Array.isArray(projectData?.previews) 
    ? projectData.previews
    : (Array.isArray(projectData?.versionsList) 
        ? projectData.versionsList.map(v => ({
            id: v.id,
            title: v.name || `Versão ${v.id}`,
            description: v.description || '',
            audioUrl: v.audioUrl,
            recommended: v.recommended,
            name: v.name || `Versão ${v.id}`,
            createdAt: v.createdAt || new Date().toISOString()
          }))
        : []);
  
  console.log("Versions for player:", versionsForPlayer);

  // Create a complete ProjectItem with required fields
  const projectItemData: ProjectItem = {
    id: projectData.id || actualProjectId || 'unknown',
    clientName: projectData.clientName || 'Cliente',
    projectTitle: projectData.projectTitle || 'Música Personalizada',
    packageType: projectData.packageType || 'standard',
    status: projectData.status || 'waiting',
    createdAt: projectData.createdAt || new Date().toISOString(),
    lastActivityDate: projectData.lastActivityDate || new Date().toISOString(),
    expirationDate: projectData.expirationDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    versions: projectData.versions || 0,
    versionsList: projectData.versionsList || [],
    feedbackHistory: projectData.feedbackHistory || [],
    history: projectData.history || [],
  };
  
  return (
    <MusicPreviewContainer>
      <PreviewContent
        projectData={projectItemData}
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
