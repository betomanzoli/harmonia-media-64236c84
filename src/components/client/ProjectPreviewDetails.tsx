
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Music, MessageSquare, ArrowLeft, CheckCircle, Star } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import GoogleDriveAudioPlayer from '@/components/previews/GoogleDriveAudioPlayer';
import { supabase } from '@/lib/supabase';
import { checkPreviewAccessCookie, setPreviewAccessCookie, setPreviewEmailCookie } from '@/utils/authCookies';

interface ProjectPreviewDetailsProps {
  project: {
    id: string;
    title: string;
    status: string;
    versions?: any[];
  };
  onBack: () => void;
}

interface PreviewVersion {
  id: string;
  name: string;
  description?: string;
  fileId?: string;
  recommended?: boolean;
}

const ProjectPreviewDetails: React.FC<ProjectPreviewDetailsProps> = ({ project, onBack }) => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [versions, setVersions] = useState<PreviewVersion[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure client has access to previews
    const currentEmail = localStorage.getItem('userEmail') || '';
    if (currentEmail && project.id) {
      setPreviewAccessCookie(project.id);
      setPreviewEmailCookie(project.id, currentEmail);
    }

    // Load versions from project or fetch from backend
    const loadVersions = async () => {
      if (project.versions && project.versions.length > 0) {
        setVersions(project.versions);
        // Select the recommended version by default if available
        const recommendedVersion = project.versions.find(v => v.recommended);
        if (recommendedVersion) {
          setSelectedVersion(recommendedVersion.id);
        } else if (project.versions.length > 0) {
          setSelectedVersion(project.versions[0].id);
        }
      } else {
        try {
          // Try to fetch versions from admin preview data
          const { data: previewData, error } = await supabase
            .from('previews')
            .select('*')
            .eq('preview_id', project.id)
            .maybeSingle();

          if (error) throw error;

          if (previewData?.versions) {
            setVersions(previewData.versions);
            if (previewData.versions.length > 0) {
              const recommendedVersion = previewData.versions.find(v => v.recommended);
              setSelectedVersion(recommendedVersion?.id || previewData.versions[0].id);
            }
            return;
          }
        } catch (error) {
          console.error("Error fetching preview versions:", error);
        }

        // Fallback demo versions
        const demoVersions = [
          {
            id: 'v1',
            name: 'Versão Acústica',
            description: 'Versão suave com violão e piano',
            fileId: '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl',
            recommended: true
          },
          {
            id: 'v2',
            name: 'Versão Orquestral',
            description: 'Arranjo completo com cordas e metais',
            fileId: '11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a'
          }
        ];
        setVersions(demoVersions);
        setSelectedVersion('v1');
      }
    };

    loadVersions();
  }, [project]);

  const handleSubmitFeedback = () => {
    if (!selectedVersion) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma das versões antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Notify about feedback using the notification service
    notificationService.notify('feedback_received', {
      projectId: project.id,
      message: feedback,
      versionId: selectedVersion
    });
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Feedback enviado!",
        description: "Obrigado pelo seu feedback. Nossa equipe já está trabalhando nas modificações."
      });
      
      // Return to the projects list
      onBack();
    }, 1000);
  };

  const handleApprove = () => {
    if (!selectedVersion) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma das versões antes de aprovar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Notify about approval using the notification service
    notificationService.notify('preview_approved', {
      projectId: project.id,
      versionId: selectedVersion
    });

    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Versão aprovada!",
        description: "Estamos felizes que você gostou! Vamos finalizar sua música e entregar em breve."
      });
      
      // Return to the projects list
      onBack();
    }, 1000);
  };

  const isApproved = project.status === 'aprovado' || project.status === 'approved';

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        className="flex items-center text-gray-600"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Voltar aos projetos
      </Button>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h1>
        <p className="text-gray-500">
          Selecione uma versão para ouvir e enviar seu feedback.
        </p>
      </div>
      
      <Tabs defaultValue="versions" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="versions" className="flex-1">Versões</TabsTrigger>
          <TabsTrigger value="feedback" className="flex-1">Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="versions">
          <div className="space-y-4">
            {versions.map((version) => (
              <Card 
                key={version.id}
                className={`cursor-pointer transition-all hover:border-harmonia-green/50
                  ${selectedVersion === version.id ? 'border-2 border-harmonia-green shadow-md' : ''}
                `}
                onClick={() => setSelectedVersion(version.id)}
              >
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="flex items-center">
                    <CardTitle className="text-lg">{version.name}</CardTitle>
                    {version.recommended && (
                      <span className="ml-2 text-yellow-500 flex items-center text-sm font-medium">
                        <Star className="h-4 w-4 mr-1" /> Recomendada
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{version.description}</p>
                  
                  <div className="bg-gray-100 rounded-md p-4">
                    {version.fileId && (
                      <GoogleDriveAudioPlayer
                        fileId={version.fileId}
                        title={version.name}
                        subtitle="Clique para ouvir a prévia"
                        isPreview={true}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-harmonia-green" />
                Enviar seu feedback
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
                        ? `Você selecionou: ${versions.find(v => v.id === selectedVersion)?.name || 'Versão selecionada'}`
                        : 'Nenhuma versão selecionada. Por favor, escolha uma versão na aba "Versões".'
                      }
                    </p>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Qual o seu feedback sobre esta versão?</p>
                      <Textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Descreva o que você gostou e o que gostaria de mudar..."
                        className="min-h-[150px]"
                      />
                    </div>
                  </div>
                
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={handleApprove}
                      disabled={isSubmitting || !selectedVersion}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprovar versão
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
  );
};

export default ProjectPreviewDetails;
