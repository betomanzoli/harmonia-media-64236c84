
import React, { useState, useEffect } from 'react';
import { usePreviewProject } from '@/hooks/usePreviewProject';
import { Loader2, Calendar, Music, MessageSquare, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import PreviewPlayerList from '@/components/previews/PreviewPlayerList';
import PreviewProjectDetails from '@/components/previews/PreviewProjectDetails';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl?: string;
  url?: string;
  recommended?: boolean;
}

interface PreviewProject {
  projectTitle: string;
  clientName: string;
  status: string;
  packageType?: string;
  creationDate?: string;
  previews: MusicPreview[];
}

interface MusicPreviewSystemProps {
  projectId: string;
  userEmail?: string | null;
}

const MusicPreviewSystem: React.FC<MusicPreviewSystemProps> = ({ projectId, userEmail }) => {
  const { projectData, isLoading, updateProjectStatus } = usePreviewProject(projectId);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (projectData && projectData.previews && projectData.previews.length > 0) {
      const recommendedPreview = projectData.previews.find(p => p.recommended);
      
      if (recommendedPreview) {
        setSelectedVersion(recommendedPreview.id);
      } else {
        setSelectedVersion(projectData.previews[0].id);
      }
    }
    
    return () => {
      if (playingAudio) {
        playingAudio.pause();
        playingAudio.src = '';
      }
    };
  }, [projectData]);
  
  const handlePlay = (preview: MusicPreview) => {
    if (playingAudio) {
      playingAudio.pause();
      playingAudio.src = '';
    }
    
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
    } else if (preview.url) {
      window.open(preview.url, '_blank');
    }
  };
  
  const handleVersionSelect = (id: string) => {
    setSelectedVersion(id);
  };

  const saveFeedbackToSupabase = async (status: 'feedback' | 'approved', comments: string) => {
    try {
      const feedbackData = {
        project_id: projectId,
        user_email: userEmail || 'cliente@anonimo.com',
        status,
        comments: comments || 'Sem comentários adicionais',
        created_at: new Date().toISOString()
      };

      const { error: feedbackError } = await supabase
        .from('feedbacks')
        .insert(feedbackData);

      if (feedbackError) {
        console.error('Erro ao salvar feedback:', feedbackError);
      }

      const { error: projectError } = await supabase
        .from('projects')
        .update({ 
          status: status === 'approved' ? 'approved' : 'revision_required',
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (projectError) {
        console.warn('Projeto não encontrado na tabela projects, apenas feedback salvo:', projectError);
      }

      try {
        const { error: functionError } = await supabase.rpc('append_feedback', {
          project_id: projectId,
          new_entry: {
            email: userEmail,
            status,
            comments,
            version_id: selectedVersion,
            timestamp: new Date().toISOString(),
            approved: status === 'approved'
          }
        });

        if (functionError) {
          console.warn('Função append_feedback não disponível:', functionError);
        }
      } catch (rpcError) {
        console.warn('RPC não disponível:', rpcError);
      }

      return true;
    } catch (error) {
      console.error('Erro ao salvar no Supabase:', error);
      return false;
    }
  };
  
  const handleFeedbackSubmit = async () => {
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
    
    const supabaseSuccess = await saveFeedbackToSupabase('feedback', feedback);
    const localSuccess = updateProjectStatus('feedback', feedback);
    
    setTimeout(() => {
      setSubmitting(false);
      
      if (supabaseSuccess || localSuccess) {
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
    }, 1000);
  };
  
  const handleApproveVersion = async () => {
    if (!selectedVersion) {
      toast({
        title: 'Versão não selecionada',
        description: 'Por favor, selecione uma versão antes de aprovar.',
        variant: 'destructive'
      });
      return;
    }
    
    setSubmitting(true);
    
    const approvalComment = feedback || 'Cliente aprovou a versão sem comentários adicionais.';
    
    const supabaseSuccess = await saveFeedbackToSupabase('approved', approvalComment);
    const localSuccess = updateProjectStatus('approved', approvalComment);
    
    setTimeout(() => {
      setSubmitting(false);
      
      if (supabaseSuccess || localSuccess) {
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
    }, 1000);
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
  
  const selectedPreview = projectData.previews.find(p => p.id === selectedVersion);
  const isApproved = projectData.status === 'approved';
  
  return (
    <div className="container mx-auto max-w-5xl px-4">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-3">{projectData.projectTitle}</h1>
        <p className="text-gray-600">
          Olá {projectData.clientName}, avalie as versões do seu projeto e envie seu feedback.
        </p>
        {userEmail && (
          <p className="text-sm text-gray-500 mt-1">
            Logado como: {userEmail}
          </p>
        )}
      </div>

      {isApproved && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Projeto Aprovado!</AlertTitle>
          <AlertDescription className="text-green-700">
            Você já aprovou uma versão deste projeto. Nossa equipe finalizará a produção em breve.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="preview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Prévias Musicais</TabsTrigger>
          <TabsTrigger value="details">Detalhes do Projeto</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-6">
          <PreviewPlayerList
            previews={projectData.previews}
            selectedVersion={selectedVersion}
            onVersionSelect={handleVersionSelect}
            onPlay={handlePlay}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Seu Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPreview && (
                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Versão selecionada:</strong> {selectedPreview.title}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {selectedPreview.description}
                  </p>
                </div>
              )}

              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Compartilhe sua opinião sobre a versão selecionada..."
                className="min-h-[120px]"
                disabled={submitting}
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleApproveVersion}
                  disabled={!selectedVersion || submitting}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  {submitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Aprovar Versão
                </Button>

                <Button
                  onClick={handleFeedbackSubmit}
                  disabled={!selectedVersion || submitting || !feedback.trim()}
                  variant="outline"
                  className="flex-1"
                >
                  {submitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <MessageSquare className="mr-2 h-4 w-4" />
                  )}
                  Enviar Feedback
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Suas respostas são registradas automaticamente e nossa equipe será notificada.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <PreviewProjectDetails project={projectData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicPreviewSystem;
