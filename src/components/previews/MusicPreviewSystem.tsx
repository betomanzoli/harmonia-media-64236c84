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
import { MusicPreview, VersionItem } from '@/types/project.types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Local version of VersionItem with all needed properties
interface LocalVersionItem {
  id: string;
  title?: string; 
  name?: string;
  description?: string;
  audioUrl?: string;
  audio_url?: string;
  file_url?: string;
  recommended?: boolean;
  finalVersionUrl?: string;
  stemsUrl?: string;
  fileId?: string;
  createdAt?: string;
  created_at?: string;
  url?: string;
}

interface MusicPreviewSystemProps {
  projectId: string;
}

const MusicPreviewSystem: React.FC<MusicPreviewSystemProps> = ({ projectId }) => {
  const { projectData, isLoading, isError, errorMessage, updateProjectStatus } = usePreviewData(projectId);
  const { toast } = useToast();
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Logging project details for debugging
  useEffect(() => {
    console.log("🔍 MusicPreviewSystem - Project ID:", projectId);
    console.log("🔍 MusicPreviewSystem - Project data loaded:", projectData);
    console.log("🔍 MusicPreviewSystem - Loading state:", isLoading);
    console.log("🔍 MusicPreviewSystem - Error state:", isError, errorMessage);

    if (projectData) {
      console.log("🔍 Project status:", projectData.status);
      console.log("🔍 Project versions:", projectData.versionsList || []);
      console.log("🔍 Project previews:", projectData.previews || []);
      
      // If project status is feedback or approved, mark feedback as submitted
      if (projectData.status === 'feedback' || projectData.status === 'approved') {
        setFeedbackSubmitted(true);
      } else {
        // Reset feedback submitted state if a new version was added after previous feedback
        setFeedbackSubmitted(false);
      }
    }
  }, [projectData, isLoading, isError, projectId, errorMessage]);

  if (isLoading) {
    return <PreviewLoadingState />;
  }

  if (isError || !projectData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Prévia não encontrada</h2>
          <p className="text-gray-700">
            {errorMessage || "A prévia que você está tentando acessar não existe ou expirou."}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Código do projeto: {projectId || 'não informado'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Dúvidas? Entre em contato pelo WhatsApp (11) 92058-5072
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
  
  // Convert versionsList to MusicPreview format ensuring title and description fields exist
  let versionsForPlayer: MusicPreview[] = [];
  
  console.log("🎵 Processando versões para o player:", {
    previews: projectData.previews,
    versionsList: projectData.versionsList
  });
  
  if (Array.isArray(projectData.previews) && projectData.previews.length > 0) {
    // If previews are already in MusicPreview format, use them directly
    versionsForPlayer = projectData.previews.map((preview) => ({
      ...preview,
      // Ensure all required fields exist
      title: preview.title || preview.name || `Versão ${preview.id}`,
      name: preview.name || preview.title || `Versão ${preview.id}`,
      description: preview.description || 'Sem descrição',
      audioUrl: preview.audioUrl || preview.audio_url || preview.file_url || '',
      fileId: preview.fileId || undefined,
      finalVersionUrl: preview.finalVersionUrl || undefined,
      stemsUrl: preview.stemsUrl || undefined
    })) as MusicPreview[];
    console.log("🎵 Versões obtidas de 'previews':", versionsForPlayer);
  } else if (Array.isArray(projectData.versionsList) && projectData.versionsList.length > 0) {
    // Convert versionsList to MusicPreview format
    versionsForPlayer = projectData.versionsList.map((v) => ({
      id: v.id,
      title: v.title || v.name || `Versão ${v.id}`, 
      name: v.name || v.title || `Versão ${v.id}`,
      description: v.description || 'Sem descrição',
      audioUrl: v.audioUrl || v.audio_url || v.file_url || '',
      fileId: v.fileId || undefined,
      recommended: v.recommended || false,
      finalVersionUrl: v.finalVersionUrl || '',
      stemsUrl: v.stemsUrl || '',
      createdAt: v.createdAt || v.created_at || new Date().toISOString()
    })) as MusicPreview[];
    console.log("🎵 Versões obtidas de 'versionsList':", versionsForPlayer);
  } else {
    console.log("🎵 Nenhuma versão encontrada no objeto projectData");
  }
  
  // If no versions available, add sample data for demonstration - only in development mode
  if (versionsForPlayer.length === 0) {
    console.log("⚠️ Nenhuma versão encontrada para o projeto, usando dados de exemplo");
    
    // Add message for admin/debug view
    const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' ||
                          window.location.search.includes('debug=true');
                          
    if (isDevelopment) {
      console.log("🔧 Ambiente de desenvolvimento detectado, adicionando versões de exemplo");
      versionsForPlayer = [
        {
          id: 'v1',
          title: 'Versão Acústica (EXEMPLO)',
          description: 'Versão suave com violão e piano',
          audioUrl: 'https://drive.google.com/file/d/1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl/preview',
          name: 'Versão Acústica (EXEMPLO)',
          createdAt: new Date().toISOString()
        },
        {
          id: 'v2',
          title: 'Versão Orquestral (EXEMPLO)',
          description: 'Arranjo completo com cordas e metais',
          audioUrl: 'https://drive.google.com/file/d/11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a/preview',
          name: 'Versão Orquestral (EXEMPLO)',
          createdAt: new Date().toISOString()
        }
      ] as MusicPreview[];
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {projectData.id === 'fallback-project' && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Aviso</AlertTitle>
          <AlertDescription>
            Esta é uma visualização de demonstração. Não foi possível encontrar este projeto no sistema.
          </AlertDescription>
        </Alert>
      )}
      
      {!versionsForPlayer.length && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Aviso</AlertTitle>
          <AlertDescription>
            Este projeto não possui versões disponíveis ainda. Estamos trabalhando nisso!
          </AlertDescription>
        </Alert>
      )}

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
            No momento não há versões disponíveis para este projeto. Nossa equipe está trabalhando na 
            composição e em breve as primeiras versões serão disponibilizadas. Por favor, volte mais tarde.
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
