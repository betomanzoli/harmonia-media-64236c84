
import React, { useState, useEffect } from 'react';
import PreviewHeader from './PreviewHeader';
import PreviewPlayerList from './player/PreviewPlayerList';
import PreviewFeedbackForm from './PreviewFeedbackForm';
import PreviewCopyright from './PreviewCopyright';
import PreviewInstructions from './PreviewInstructions';
import PreviewNextSteps from './PreviewNextSteps';
import SharePreviewDialog from './SharePreviewDialog';
import PreviewCountdown from './PreviewCountdown';
import PreviewLoadingState from './PreviewLoadingState';
import { usePreviewData } from '@/hooks/usePreviewData';
import PreviewProjectDetails from './PreviewProjectDetails';
import { useToast } from '@/hooks/use-toast';

interface MusicPreviewSystemProps {
  projectId: string;
}

// Define the MusicPreview interface to match what PreviewPlayerList expects
interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl?: string;
  recommended?: boolean;
  url?: string;
  fileId?: string;
  finalVersionUrl?: string;
  stemsUrl?: string;
}

// Define our own VersionItem interface to avoid conflicts
interface PreviewVersionItem {
  id: string;
  name: string;
  description?: string;
  audioUrl: string;
  recommended?: boolean;
  final?: boolean;
  createdAt?: string;
}

const MusicPreviewSystem: React.FC<MusicPreviewSystemProps> = ({ projectId }) => {
  const { projectData, isLoading, updateProjectStatus } = usePreviewData(projectId);
  const { toast } = useToast();
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // When project data loads, check if feedback was already submitted based on status
  useEffect(() => {
    if (projectData) {
      console.log("Project status:", projectData.status);
      // If project status is feedback or approved, mark feedback as submitted
      if (projectData.status === 'feedback' || projectData.status === 'approved') {
        setFeedbackSubmitted(true);
      } else {
        // Reset feedback submitted state if a new version was added after previous feedback
        setFeedbackSubmitted(false);
      }
    }
  }, [projectData]);

  if (isLoading) {
    return <PreviewLoadingState />;
  }

  if (!projectData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Prévia não encontrada</h2>
          <p className="text-gray-700">
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
    
    console.log("Submitting feedback for project:", projectId);
    console.log("Selected version:", selectedVersion);
    console.log("Feedback content:", comments);
    
    const success = updateProjectStatus('feedback', comments);
    
    if (success) {
      console.log("Successfully updated project status to 'feedback'");
      setFeedbackSubmitted(true);
      toast({
        title: "Feedback enviado",
        description: "Agradecemos pelo seu feedback! Nossa equipe irá analisá-lo em breve.",
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

  const handleApprove = (comments: string = feedback) => {
    if (!selectedVersion) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma versão antes de aprovar.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Approving project:", projectId);
    console.log("Selected version:", selectedVersion);
    console.log("Approval comments:", comments);
    
    const success = updateProjectStatus('approved', comments);
    
    if (success) {
      console.log("Successfully updated project status to 'approved'");
      setFeedbackSubmitted(true);
      toast({
        title: "Prévia aprovada",
        description: "Agradecemos pela aprovação! Nossa equipe irá finalizar seu projeto em breve.",
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

  // Ensures we have the necessary properties
  const projectTitle = projectData.projectTitle || "Projeto de Música Personalizada";
  const clientName = projectData.clientName || "Cliente";
  const status = projectData.status || "waiting";
  const packageType = formatPackageType(projectData.packageType);
  const createdAt = projectData.createdAt || new Date().toISOString();
  
  // Convert versionsList to MusicPreview format
  let versionsForPlayer: MusicPreview[] = [];
  
  if (Array.isArray(projectData.versionsList)) {
    versionsForPlayer = projectData.versionsList.map((v: PreviewVersionItem) => ({
      id: v.id,
      title: v.name || `Versão ${v.id}`,
      description: v.description || '',
      audioUrl: v.audioUrl || '',
      recommended: v.recommended || false
    }));
  } else if (Array.isArray(projectData.previews)) {
    versionsForPlayer = projectData.previews;
  }
  
  // If no versions available, add sample data for demonstration
  if (versionsForPlayer.length === 0) {
    versionsForPlayer = [
      {
        id: 'v1',
        title: 'Versão Acústica',
        description: 'Versão suave com violão e piano',
        audioUrl: 'https://drive.google.com/file/d/1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl/preview',
      },
      {
        id: 'v2',
        title: 'Versão Orquestral',
        description: 'Arranjo completo com cordas e metais',
        audioUrl: 'https://drive.google.com/file/d/11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a/preview',
      },
      {
        id: 'v3',
        title: 'Versão Minimalista',
        description: 'Abordagem simplificada com foco na melodia',
        audioUrl: 'https://drive.google.com/file/d/1fCsWubN8pXwM-mRlDtnQFTCkBbIkuUyW/preview',
      }
    ];
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <PreviewHeader 
        projectTitle={projectTitle}
        clientName={clientName}
        packageType={packageType}
        status={status as 'waiting' | 'feedback' | 'approved'}
        createdAt={createdAt}
        onShareClick={() => setIsShareDialogOpen(true)}
      />
      
      {versionsForPlayer.length > 0 ? (
        <div className="mt-8">
          <PreviewPlayerList 
            versions={versionsForPlayer}
            selectedVersion={selectedVersion}
            setSelectedVersion={setSelectedVersion}
            isApproved={status === 'approved'}
          />
        </div>
      ) : (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm text-center">
          <h3 className="text-xl font-medium text-gray-800 mb-2">Nenhuma versão disponível</h3>
          <p className="text-gray-600">
            No momento não há versões disponíveis para este projeto. Por favor, volte mais tarde.
          </p>
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
            status={status as 'waiting' | 'feedback' | 'approved'}
          />
        </div>
      )}
      
      {feedbackSubmitted && status === 'feedback' && (
        <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-xl font-medium text-blue-700 mb-2">Feedback Enviado</h3>
          <p className="text-blue-600">
            Seu feedback foi enviado com sucesso. Nossa equipe irá analisá-lo e retornar em breve.
          </p>
        </div>
      )}
      
      <div className="mt-8">
        <PreviewProjectDetails projectData={{
          projectTitle: projectTitle,
          clientName: clientName,
          status: status as 'waiting' | 'feedback' | 'approved',
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
        <PreviewInstructions status={status as 'waiting' | 'feedback' | 'approved'} />
      </div>
      
      {feedbackSubmitted && (
        <div className="mt-8">
          <PreviewNextSteps status={status as 'waiting' | 'feedback' | 'approved'} />
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
