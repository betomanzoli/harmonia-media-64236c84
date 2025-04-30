
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
        description: "Por favor, selecione uma das versões antes de aprovar.",
        variant: "destructive"
      });
      return;
    }
    
    updateProjectStatus('approved', comments);
    setFeedbackSubmitted(true);
    toast({
      title: "Prévia aprovada!",
      description: "Obrigado por aprovar a prévia! Finalizaremos sua música em breve.",
    });
  };

  const handlePlayVersion = (version: any) => {
    // Direct to Google Drive if fileId exists
    if (version.fileId) {
      const driveUrl = `https://drive.google.com/file/d/${version.fileId}/view`;
      window.open(driveUrl, '_blank');
      toast({
        title: "Reproduzindo prévia",
        description: `Reproduzindo ${version.title} no Google Drive`,
      });
      return;
    }
    
    // Otherwise try the audioUrl or url
    const audioUrl = version.audioUrl || version.url;
    if (audioUrl) {
      window.open(audioUrl, '_blank');
      toast({
        title: "Reproduzindo prévia",
        description: `Reproduzindo ${version.title} em nova aba`,
      });
    } else {
      toast({
        title: "Erro ao reproduzir",
        description: "Não foi possível reproduzir esta versão.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 bg-white rounded-lg shadow-sm my-8 p-6">
      <PreviewHeader 
        projectData={{
          projectTitle: formatPackageType(projectData.projectTitle),
          clientName: projectData.clientName,
          status: projectData.status
        }}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-8">
          <PreviewPlayerList 
            versions={projectData.previews}
            selectedVersion={selectedVersion}
            setSelectedVersion={setSelectedVersion}
            isApproved={projectData.status === 'approved'}
            onPlay={handlePlayVersion}
          />
          
          {!feedbackSubmitted && projectData.status !== 'approved' && (
            <PreviewFeedbackForm 
              selectedPreview={selectedVersion}
              feedback={feedback}
              setFeedback={setFeedback}
              handleSubmit={handleFeedbackSubmit}
              handleApprove={handleApprove}
              status={projectData.status}
              versionTitle={projectData.previews.find(p => p.id === selectedVersion)?.title}
            />
          )}

          {(feedbackSubmitted || projectData.status === 'approved') && (
            <PreviewNextSteps status={projectData.status} />
          )}
        </div>
        
        <div className="space-y-8">
          <PreviewProjectDetails 
            projectData={projectData}
          />
          <PreviewInstructions status={projectData.status} />
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
