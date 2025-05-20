
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

interface MusicPreviewSystemProps {
  projectId: string;
}

const MusicPreviewSystem: React.FC<MusicPreviewSystemProps> = ({ projectId }) => {
  const { projectData, isLoading, updateProjectStatus } = usePreviewProject(projectId);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
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
  
  const handleFeedbackSubmit = () => {
    if (!selectedVersion) {
      toast({
        title: 'Versão não selecionada',
        description: 'Por favor, selecione uma versão antes de enviar seu feedback.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!feedback.trim()) {
      toast({
        title: 'Feedback vazio',
        description: 'Por favor, escreva seu feedback antes de enviar.',
        variant: 'destructive'
      });
      return;
    }
    
    setSubmitting(true);
    
    // Update project status
    const success = updateProjectStatus('feedback', feedback);
    
    setTimeout(() => {
      setSubmitting(false);
      
      if (success) {
        toast({
          title: 'Feedback enviado',
          description: 'Seu feedback foi enviado com sucesso.',
          variant: 'default'
        });
        setFeedback('');
      } else {
        toast({
          title: 'Erro ao enviar feedback',
          description: 'Não foi possível enviar seu feedback. Tente novamente mais tarde.',
          variant: 'destructive'
        });
      }
    }, 1000); // Simulating API call delay
  };
  
  const handleApproveVersion = () => {
    if (!selectedVersion) {
      toast({
        title: 'Versão não selecionada',
        description: 'Por favor, selecione uma versão antes de aprovar.',
        variant: 'destructive'
      });
      return;
    }
    
    setSubmitting(true);
    
    // Update project status
    const success = updateProjectStatus('approved', feedback || 'Cliente aprovou a versão sem comentários adicionais.');
    
    setTimeout(() => {
      setSubmitting(false);
      
      if (success) {
        toast({
          title: 'Versão aprovada',
          description: 'Sua aprovação foi registrada com sucesso.',
          variant: 'default'
        });
        setFeedback('');
      } else {
        toast({
          title: 'Erro ao aprovar versão',
          description: 'Não foi possível registrar sua aprovação. Tente novamente mais tarde.',
          variant: 'destructive'
        });
      }
    }, 1000); // Simulating API call delay
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-harmonia-green mb-6" />
          <p className="text-lg text-white">Carregando prévia do projeto...</p>
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
  
  const selectedPreview = projectData.previews.find(p => p.id === selectedVersion);
  const isApproved = projectData.status === 'approved';
  
  return (
    <div className="container mx-auto max-w-5xl px-4">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{projectData.projectTitle}</h1>
        <p className="text-gray-200">
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
            versions={projectData.previews}
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
              {isApproved ? (
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="text-green-700">
                    Obrigado pelo seu feedback! Seu projeto foi aprovado e estamos finalizando os detalhes.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedVersion 
                        ? `Versão selecionada: ${projectData.previews.find(p => p.id === selectedVersion)?.title || 'Versão selecionada'}` 
                        : 'Nenhuma versão selecionada. Por favor, escolha uma opção acima.'}
                    </p>
                    
                    <Textarea
                      placeholder="Conte-nos o que você achou da versão selecionada. O que você gostou? Há algo que você gostaria de mudar?"
                      className="min-h-[150px]"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      disabled={isApproved || submitting}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={handleApproveVersion}
                      disabled={isApproved || submitting || !selectedVersion}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprovar versão
                    </Button>
                    <Button
                      className="bg-harmonia-green hover:bg-harmonia-green/90"
                      onClick={handleFeedbackSubmit}
                      disabled={isApproved || submitting || !selectedVersion || !feedback.trim()}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Enviar feedback
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <PreviewProjectDetails 
            projectData={{
              projectTitle: projectData.projectTitle,
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
