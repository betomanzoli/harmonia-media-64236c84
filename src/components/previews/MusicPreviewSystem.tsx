
import React, { useState, useEffect } from 'react';
import { usePreviewProject } from '@/hooks/usePreviewProject';
import { Loader2, Calendar, Music, MessageSquare, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import PreviewPlayerList from '@/components/previews/player/PreviewPlayerList';
import PreviewProjectDetails from '@/components/previews/PreviewProjectDetails';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PreviewFeedbackForm from '@/components/previews/PreviewFeedbackForm';
import { supabase } from '@/lib/supabase';

interface MusicPreviewSystemProps {
  projectId: string;
  projectData?: any;
  token?: string | null;
}

const MusicPreviewSystem: React.FC<MusicPreviewSystemProps> = ({ projectId, projectData: initialProjectData, token }) => {
  const { projectData: hookProjectData, isLoading: hookLoading, updateProjectStatus } = usePreviewProject(projectId);
  const [projectData, setProjectData] = useState<any>(initialProjectData || null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Use either the directly passed project data (from token validation) or data from the hook
  useEffect(() => {
    if (initialProjectData) {
      setProjectData(initialProjectData);
      setIsLoading(false);
    } else if (hookProjectData) {
      setProjectData(hookProjectData);
      setIsLoading(hookLoading);
    } else {
      setIsLoading(hookLoading);
    }
  }, [initialProjectData, hookProjectData, hookLoading]);
  
  useEffect(() => {
    // If project data is loaded and there are previews, select the first one
    if (projectData && projectData.previews && projectData.previews.length > 0) {
      // Try to find recommended preview first
      const recommendedPreview = projectData.previews.find(p => p.recommended);
      
      if (recommendedPreview) {
        setSelectedVersion(recommendedPreview.id);
      } else {
        // Otherwise select the first one
        setSelectedVersion(projectData.previews[0].id);
      }
    }
    
    // Clean up any playing audio on dismount
    return () => {
      if (playingAudio) {
        playingAudio.pause();
        playingAudio.src = '';
      }
    };
  }, [projectData]);
  
  const handlePlay = (preview: any) => {
    // Stop any currently playing audio
    if (playingAudio) {
      playingAudio.pause();
      playingAudio.src = '';
    }
    
    // Create a new audio element and play it
    if (preview.audioUrl) {
      const audio = new Audio(preview.audioUrl);
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        toast({
          title: 'Erro ao reproduzir áudio',
          description: 'Não foi possível reproduzir o áudio. Tente abrir no Google Drive.',
          variant: 'destructive'
        });
      });
      
      setPlayingAudio(audio);
    } else if (preview.fileId) {
      // If there's a fileId but no audioUrl, redirect to Google Drive
      window.open(`https://drive.google.com/file/d/${preview.fileId}/view`, '_blank');
    }
  };
  
  const handleVersionSelect = (id: string) => {
    setSelectedVersion(id);
  };
  
  const handleFeedbackSubmit = async (feedbackText: string) => {
    if (!selectedVersion) {
      toast({
        title: 'Versão não selecionada',
        description: 'Por favor, selecione uma versão antes de enviar seu feedback.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!feedbackText.trim()) {
      toast({
        title: 'Feedback vazio',
        description: 'Por favor, escreva seu feedback antes de enviar.',
        variant: 'destructive'
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // If we have a token, use the edge function
      if (token) {
        const response = await fetch(`https://ivueqxyuflxsiecqvmgt.supabase.co/functions/v1/submit-preview-feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            preview_id: projectId,
            feedback: feedbackText,
            status: 'feedback',
            token: token,
            selected_version: selectedVersion
          })
        });

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || "Failed to submit feedback");
        }
        
        // Update local state
        setProjectData(prevData => ({
          ...prevData,
          status: 'feedback'
        }));
        
        toast({
          title: 'Feedback enviado',
          description: 'Seu feedback foi enviado com sucesso.',
          variant: 'default'
        });
      } else {
        // Use the regular update method
        const success = updateProjectStatus('feedback', feedbackText);
        
        if (success) {
          toast({
            title: 'Feedback enviado',
            description: 'Seu feedback foi enviado com sucesso.',
            variant: 'default'
          });
        } else {
          throw new Error("Failed to update project status");
        }
      }
      
      setFeedback('');
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Erro ao enviar feedback',
        description: error.message || 'Não foi possível enviar seu feedback. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleApproveVersion = async (feedbackText?: string) => {
    if (!selectedVersion) {
      toast({
        title: 'Versão não selecionada',
        description: 'Por favor, selecione uma versão antes de aprovar.',
        variant: 'destructive'
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // If we have a token, use the edge function
      if (token) {
        const response = await fetch(`https://ivueqxyuflxsiecqvmgt.supabase.co/functions/v1/submit-preview-feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            preview_id: projectId,
            feedback: feedbackText || 'Cliente aprovou a versão sem comentários adicionais.',
            status: 'approved',
            token: token,
            selected_version: selectedVersion
          })
        });

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || "Failed to approve version");
        }
        
        // Update local state
        setProjectData(prevData => ({
          ...prevData,
          status: 'approved'
        }));
        
        toast({
          title: 'Versão aprovada',
          description: 'Sua aprovação foi registrada com sucesso.',
          variant: 'default'
        });
      } else {
        // Use the regular update method
        const success = updateProjectStatus('approved', feedbackText || 'Cliente aprovou a versão sem comentários adicionais.');
        
        if (success) {
          toast({
            title: 'Versão aprovada',
            description: 'Sua aprovação foi registrada com sucesso.',
            variant: 'default'
          });
        } else {
          throw new Error("Failed to update project status");
        }
      }
      
      setFeedback('');
    } catch (error: any) {
      console.error('Error approving version:', error);
      toast({
        title: 'Erro ao aprovar versão',
        description: error.message || 'Não foi possível registrar sua aprovação. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-harmonia-green mb-6" />
          <p className="text-lg">Carregando prévia do projeto...</p>
        </div>
      </div>
    );
  }
  
  if (!projectData) {
    return (
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-lg text-center">
            <h2 className="text-2xl font-bold text-black mb-4">Prévia não encontrada</h2>
            <p className="text-black mb-6">Esta prévia não existe ou expirou. Por favor, verifique o link ou entre em contato conosco.</p>
          </div>
        </div>
      </div>
    );
  }
  
  const selectedPreview = projectData.previews && projectData.previews.find(p => p.id === selectedVersion);
  const isApproved = projectData.status === 'approved';
  
  return (
    <div className="container mx-auto max-w-5xl px-4">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-3">{projectData.projectTitle || projectData.title}</h1>
        <p className="text-gray-600">
          Olá {projectData.clientName}, avalie as versões do seu projeto e envie seu feedback.
        </p>
      </div>
      
      {isApproved && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800">Projeto aprovado</AlertTitle>
          <AlertDescription className="text-green-700">
            Você já aprovou este projeto. Em breve enviaremos os arquivos finais.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <PreviewPlayerList
            versions={projectData.previews || []}
            selectedVersion={selectedVersion}
            setSelectedVersion={handleVersionSelect}
            isApproved={isApproved}
            onPlay={handlePlay}
          />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-harmonia-green" />
                {isApproved ? 'Feedback enviado' : 'Envie seu feedback'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PreviewFeedbackForm
                feedback={feedback}
                onFeedbackChange={setFeedback}
                onSubmit={handleFeedbackSubmit}
                onApprove={handleApproveVersion}
                status={projectData.status}
                selectedVersion={selectedVersion}
                versionTitle={selectedPreview?.title}
                projectId={projectId}
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <PreviewProjectDetails 
            projectData={{
              projectTitle: projectData.projectTitle || projectData.title,
              clientName: projectData.clientName,
              status: projectData.status,
              packageType: projectData.packageType,
              creationDate: projectData.createdAt ? new Date(projectData.createdAt).toLocaleDateString('pt-BR') : undefined
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPreviewSystem;
