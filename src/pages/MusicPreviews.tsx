import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import LimitedAudioPlayer from '@/components/LimitedAudioPlayer';
import { PreviewFeedbackForm } from '@/components/previews/PreviewFeedbackForm';

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
          <Button onClick={() => navigate('/')}>Voltar à página inicial</Button>
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
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center gap-1 text-gray-400 hover:text-white"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar à página inicial
            </Button>
          </div>
          
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{previewData.projectTitle}</h1>
            <p className="text-xl text-gray-300">Olá, {previewData.clientName}!</p>
            <p className="text-gray-400 mt-4">
              Estamos animados para apresentar as primeiras versões da sua música. 
              Por favor, ouça cada uma delas e nos informe qual você prefere.
              As prévias têm duração limitada para proteção dos direitos autorais.
            </p>
          </div>
          
          {previewData.status === 'approved' ? (
            <div className="bg-harmonia-green/20 border border-harmonia-green rounded-lg p-6 mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Check className="text-harmonia-green w-6 h-6" />
                <h2 className="text-xl font-semibold text-harmonia-green">Música Aprovada!</h2>
              </div>
              <p className="text-gray-300">
                Obrigado por aprovar a música! Nossa equipe está finalizando os detalhes 
                e você receberá a versão completa em breve no formato especificado no seu pacote.
              </p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-6 mb-10">
              <h2 className="text-xl font-semibold mb-4">Como funciona:</h2>
              <ol className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="bg-harmonia-green/20 text-harmonia-green rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                  <span>Ouça cada uma das versões propostas para sua música</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-harmonia-green/20 text-harmonia-green rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                  <span>Selecione a versão que você mais gostou clicando em "Selecionar esta versão"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-harmonia-green/20 text-harmonia-green rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                  <span>Forneça feedback específico ou solicite alterações</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-harmonia-green/20 text-harmonia-green rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
                  <span>
                    Clique em "Enviar feedback" se deseja ajustes ou "Aprovar música" se está satisfeito com a versão escolhida
                  </span>
                </li>
              </ol>
            </div>
          )}
          
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
              <div className="space-y-6">
                {previewData.previews.map(preview => (
                  <div key={preview.id} className="relative">
                    <LimitedAudioPlayer 
                      title={preview.title}
                      subtitle={preview.description}
                      audioSrc={preview.audioUrl}
                      previewDuration={30}
                    />
                    
                    {selectedPreview === preview.id ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="absolute top-6 right-6 bg-harmonia-green/20 text-harmonia-green border-harmonia-green"
                        disabled
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Selecionada
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="absolute top-6 right-6 hover:bg-harmonia-green/20 hover:text-harmonia-green"
                        onClick={() => setSelectedPreview(preview.id)}
                        disabled={previewData.status === 'approved'}
                      >
                        Selecionar esta versão
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="feedback">
              <PreviewFeedbackForm 
                selectedPreview={selectedPreview}
                feedback={feedback}
                setFeedback={setFeedback}
                onSubmitFeedback={handleSubmitFeedback}
                onApprove={handleApprove}
                isApproved={previewData.status === 'approved'}
                previews={previewData.previews}
              />
            </TabsContent>
          </Tabs>
          
          {previewData.status !== 'approved' && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Próximos passos:</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Após sua escolha e feedback, nossa equipe fará os ajustes necessários.</li>
                <li>• Você receberá uma notificação por e-mail quando novas versões estiverem disponíveis.</li>
                <li>• Uma vez aprovada a versão final, a música será masterizada e entregue conforme seu pacote.</li>
                <li>• Você terá acesso a este link de preview por 30 dias após a aprovação final.</li>
              </ul>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MusicPreviews;
