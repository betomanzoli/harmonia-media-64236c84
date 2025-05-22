
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PreviewHeader from './PreviewHeader';
import MusicPlayer from './MusicPlayer';
import PreviewFeedbackForm from './PreviewFeedbackForm';
import ProjectAccessForm from './ProjectAccessForm';
import { usePreviewProject } from '@/hooks/usePreviewProject';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface MusicPreviewSystemProps {
  projectId: string;
  onFeedbackSubmitted?: (status: 'feedback' | 'approved', comments: string) => void;
}

const MusicPreviewSystem: React.FC<MusicPreviewSystemProps> = ({ 
  projectId,
  onFeedbackSubmitted 
}) => {
  const { projectData, isLoading, updateProjectStatus, accessTokenValid } = usePreviewProject(projectId);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(accessTokenValid);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check if user has access to this preview
  useEffect(() => {
    if (!accessTokenValid && !isLoading) {
      navigate(`/auth/preview/${projectId}`);
    }
  }, [accessTokenValid, isLoading, projectId, navigate]);
  
  // Select the recommended version by default
  useEffect(() => {
    if (projectData?.previews && projectData.previews.length > 0) {
      const recommended = projectData.previews.find(p => p.recommended);
      if (recommended) {
        setSelectedVersion(recommended.id);
      } else {
        setSelectedVersion(projectData.previews[0].id);
      }
    }
  }, [projectData]);
  
  const handleVerify = (email: string, accessCode: string) => {
    // This function is called when verification is successful
    setIsAuthorized(true);
    toast({
      title: 'Acesso autorizado',
      description: 'Você agora pode visualizar a prévia da música.',
    });
  };
  
  const handleSubmitFeedback = (comments?: string) => {
    if (!selectedVersion || !comments?.trim()) {
      toast({
        title: 'Informações incompletas',
        description: 'Por favor, selecione uma versão e forneça seus comentários.',
        variant: 'destructive',
      });
      return;
    }
    
    const success = updateProjectStatus('feedback', comments);
    
    if (success) {
      // Notify parent component about feedback (for syncing with admin panel)
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted('feedback', comments);
      }
      
      toast({
        title: 'Feedback enviado',
        description: 'Obrigado pelo seu feedback! Nossa equipe será notificada.',
      });
      
      // Clear feedback after submission
      setFeedback('');
      
      // Redirect to confirmation page
      navigate('/feedback-confirmacao');
    } else {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar seu feedback. Por favor, tente novamente.',
        variant: 'destructive',
      });
    }
  };
  
  const handleApprove = (comments?: string) => {
    if (!selectedVersion) {
      toast({
        title: 'Nenhuma versão selecionada',
        description: 'Por favor, selecione uma versão para aprovar.',
        variant: 'destructive',
      });
      return;
    }
    
    const commentText = comments || 'Aprovado sem comentários adicionais';
    const success = updateProjectStatus('approved', commentText);
    
    if (success) {
      // Notify parent component about approval (for syncing with admin panel)
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted('approved', commentText);
      }
      
      toast({
        title: 'Versão aprovada!',
        description: 'Obrigado pela aprovação! Nossa equipe será notificada.',
      });
      
      // Clear feedback after approval
      setFeedback('');
      
      // Redirect to confirmation page, but with a flag for approval
      navigate('/feedback-confirmacao?type=approved');
    } else {
      toast({
        title: 'Erro',
        description: 'Não foi possível registrar sua aprovação. Por favor, tente novamente.',
        variant: 'destructive',
      });
    }
  };
  
  // If loading
  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-harmonia-green mb-4" />
          <h2 className="text-xl font-medium text-gray-700">Carregando prévia...</h2>
        </div>
      </div>
    );
  }
  
  // If not authorized or access token is invalid
  if (!isAuthorized || !accessTokenValid) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-center">
          <ProjectAccessForm projectId={projectId} onVerify={handleVerify} />
        </div>
      </div>
    );
  }
  
  // If no project data
  if (!projectData) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="rounded-full bg-amber-100 p-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-amber-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">Prévia não encontrada</h2>
          <p className="text-gray-600 text-center">
            Não foi possível carregar esta prévia. O código fornecido pode ser inválido ou expirado.
          </p>
        </div>
      </div>
    );
  }
  
  // If there are no previews
  if (projectData.previews.length === 0) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <PreviewHeader 
          clientName={projectData.clientName}
          projectTitle={projectData.projectTitle}
        />
        
        <div className="flex flex-col items-center justify-center min-h-[40vh] mt-8">
          <div className="rounded-full bg-blue-100 p-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">Prévias em produção</h2>
          <p className="text-gray-600 text-center">
            As versões da sua música estão em produção. Você receberá uma notificação quando estiverem prontas para avaliação.
          </p>
        </div>
      </div>
    );
  }
  
  // Get the currently selected version
  const currentPreview = selectedVersion 
    ? projectData.previews.find(p => p.id === selectedVersion) 
    : null;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <PreviewHeader 
        clientName={projectData.clientName}
        projectTitle={projectData.projectTitle}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2">
          <MusicPlayer 
            previews={projectData.previews}
            selectedVersion={selectedVersion}
            onVersionSelect={setSelectedVersion}
          />
        </div>
        
        <div>
          <PreviewFeedbackForm
            feedback={feedback}
            onFeedbackChange={setFeedback}
            onSubmit={handleSubmitFeedback}
            onApprove={handleApprove}
            status={projectData.status}
            selectedVersion={selectedVersion}
            versionTitle={currentPreview?.title}
            projectId={projectId}
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPreviewSystem;
