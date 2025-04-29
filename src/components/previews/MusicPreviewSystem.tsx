
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
import { usePreviewData } from '@/hooks/use-preview-data';
import PreviewProjectDetails from './PreviewProjectDetails';
import { useToast } from '@/hooks/use-toast';

interface MusicPreviewSystemProps {
  projectId: string;
}

const MusicPreviewSystem: React.FC<MusicPreviewSystemProps> = ({ projectId }) => {
  const { projectData, isLoading, updateProjectStatus } = usePreviewData(projectId);
  const { toast } = useToast();
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  if (isLoading) {
    return <PreviewLoadingState />;
  }

  if (!projectData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Prévia não encontrada</h2>
          <p className="text-gray-600">
            A prévia que você está tentando acessar não existe ou expirou.
          </p>
        </div>
      </div>
    );
  }

  // Format package type with capitalized first letter
  const formatPackageType = (packageType: string): string => {
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

  const handleFeedbackSubmit = (sentiment: 'positive' | 'neutral' | 'negative', comments: string) => {
    const success = updateProjectStatus(
      sentiment === 'positive' ? 'approved' : 'feedback',
      comments
    );
    
    if (success) {
      setFeedbackSubmitted(true);
      toast({
        title: "Feedback enviado",
        description: "Agradecemos pelo seu feedback! Nossa equipe irá analisá-lo em breve.",
      });
    } else {
      toast({
        title: "Erro ao enviar feedback",
        description: "Houve um problema ao enviar seu feedback. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <PreviewHeader 
        clientName={projectData.clientName}
        projectTitle={formatPackageType(projectData.projectTitle)}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-8">
          <PreviewPlayerList 
            previews={projectData.previews}
          />
          
          {!feedbackSubmitted && projectData.status !== 'approved' && (
            <PreviewFeedbackForm onSubmit={handleFeedbackSubmit} />
          )}

          {(feedbackSubmitted || projectData.status === 'approved') && (
            <PreviewNextSteps />
          )}
        </div>
        
        <div className="space-y-8">
          <PreviewProjectDetails 
            clientName={projectData.clientName}
            projectTitle={formatPackageType(projectData.projectTitle)}
            packageType={formatPackageType(projectData.packageType || "")}
            creationDate={projectData.creationDate}
          />
          <PreviewInstructions />
          <PreviewCountdown 
            days={14}
            action="para avaliação"
          />
          <SharePreviewDialog />
          <PreviewCopyright />
        </div>
      </div>
    </div>
  );
};

export default MusicPreviewSystem;
