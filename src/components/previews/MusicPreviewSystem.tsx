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
import { Lock } from 'lucide-react';

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

  const packageType = formatPackageType(projectData.packageType || '');

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="inline-flex items-center bg-green-50 border border-green-100 rounded-md px-3 py-1.5">
          <Lock className="h-4 w-4 text-green-600 mr-1.5" />
          <span className="text-xs text-green-700 font-medium">
            Conteúdo protegido - Acesso restrito
          </span>
        </div>
      </div>
      
      <PreviewHeader 
        projectData={{
          projectTitle: projectData.projectTitle || 'Projeto sem nome',
          clientName: projectData.clientName || 'Cliente',
          status: projectData.status || 'pending',
          packageType: packageType,
          createdAt: projectData.createdAt || new Date().toISOString()
        }}
        onShareClick={() => setIsShareDialogOpen(true)}
      />
      
      {projectData.previews && projectData.previews.length > 0 && (
        <div className="mt-8">
          <PreviewPlayerList 
            versions={projectData.previews}
            selectedVersion={selectedVersion}
            setSelectedVersion={setSelectedVersion}
          />
        </div>
      )}
      
      {!feedbackSubmitted && (
        <div className="mt-8">
          <PreviewFeedbackForm 
            feedback={feedback}
            onFeedbackChange={setFeedback} 
            onSubmit={handleFeedbackSubmit}
            onApprove={handleApprove}
          />
        </div>
      )}
      
      <div className="mt-8">
        <PreviewProjectDetails projectData={projectData} />
      </div>
      
      {projectData.expiresAt && (
        <div className="mt-8">
          <PreviewCountdown expiresAt={projectData.expiresAt} />
        </div>
      )}
      
      <div className="mt-8">
        <PreviewInstructions status={projectData.status || 'waiting'} />
      </div>
      
      {feedbackSubmitted && (
        <div className="mt-8">
          <PreviewNextSteps status={projectData.status || 'pending'} />
        </div>
      )}
      
      <div className="mt-8 mb-12">
        <PreviewCopyright />
      </div>
      
      <SharePreviewDialog 
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        projectId={projectId}
        projectTitle={projectData.projectTitle || 'Projeto sem nome'}
      />
    </div>
  );
};

export default MusicPreviewSystem;
