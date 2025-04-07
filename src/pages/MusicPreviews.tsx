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

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
}

const MOCK_PREVIEWS: Record<string, {
  clientName: string;
  projectTitle: string;
  previews: MusicPreview[];
  status: 'waiting' | 'feedback' | 'approved';
}> = {
  'preview123': {
    clientName: 'João Silva',
    projectTitle: 'Música para Aniversário',
    status: 'waiting',
    previews: [
      {
        id: 'p1',
        title: 'Versão 1 - Acústica',
        description: 'Versão acústica com violão e piano',
        audioUrl: '/samples/preview1.mp3',
      },
      {
        id: 'p2',
        title: 'Versão 2 - Pop',
        description: 'Versão pop com bateria e teclados',
        audioUrl: '/samples/preview2.mp3',
      },
      {
        id: 'p3',
        title: 'Versão 3 - Orquestrada',
        description: 'Versão com arranjo orquestral',
        audioUrl: '/samples/preview3.mp3',
      }
    ]
  },
  'preview456': {
    clientName: 'Maria Oliveira',
    projectTitle: 'Jingle para Produto',
    status: 'feedback',
    previews: [
      {
        id: 'p4',
        title: 'Versão 1 - Energética',
        description: 'Versão energética com batidas eletrônicas',
        audioUrl: '/samples/preview4.mp3',
      },
      {
        id: 'p5',
        title: 'Versão 2 - Suave',
        description: 'Versão mais calma e melódica',
        audioUrl: '/samples/preview5.mp3',
      }
    ]
  }
};

const MusicPreviews: React.FC = () => {
  const { previewId } = useParams<{ previewId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [previewData, setPreviewData] = useState<typeof MOCK_PREVIEWS[string] | null>(null);
  
  useEffect(() => {
    if (previewId && MOCK_PREVIEWS[previewId]) {
      setPreviewData(MOCK_PREVIEWS[previewId]);
    } else {
      toast({
        title: "Preview não encontrado",
        description: "O código de preview fornecido não é válido.",
        variant: "destructive"
      });
    }
  }, [previewId, toast]);
  
  if (!previewData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Preview não encontrado</h1>
          <p className="text-gray-400 mb-6">O código de preview fornecido não é válido ou expirou.</p>
          <button onClick={() => navigate('/')}>Voltar à página inicial</button>
        </div>
      </div>
    );
  }
  
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
    
    setPreviewData(prev => prev ? {...prev, status: 'feedback' as const} : null);
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
    
    setPreviewData(prev => prev ? {...prev, status: 'approved' as const} : null);
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <PreviewHeader 
            clientName={previewData.clientName} 
            projectTitle={previewData.projectTitle}
            status={previewData.status}
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
              <PreviewPlayerList 
                previews={previewData.previews}
                selectedPreview={selectedPreview}
                setSelectedPreview={setSelectedPreview}
                isApproved={previewData.status === 'approved'}
              />
            </TabsContent>
            
            <TabsContent value="feedback">
              <PreviewFeedbackForm 
                selectedPreview={selectedPreview}
                feedback={feedback}
                setFeedback={setFeedback}
                handleSubmit={handleSubmitFeedback}
                handleApprove={handleApprove}
                status={previewData.status}
                versionTitle={previewData.previews.find(p => p.id === selectedPreview)?.title}
              />
            </TabsContent>
          </Tabs>
          
          <PreviewNextSteps status={previewData.status} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MusicPreviews;
