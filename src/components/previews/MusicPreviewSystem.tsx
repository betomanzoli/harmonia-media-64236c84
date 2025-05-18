
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Lock, MessageSquare, Music, Info, CheckCircle, Star } from 'lucide-react';
import { usePreviewData } from '@/hooks/usePreviewData';
import PreviewProjectDetails from './PreviewProjectDetails';
import GoogleDriveAudioPlayer from './GoogleDriveAudioPlayer';
import { checkPreviewAccessCookie } from '@/utils/authCookies';
import { supabase } from '@/lib/supabase';

interface MusicPreviewSystemProps {
  projectId: string;
}

const MusicPreviewSystem: React.FC<MusicPreviewSystemProps> = ({ projectId }) => {
  const { projectData, isLoading, updateProjectStatus } = usePreviewData(projectId);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if access is authorized by cookie or user session
    const checkAuthorization = async () => {
      const cookieAuthorized = checkPreviewAccessCookie(projectId);
      
      if (cookieAuthorized) {
        return;
      }

      // Check if authenticated with Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Redirect to auth page if no authorization found
        navigate(`/auth/preview/${projectId}`);
      }
    };
    
    checkAuthorization();
    
    // Set default selected version
    if (projectData?.previews && projectData.previews.length > 0) {
      const recommendedPreview = projectData.previews.find(p => p.recommended);
      setSelectedVersion(recommendedPreview ? recommendedPreview.id : projectData.previews[0].id);
    }
  }, [projectId, projectData, navigate]);

  const handleSubmitFeedback = () => {
    if (!selectedVersion) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma versão da música para enviar feedback.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const success = updateProjectStatus('feedback', feedback);
    
    setTimeout(() => {
      setIsSubmitting(false);
      if (success) {
        toast({
          title: "Feedback enviado",
          description: "Seu feedback foi enviado com sucesso. Obrigado!",
        });
        setFeedback('');
      } else {
        toast({
          title: "Erro ao enviar feedback",
          description: "Ocorreu um erro ao enviar seu feedback. Por favor, tente novamente.",
          variant: "destructive"
        });
      }
    }, 1000);
  };
  
  const handleApproveVersion = () => {
    if (!selectedVersion) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma versão da música para aprovar.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const success = updateProjectStatus('approved', feedback);
    
    setTimeout(() => {
      setIsSubmitting(false);
      if (success) {
        toast({
          title: "Versão aprovada!",
          description: "Esta versão foi aprovada. Agora estamos finalizando seu projeto.",
        });
      } else {
        toast({
          title: "Erro ao aprovar versão",
          description: "Ocorreu um erro ao aprovar esta versão. Por favor, tente novamente.",
          variant: "destructive"
        });
      }
    }, 1000);
  };
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-harmonia-green border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Carregando sua prévia musical...</p>
        </div>
      </div>
    );
  }
  
  if (!projectData) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Prévia não encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              A prévia que você está procurando não existe ou expirou.
              Por favor, verifique o link e tente novamente.
            </p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/client-dashboard')}
            >
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const currentVersion = selectedVersion 
    ? projectData.previews.find(p => p.id === selectedVersion) 
    : null;
    
  const isApproved = projectData.status === 'approved';
  
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {projectData.projectTitle}
        </h1>
        <div className="flex items-center text-sm text-gray-500">
          <Info className="h-4 w-4 mr-1" />
          <span>
            {isApproved
              ? "Este projeto foi aprovado e está em fase de finalização."
              : "Por favor, ouça as versões e envie seu feedback."}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="versions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="versions">Versões</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="versions" className="mt-6 space-y-4">
              {projectData.previews.map((preview) => (
                <Card 
                  key={preview.id}
                  className={`cursor-pointer transition-all border hover:border-harmonia-green/50 
                    ${selectedVersion === preview.id ? 'border-2 border-harmonia-green shadow-md' : ''}
                  `}
                  onClick={() => setSelectedVersion(preview.id)}
                >
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div>
                      <CardTitle className="text-lg">{preview.title}</CardTitle>
                      {preview.recommended && (
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm text-yellow-600 font-medium">Recomendada</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {preview.description && (
                      <p className="text-sm text-gray-600 mb-4">{preview.description}</p>
                    )}
                    
                    <div className="bg-gray-100 rounded-md p-3">
                      <GoogleDriveAudioPlayer
                        fileId={preview.fileId || ''}
                        title={preview.title}
                        subtitle="Clique para ouvir"
                        isPreview={true}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="feedback" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-harmonia-green" />
                    Enviar feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isApproved ? (
                    <div className="bg-green-50 p-4 rounded-md flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <p className="text-green-700">
                        Este projeto já foi aprovado e está em fase de finalização.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-600 mb-3">
                          {selectedVersion 
                            ? `Versão selecionada: ${projectData.previews.find(p => p.id === selectedVersion)?.title}`
                            : 'Nenhuma versão selecionada. Por favor, escolha uma versão na aba "Versões".'
                          }
                        </p>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Seu feedback</p>
                          <Textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Descreva o que você gostou e o que gostaria de mudar nesta versão..."
                            className="min-h-[150px]"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <Button 
                          variant="outline"
                          onClick={handleApproveVersion}
                          disabled={isSubmitting || !selectedVersion}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Aprovar esta versão
                        </Button>
                        <Button 
                          onClick={handleSubmitFeedback}
                          disabled={isSubmitting || !selectedVersion || !feedback.trim()}
                          className="bg-harmonia-green hover:bg-harmonia-green/90"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Enviar feedback
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <PreviewProjectDetails 
            projectData={{
              projectTitle: projectData.projectTitle,
              clientName: projectData.clientName || 'Cliente',
              status: projectData.status,
              packageType: projectData.packageType,
              creationDate: projectData.createdAt
            }} 
          />
          
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Music className="h-5 w-5 mr-2 text-harmonia-green" />
                Informações adicionais
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              <p className="mb-2">
                Esta é uma prévia exclusiva da sua música. Você pode ouvir as versões disponíveis e enviar seu feedback.
              </p>
              <div className="text-xs text-gray-500 mt-4 flex items-center">
                <Lock className="h-3 w-3 mr-1" />
                <span>Conteúdo exclusivo e protegido</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MusicPreviewSystem;
