
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PreviewFeedbackForm from '@/components/previews/PreviewFeedbackForm';
import PreviewHeader from '@/components/previews/PreviewHeader';
import PreviewInstructions from '@/components/previews/PreviewInstructions';
import PreviewPlayerList from '@/components/previews/PreviewPlayerList';
import PreviewNextSteps from '@/components/previews/PreviewNextSteps';
import { useClientPreview } from '@/hooks/useClientPreview';
import { notificationService } from '@/services/notificationService';

const ClientPreview: React.FC = () => {
  const { previewCode } = useParams<{ previewCode: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const { previewData, isLoading, error, isAuthenticated, submitFeedback, approveVersion } = useClientPreview(previewCode || '');
  
  useEffect(() => {
    if (!isLoading && !previewData && !error) {
      toast({
        title: "Preview não encontrado",
        description: "O código de preview fornecido não é válido ou expirou.",
        variant: "destructive"
      });
    }
  }, [previewData, isLoading, error, toast]);
  
  const handleSubmitFeedback = async () => {
    if (!selectedPreview) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma das versões antes de enviar.",
        variant: "destructive"
      });
      return;
    }
    
    const success = await submitFeedback(feedback, 'cliente@email.com');
    
    if (success) {
      toast({
        title: "Feedback enviado!",
        description: "Obrigado pelo seu feedback. Nossa equipe já está trabalhando nas modificações.",
      });
      
      // Notify about feedback
      notificationService.notify('feedback_received', {
        projectId: previewData?.projectId || '',
        clientName: previewData?.clientName || 'Cliente',
        message: feedback
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
    
    const success = await approveVersion(selectedPreview, 'cliente@email.com');
    
    if (success) {
      toast({
        title: "Música aprovada!",
        description: "Estamos felizes que você gostou! Vamos finalizar sua música e entregar em breve.",
      });
      
      // Notify about approval
      notificationService.notify('preview_approved', {
        projectId: previewData?.projectId || '',
        clientName: previewData?.clientName || 'Cliente',
        versionId: selectedPreview
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
  
  if (!previewData || error) {
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
              projectTitle: previewData.title,
              clientName: previewData.clientName,
              status: previewData.status
            }}
          />
          
          <PreviewInstructions status={previewData.status} />
          
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
                  versions={previewData.versions?.map(version => ({
                    id: version.id,
                    title: version.name,
                    description: version.description || 'Versão musical',
                    audioUrl: version.bandcampUrl || '',
                    bandcampUrl: version.bandcampUrl,
                    recommended: version.recommended
                  })) || []}
                  selectedVersion={selectedPreview}
                  setSelectedVersion={setSelectedPreview}
                  isApproved={previewData.status === 'approved'}
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
                  status={previewData.status}
                  selectedVersion={selectedPreview}
                  versionTitle={previewData.versions?.find(v => v.id === selectedPreview)?.name}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <PreviewNextSteps status={previewData.status} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientPreview;
