
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
    console.log("Preview ID:", previewId);
    console.log("Actual Project ID:", actualProjectId);
    
    if (!isLoading && !projectData && actualProjectId) {
      console.log("Preview data not found");
      toast({
        title: "Preview not found",
        description: "The provided preview code is not valid or has expired.",
        variant: "destructive"
      });
    }
  }, [previewId, projectData, isLoading, toast, actualProjectId]);
  
  const handleSubmitFeedback = () => {
    if (!selectedPreview) {
      toast({
        title: "Select a version",
        description: "Please select one of the versions before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Feedback sent!",
      description: "Thank you for your feedback. Our team is working on the modifications.",
    });
    
    // Notify about feedback
    notificationService.notify('feedback_received', {
      projectId: actualProjectId || previewId,
      clientName: projectData?.clientName || 'Client',
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
        title: "Select a version",
        description: "Please select one of the versions before approving.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Music approved!",
      description: "We're happy you liked it! We'll finalize your music and deliver it soon.",
    });
    
    // Notify about approval
    notificationService.notify('preview_approved', {
      projectId: actualProjectId || previewId,
      clientName: projectData?.clientName || 'Client',
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
          title="Preview not found"
          description="The provided preview code is not valid or has expired." 
        />
      </MusicPreviewContainer>
    );
  }
  
  // Make sure versionsForPlayer is always an array
  const versionsForPlayer = Array.isArray(projectData?.versionsList) 
    ? projectData.versionsList 
    : (Array.isArray(projectData?.previews) ? projectData.previews : []);
  
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
