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
import { usePreviewData } from '@/hooks/usePreviewData';
import { notificationService } from '@/services/notificationService';
import { getProjectIdFromPreviewLink } from '@/utils/previewLinkUtils';

const MusicPreviews: React.FC = () => {
  const { previewId } = useParams<{ previewId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isValidLink, setIsValidLink] = useState<boolean | null>(null);
  
  // Verify the link encoding first
  useEffect(() => {
    if (previewId) {
      // Attempt to decode the preview ID
      const decodedId = getProjectIdFromPreviewLink(previewId);
      
      // If we couldn't decode it, it's not a valid link
      if (!decodedId) {
        setIsValidLink(false);
        toast({
          title: "Link inválido",
          description: "O link de prévia que você está tentando acessar não é válido.",
          variant: "destructive"
        });
      } else {
        setIsValidLink(true);
      }
    }
  }, [previewId, toast]);
  
  const { projectData, isLoading, actualProjectId, updateProjectStatus } = usePreviewData(isValidLink ? previewId : undefined);
  
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
      projectId: actualProjectId || previewId,
      clientName: projectData?.clientName || 'Cliente',
      message: feedback
    });
    
    if (updateProjectStatus) {
      // Use the type-safe value
      updateProjectStatus('feedback', feedback);
    }
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
      projectId: actualProjectId || previewId,
      clientName: projectData?.clientName || 'Cliente',
      versionId: selectedPreview
    });
    
    if (updateProjectStatus) {
      // Use the type-safe value
      updateProjectStatus('approved', feedback);
    }
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
  
  // Show error if the link is invalid
  if (isValidLink === false) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="pt-24 pb-20 px-6 md:px-10 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Link de prévia inválido</h1>
            <p className="text-gray-400 mb-6">O link que você está tentando acessar não é válido.</p>
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
  
  if (!projectData) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="pt-24 pb-20 px-6 md:px-10 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Preview não encontrado</h1>
            <p className="text-gray-400 mb-6">O código de preview fornecido não é v��lido ou expirou.</p>
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
  
  // Use versions if available, otherwise use versionsList, or fall back to empty array
  const versionsForPlayer = projectData?.versionsList || projectData?.versions || [];
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <PreviewHeader 
            projectTitle=""
            clientName=""
            packageType="Música Personalizada"
            status="waiting"
            createdAt={new Date().toISOString()}
            projectData={{
              projectTitle: projectData?.projectTitle || projectData?.packageType || '',
              clientName: projectData?.clientName || '',
              status: projectData?.status === 'waiting' || projectData?.status === 'feedback' || projectData?.status === 'approved' 
                ? projectData.status 
                : 'waiting'
            }}
          />
          
          <PreviewInstructions 
            status={projectData?.status === 'waiting' || projectData?.status === 'feedback' || projectData?.status === 'approved' 
              ? projectData.status 
              : 'waiting'} 
          />
          
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
              <PreviewPlayerList 
                versions={versionsForPlayer.map(preview => ({
                  ...preview,
                  description: preview.description || `Versão musical para ${projectData?.clientName || 'Cliente'}`
                }))}
                selectedVersion={selectedPreview}
                setSelectedVersion={setSelectedPreview}
                isApproved={projectData?.status === 'approved'}
              />
            </TabsContent>
            
            <TabsContent value="feedback">
              <PreviewFeedbackForm 
                selectedPreview={selectedPreview}
                feedback={feedback}
                setFeedback={setFeedback}
                handleSubmit={handleSubmitFeedback}
                handleApprove={handleApprove}
                status={projectData?.status === 'waiting' || projectData?.status === 'feedback' || projectData?.status === 'approved' 
                  ? projectData.status 
                  : 'waiting'}
                versionTitle={versionsForPlayer.find(p => p.id === selectedPreview)?.name}
              />
            </TabsContent>
          </Tabs>
          
          <PreviewNextSteps 
            status={projectData?.status === 'waiting' || projectData?.status === 'feedback' || projectData?.status === 'approved' 
              ? projectData.status 
              : 'waiting'} 
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MusicPreviews;
