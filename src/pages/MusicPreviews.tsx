import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PreviewFeedbackForm from '@/components/previews/PreviewFeedbackForm';
import PreviewHeader from '@/components/previews/PreviewHeader';
import PreviewInstructions from '@/components/previews/PreviewInstructions';
import PreviewPlayerList from '@/components/previews/player/PreviewPlayerList';
import PreviewNextSteps from '@/components/previews/PreviewNextSteps';
import { usePreviewData } from '@/hooks/use-preview-data';
import { notificationService } from '@/services/notificationService';

const MusicPreviews: React.FC = () => {
  const { previewId } = useParams<{ previewId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const { projectData, setProjectData, isLoading, actualProjectId } = usePreviewData(previewId);
  
  useEffect(() => {
    console.log("Preview ID:", previewId);
    console.log("Actual Project ID:", actualProjectId);
    
    if (!isLoading && !projectData && actualProjectId) {
      console.log("Preview data não encontrado");
      toast({
        title: "Preview não encontrado",
        description: "O código de preview fornecido não é válido ou expirou.",
        variant: "destructive"
      });
    }
  }, [previewId, projectData, isLoading, toast, actualProjectId]);
  
  const handleSubmitFeedback = () => {
    if (!selectedPreview) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma das versões antes de enviar.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Feedback enviado!",
      description: "Obrigado pelo seu feedback. Nossa equipe já está trabalhando nas modificações.",
    });
    
    // Notify about feedback
    notificationService.notify('feedback_received', {
      projectId: actualProjectId || previewId || '',
      clientName: projectData?.clientName || 'Cliente',
      message: feedback
    });
    
    setProjectData(prev => prev ? {...prev, status: 'feedback' as const} : null);
  };
  
  const handleApprove = () => {
    if (!selectedPreview) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma das versões antes de aprovar.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Música aprovada!",
      description: "Estamos felizes que você gostou! Vamos finalizar sua música e entregar em breve.",
    });
    
    // Notify about approval
    notificationService.notify('preview_approved', {
      projectId: actualProjectId || previewId || '',
      clientName: projectData?.clientName || 'Cliente',
      versionId: selectedPreview
    });
    
    setProjectData(prev => prev ? {...prev, status: 'approved' as const} : null);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
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
      <div className="min-h-screen bg-background text-foreground">
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
              projectTitle: projectData.projectTitle,
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
                <PreviewPlayerList 
                  versions={projectData.previews.map(preview => ({
                    ...preview,
                    description: preview.description || `Versão musical para ${projectData.clientName}`
                  }))}
                  selectedVersion={selectedPreview}
                  setSelectedVersion={setSelectedPreview}
                  isApproved={projectData.status === 'approved'}
                />
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
                  versionTitle={projectData.previews.find(p => p.id === selectedPreview)?.title}
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

export default MusicPreviews;
