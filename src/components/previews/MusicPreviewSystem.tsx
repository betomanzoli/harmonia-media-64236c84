
import React, { useState } from 'react';
import PreviewHeader from './PreviewHeader';
import PreviewPlayerList from './player/PreviewPlayerList';
import PreviewFeedbackForm from './PreviewFeedbackForm';
import PreviewCopyright from './PreviewCopyright';
import PreviewInstructions from './PreviewInstructions';
import PreviewNextSteps from './PreviewNextSteps';
import SharePreviewDialog from './SharePreviewDialog';
import PreviewCountdown from './PreviewCountdown';
import PreviewLoadingState from './PreviewLoadingState';
import { usePreviewProject } from '@/hooks/usePreviewProject';
import PreviewProjectDetails from './PreviewProjectDetails';
import { useToast } from '@/hooks/use-toast';

interface MusicPreviewSystemProps {
  projectId: string;
}

const MusicPreviewSystem: React.FC<MusicPreviewSystemProps> = ({ projectId }) => {
  const { projectData, isLoading, updateProjectStatus } = usePreviewProject(projectId);
  const { toast } = useToast();
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  if (isLoading) {
    return <PreviewLoadingState />;
  }

  if (!projectData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Prévia não encontrada</h2>
          <p className="text-black">
            A prévia que você está tentando acessar não existe ou expirou.
          </p>
        </div>
      </div>
    );
  }

  // Format package type with capitalized first letter
  const formatPackageType = (packageType: string | undefined): string => {
    if (!packageType) return "Projeto de Música Personalizada";
    
    // Split by spaces and capitalize first letter of each word
    return packageType
      .split(' ')
      .map(word => {
        if (word.toLowerCase() === 'essencial' || 
            word.toLowerCase() === 'premium' || 
            word.toLowerCase() === 'profissional') {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word;
      })
      .join(' ');
  };

  const handleFeedbackSubmit = (comments: string = feedback) => {
    if (!selectedVersion) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma das versões antes de enviar feedback.",
        variant: "destructive"
      });
      return;
    }
    
    updateProjectStatus('feedback', comments);
    setFeedbackSubmitted(true);
    toast({
      title: "Feedback enviado",
      description: "Agradecemos pelo seu feedback! Nossa equipe irá analisá-lo em breve.",
    });
  };

  const handleApprove = (comments: string = feedback) => {
    if (!selectedVersion) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma versão antes de aprovar.",
        variant: "destructive"
      });
      return;
    }
    
    updateProjectStatus('approved', comments);
    setFeedbackSubmitted(true);
    toast({
      title: "Prévia aprovada",
      description: "Agradecemos pela aprovação! Nossa equipe irá finalizar seu projeto em breve.",
    });
  };

  // Ensures we have the necessary properties
  const projectTitle = projectData.projectTitle || "Projeto de Música Personalizada";
  const clientName = projectData.clientName || "Cliente";
  const status = projectData.status || "waiting";
  const packageType = formatPackageType(projectData.packageType);
  const createdAt = projectData.createdAt || new Date().toISOString();
  const versions = projectData.versions || [];

  return (
    <div className="max-w-4xl mx-auto px-4">
      <PreviewHeader 
        projectTitle={projectTitle}
        clientName={clientName}
        packageType={packageType}
        status={status}
        createdAt={createdAt}
        onShareClick={() => setIsShareDialogOpen(true)}
      />
      
      {versions.length > 0 && (
        <div className="mt-8">
          <PreviewPlayerList 
            versions={versions}
            selectedVersion={selectedVersion}
            setSelectedVersion={setSelectedVersion}
            isApproved={status === 'approved'}
          />
        </div>
      )}
      
      {!feedbackSubmitted && (
        <div className="mt-8">
          <PreviewFeedbackForm 
            feedback={feedback}
            setFeedback={setFeedback}
            handleSubmit={handleFeedbackSubmit}
            handleApprove={handleApprove}
            selectedPreview={selectedVersion}
            status={status}
          />
        </div>
      )}
      
      <div className="mt-8">
        <PreviewProjectDetails projectData={{
          projectTitle: projectTitle,
          clientName: clientName,
          status: status,
          packageType: projectData.packageType,
          creationDate: createdAt
        }} />
      </div>
      
      {projectData.expirationDate && (
        <div className="mt-8">
          <PreviewCountdown expirationDate={projectData.expirationDate} />
        </div>
      )}
      
      <div className="mt-8">
        <PreviewInstructions status={status} />
      </div>
      
      {feedbackSubmitted && (
        <div className="mt-8">
          <PreviewNextSteps status={status} />
        </div>
      )}
      
      <div className="mt-8 mb-12">
        <PreviewCopyright />
      </div>
      
      <SharePreviewDialog 
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        projectId={projectId}
        projectTitle={projectTitle}
      />
    </div>
  );
};

export default MusicPreviewSystem;
