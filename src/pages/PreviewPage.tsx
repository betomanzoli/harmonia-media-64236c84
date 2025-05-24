import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PreviewFeedbackForm from '@/components/previews/PreviewFeedbackForm';
import PreviewHeader from '@/components/previews/PreviewHeader';
import PreviewInstructions from '@/components/previews/PreviewInstructions';
import PreviewPlayerList from '@/components/previews/player/PreviewPlayerList';
import PreviewNextSteps from '@/components/previews/PreviewNextSteps';
import GoogleDrivePreviewsList from '@/components/previews/GoogleDrivePreviewsList';
import { usePreviewProject } from '@/hooks/previews/usePreviewProject';
import { notificationService } from '@/services/notificationService';

const PreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const { projectData, setProjectData, isLoading } = usePreviewProject(projectId || '');

  // Sistema de persistência híbrida
  useEffect(() => {
    const restoreState = () => {
      try {
        const savedState = localStorage.getItem(`previewState_${projectId}`);
        if (savedState) {
          const { selected, feedback: savedFeedback } = JSON.parse(savedState);
          setSelectedPreview(selected);
          setFeedback(savedFeedback);
        }
      } catch {
        const cookieState = document.cookie
          .split('; ')
          .find(row => row.startsWith(`previewState_${projectId}=`))
          ?.split('=')[1];
        if (cookieState) {
          const { selected, feedback: savedFeedback } = JSON.parse(decodeURIComponent(cookieState));
          setSelectedPreview(selected);
          setFeedback(savedFeedback);
        }
      }
    };

    if (projectId) restoreState();
  }, [projectId]);

  // Auto-save do estado
  useEffect(() => {
    if (projectId && (selectedPreview || feedback)) {
      const state = JSON.stringify({ selected: selectedPreview, feedback });
      try {
        localStorage.setItem(`previewState_${projectId}`, state);
      } catch {
        document.cookie = `previewState_${projectId}=${encodeURIComponent(state)}; Path=/; Max-Age=604800; Secure; SameSite=None; Partitioned`;
      }
    }
  }, [selectedPreview, feedback, projectId]);
  
  const handleSubmitFeedback = async () => {
    if (!selectedPreview) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma das versões antes de enviar.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Salvar no Supabase
      await supabase.rpc('append_feedback', {
        project_id: projectId,
        new_entry: {
          feedback,
          version: selectedPreview,
          timestamp: new Date().toISOString(),
          approved: false
        }
      });

      toast({
        title: "Feedback enviado!",
        description: "Obrigado pelo seu feedback. Nossa equipe já está trabalhando nas modificações.",
      });
      
      notificationService.notify('feedback_received', {
        projectId: projectId || '',
        clientName: projectData?.clientName || 'Cliente',
        message: feedback
      });
      
      setProjectData(prev => prev ? {...prev, status: 'feedback'} : null);
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o feedback. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const handleApprove = async () => {
    if (!selectedPreview) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma das versões antes de aprovar.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Salvar aprovação no Supabase
      await supabase.rpc('append_feedback', {
        project_id: projectId,
        new_entry: {
          feedback: 'Música aprovada!',
          version: selectedPreview,
          timestamp: new Date().toISOString(),
          approved: true
        }
      });

      toast({
        title: "Música aprovada!",
        description: "Estamos felizes que você gostou! Vamos finalizar sua música e entregar em breve.",
      });
      
      notificationService.notify('preview_approved', {
        projectId: projectId || '',
        clientName: projectData?.clientName || 'Cliente',
        versionId: selectedPreview
      });
      
      setProjectData(prev => prev ? {...prev, status: 'approved'} : null);
    } catch (error) {
      console.error('Erro ao aprovar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a aprovação. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Header />
        <div className="pt-24 pb-20 px-6 md:px-10 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-harmonia-green"></div>
            <p className="mt-4 text-gray-500">Carregando prévias...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!projectData) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Header />
        <div className="pt-24 pb-20 px-6 md:px-10 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Preview não encontrado</h1>
            <p className="text-gray-400 mb-6">O código de preview fornecido não é válido ou expirou.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-harmonia-green hover:bg-harmonia-green/90 text-white px-4 py-2 rounded"
            >
              Voltar à página inicial
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <PreviewHeader 
            projectData={{
              projectTitle: projectData.projectTitle || projectData.clientName,
              clientName: projectData.clientName,
              status: projectData.status
            }}
          />
          
          <PreviewInstructions status={projectData.status} />
          
          <Tabs defaultValue="versions" className="mb-10">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="versions" className="flex-1 data-[state=active]:bg-harmonia-green">
                Versões Propostas
              </TabsTrigger>
              <TabsTrigger value="feedback" className="flex-1 data-[state=active]:bg-harmonia-green">
                Enviar Feedback
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="versions">
              <div className="bg-white p-6 rounded-lg shadow">
                {projectData.useGoogleDrive ? (
                  <GoogleDrivePreviewsList projectId={projectId} />
                ) : (
                  <PreviewPlayerList 
                    versions={projectData.previews || []}
                    selectedVersion={selectedPreview}
                    setSelectedVersion={setSelectedPreview}
                    isApproved={projectData.status === 'approved'}
                  />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="feedback">
              <div className="bg-white p-6 rounded-lg shadow">
                <PreviewFeedbackForm 
                  feedback={feedback}
                  onFeedbackChange={setFeedback}
                  onSubmit={handleSubmitFeedback}
                  onApprove={handleApprove}
                  status={projectData.status}
                  selectedVersion={selectedPreview}
                  versionTitle={projectData.previews?.find(v => v.id === selectedPreview)?.title}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <PreviewNextSteps status={projectData.status} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PreviewPage;
