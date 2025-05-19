
import React, { useState, useEffect } from 'react';
import { usePreviewData } from '@/hooks/usePreviewData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, CheckCircle, Music, Calendar, ArrowUpRight, Loader2 } from 'lucide-react';
import GoogleDriveAudioPlayer from './GoogleDriveAudioPlayer';
import { notificationService } from '@/services/notificationService';
import { formatDate } from '@/utils/dateUtils';
import webhookService from '@/services/webhookService';

interface MusicPreviewSystemProps {
  projectId: string;
}

const MusicPreviewSystem: React.FC<MusicPreviewSystemProps> = ({ projectId }) => {
  const { projectData, isLoading, updateProjectStatus } = usePreviewData(projectId);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (projectData && projectData.previews && projectData.previews.length > 0) {
      // Find a recommended preview or use the first one
      const recommendedPreview = projectData.previews.find(p => p.recommended);
      setSelectedPreview(recommendedPreview ? recommendedPreview.id : projectData.previews[0].id);
    }
  }, [projectData]);

  const handleSendFeedback = async () => {
    if (!selectedPreview || !feedback.trim()) {
      toast({
        title: "Informações incompletas",
        description: "Por favor, selecione uma versão e escreva seu feedback",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Find the selected preview's title
      const selectedPreviewTitle = projectData?.previews.find(p => p.id === selectedPreview)?.title || 'Versão não identificada';
      
      // Update project status with feedback
      const result = updateProjectStatus('feedback', feedback);
      
      if (result) {
        // Notify about feedback using notification service
        notificationService.notify('feedback_received', {
          projectId,
          previewId: selectedPreview,
          feedback,
          previewTitle: selectedPreviewTitle
        });
        
        // Also send webhook notification if configured
        await webhookService.sendItemNotification('feedback_received', {
          projectId,
          previewId: selectedPreview,
          feedback,
          previewTitle: selectedPreviewTitle,
          clientName: projectData?.clientName || 'Cliente'
        });
        
        toast({
          title: "Feedback enviado",
          description: "Agradecemos pelo seu feedback! Nossa equipe irá analisá-lo em breve.",
        });
        
        // Reset feedback text
        setFeedback('');
      } else {
        throw new Error("Não foi possível atualizar o status do projeto");
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast({
        title: "Erro ao enviar feedback",
        description: "Houve um problema ao enviar seu feedback. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprovePreview = async () => {
    if (!selectedPreview) {
      toast({
        title: "Nenhuma versão selecionada",
        description: "Por favor, selecione uma versão para aprovar",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Find the selected preview's title
      const selectedPreviewTitle = projectData?.previews.find(p => p.id === selectedPreview)?.title || 'Versão não identificada';
      
      // Update project status with approval
      const result = updateProjectStatus('approved', feedback || 'Versão aprovada pelo cliente');
      
      if (result) {
        // Notify about approval using notification service
        notificationService.notify('preview_approved', {
          projectId,
          previewId: selectedPreview,
          feedback: feedback || 'Versão aprovada pelo cliente',
          previewTitle: selectedPreviewTitle
        });
        
        // Also send webhook notification if configured
        await webhookService.sendItemNotification('preview_approved', {
          projectId,
          previewId: selectedPreview,
          feedback: feedback || 'Versão aprovada pelo cliente',
          previewTitle: selectedPreviewTitle,
          clientName: projectData?.clientName || 'Cliente'
        });
        
        toast({
          title: "Versão aprovada!",
          description: "Obrigado pela aprovação! Entraremos em contato para os próximos passos.",
        });
      } else {
        throw new Error("Não foi possível atualizar o status do projeto");
      }
    } catch (error) {
      console.error('Error approving preview:', error);
      toast({
        title: "Erro ao aprovar versão",
        description: "Houve um problema ao aprovar a versão. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Card className="bg-white border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
              <p className="mt-4 text-gray-500">Carregando prévia musical...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Card className="bg-white border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-8">
              <h2 className="text-2xl font-semibold text-gray-800">Prévia não encontrada</h2>
              <p className="mt-2 text-gray-500">Não foi possível encontrar a prévia solicitada.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine if the project has already been approved
  const isApproved = projectData.status === 'approved';

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{projectData.projectTitle}</h1>
        <p className="text-gray-600">
          Olá, {projectData.clientName}! Aqui você pode ouvir e avaliar as versões da sua música personalizada.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card className="bg-white border border-gray-200 h-full">
            <CardHeader className="bg-gray-50 border-b border-gray-100">
              <CardTitle>Versões Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 p-4">
                {projectData.previews.map((preview) => (
                  <div
                    key={preview.id}
                    className={`p-4 rounded-md cursor-pointer transition-all ${
                      selectedPreview === preview.id
                        ? 'bg-green-50 border border-green-200'
                        : 'hover:bg-gray-50 border border-gray-100'
                    }`}
                    onClick={() => setSelectedPreview(preview.id)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-800">
                        {preview.title}
                        {preview.recommended && (
                          <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                            Recomendada
                          </span>
                        )}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{preview.description}</p>
                    
                    <GoogleDriveAudioPlayer 
                      fileId={preview.fileId || ''} 
                      title={preview.title} 
                      isPreview={true}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-white border border-gray-200 mb-6">
            <CardHeader className="bg-gray-50 border-b border-gray-100">
              <CardTitle>Detalhes do Projeto</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <Music className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tipo de Pacote</p>
                    <p className="text-sm text-gray-600">{projectData.packageType || 'Música Personalizada'}</p>
                  </div>
                </div>
                
                {projectData.createdAt && (
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Data de Criação</p>
                      <p className="text-sm text-gray-600">{formatDate(projectData.createdAt)}</p>
                    </div>
                  </div>
                )}
                
                {projectData.expiresAt && (
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Disponível até</p>
                      <p className="text-sm text-gray-600">{formatDate(projectData.expiresAt)}</p>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-xs text-gray-500">
                    Para seu melhor proveito e avaliação, recomendamos que utilize fones de ouvido ou caixas de som de qualidade.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {!isApproved ? (
        <Card className="bg-white border border-gray-200 mb-10">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-gray-500" />
              Envie seu feedback
            </CardTitle>
            <CardDescription>
              Selecione uma versão acima e compartilhe sua opinião
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {selectedPreview ? (
                <div>
                  <p className="text-sm text-gray-700 mb-2">
                    Versão selecionada: <span className="font-medium">{
                      projectData.previews.find(p => p.id === selectedPreview)?.title || 'Versão não identificada'
                    }</span>
                  </p>
                  
                  <Textarea
                    placeholder="Conte para nós o que você achou desta versão. O que gostou e o que gostaria de mudar..."
                    className="min-h-[120px] mb-4"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={handleApprovePreview}
                      disabled={isSubmitting}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Aprovar versão
                    </Button>
                    
                    <Button
                      onClick={handleSendFeedback}
                      disabled={isSubmitting || !feedback.trim()}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Enviar feedback
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-amber-600 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Por favor, selecione uma versão acima para enviar seu feedback
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-green-50 border border-green-200 mb-10">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="font-medium text-green-800 text-lg">Versão aprovada!</h3>
                <p className="text-green-700">
                  Obrigado pela sua aprovação. Nossa equipe já está trabalhando na finalização da sua música.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MusicPreviewSystem;
