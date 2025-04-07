
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import LimitedAudioPlayer from '@/components/LimitedAudioPlayer';
import { Check, Clock } from 'lucide-react';

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  recommended?: boolean;
}

interface PreviewProjectData {
  projectId: string;
  clientName: string;
  packageType: string;
  creationDate: string;
  status: 'waiting' | 'feedback' | 'approved';
  versions: MusicPreview[];
}

// Simulando dados para desenvolvimento
const MOCK_DATA: Record<string, PreviewProjectData> = {
  'HAR-2025-0001': {
    projectId: 'HAR-2025-0001',
    clientName: 'João Silva',
    packageType: 'Profissional',
    creationDate: '05/04/2025',
    status: 'waiting',
    versions: [
      {
        id: 'v1',
        title: 'Versão Acústica',
        description: 'Esta versão apresenta uma abordagem mais acústica, com violão e piano como instrumentos principais. A melodia é suave e a progressão harmônica segue um padrão mais tradicional do pop contemporâneo.',
        audioUrl: '/samples/preview1.mp3',
        recommended: true
      },
      {
        id: 'v2',
        title: 'Versão Eletrônica',
        description: 'Esta versão incorpora elementos eletrônicos com sintetizadores e batidas programadas. Mantém a mesma estrutura melódica da versão 1, mas com uma produção mais moderna e dançante.',
        audioUrl: '/samples/preview2.mp3'
      },
      {
        id: 'v3',
        title: 'Versão Orquestral',
        description: 'Esta versão apresenta arranjos orquestrais com cordas e metais, criando uma atmosfera mais cinematográfica. A estrutura da música é mais elaborada, com introdução e ponte expandidas.',
        audioUrl: '/samples/preview3.mp3'
      }
    ]
  },
  'HAR-2025-0002': {
    projectId: 'HAR-2025-0002',
    clientName: 'Maria Oliveira',
    packageType: 'Premium',
    creationDate: '06/04/2025',
    status: 'feedback',
    versions: [
      {
        id: 'v1',
        title: 'Versão Pop',
        description: 'Versão pop contemporânea com elementos de piano e bateria eletrônica.',
        audioUrl: '/samples/preview4.mp3'
      },
      {
        id: 'v2',
        title: 'Versão Minimalista',
        description: 'Versão minimalista com piano solo e leves elementos ambientes.',
        audioUrl: '/samples/preview5.mp3',
        recommended: true
      }
    ]
  }
};

const MusicPreviewSystem: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(7 * 24 * 60 * 60); // 7 dias em segundos
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [projectData, setProjectData] = useState<PreviewProjectData | null>(null);
  
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Em produção, aqui seria uma chamada à API
    if (projectId && MOCK_DATA[projectId]) {
      setProjectData(MOCK_DATA[projectId]);
      
      // Pré-selecionar a versão recomendada, se houver
      const recommended = MOCK_DATA[projectId].versions.find(v => v.recommended);
      if (recommended) {
        setSelectedVersion(recommended.id);
      }
    } else {
      toast({
        title: "Projeto não encontrado",
        description: "O código de projeto fornecido não é válido.",
        variant: "destructive"
      });
    }

    // Timer para contagem regressiva
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [projectId, toast]);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVersion) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma das versões antes de enviar seu feedback.",
        variant: "destructive"
      });
      return;
    }
    
    // Em produção, aqui seria uma chamada à API
    toast({
      title: "Feedback enviado com sucesso!",
      description: "Agradecemos sua avaliação. Nossa equipe iniciará os ajustes em breve.",
    });
    
    // Atualizar status local
    if (projectData) {
      setProjectData({
        ...projectData,
        status: 'feedback'
      });
    }
    
    // Navegar para a página de confirmação
    setTimeout(() => {
      navigate('/feedback-confirmacao');
    }, 1500);
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
    
    // Em produção, aqui seria uma chamada à API
    toast({
      title: "Música aprovada!",
      description: "Agradecemos sua aprovação. Finalizaremos sua música em breve.",
    });
    
    // Atualizar status local
    if (projectData) {
      setProjectData({
        ...projectData,
        status: 'approved'
      });
    }
    
    // Navegar para a página de confirmação
    setTimeout(() => {
      navigate('/aprovacao-confirmacao');
    }, 1500);
  };

  if (!projectData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Projeto não encontrado</h2>
          <p className="text-gray-500 mb-6">O código de projeto fornecido não é válido ou expirou.</p>
          <Button onClick={() => navigate('/')}>Voltar à página inicial</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <Card className="bg-gradient-to-r from-harmonia-green/20 to-green-500/10 p-4 mb-8 flex items-center gap-2">
        <Clock className="text-harmonia-green h-5 w-5" />
        <span className="font-medium">
          Tempo restante para avaliação: <span className="text-harmonia-green font-bold">{formatTime(timeLeft)}</span>
        </span>
      </Card>
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold">{projectData.projectId}</h1>
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{projectData.packageType}</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{projectData.creationDate}</span>
            <span className="px-3 py-1 bg-harmonia-green/20 text-harmonia-green rounded-full text-sm font-medium">
              {projectData.status === 'waiting' ? 'Aguardando Avaliação' : 
               projectData.status === 'feedback' ? 'Em Revisão' : 'Aprovado'}
            </span>
          </div>
        </div>
        
        <Card className="p-6 mb-8 border-l-4 border-l-harmonia-green">
          <h2 className="text-xl font-bold mb-2">Olá, {projectData.clientName}!</h2>
          <p className="text-gray-600">
            Estamos felizes em apresentar as prévias musicais do seu projeto. Por favor, ouça cada versão 
            e selecione a que mais lhe agrada. Você pode adicionar comentários específicos para ajustes na versão escolhida.
          </p>
        </Card>
      </div>
      
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-6 pb-2 border-b">Versões Disponíveis</h2>
        <div className="space-y-6">
          {projectData.versions.map(version => (
            <Card 
              key={version.id} 
              className={`p-6 transition-all ${selectedVersion === version.id ? 'border-harmonia-green ring-1 ring-harmonia-green' : 'hover:border-harmonia-green/50'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{version.title}</h3>
                  {version.recommended && (
                    <span className="inline-block px-2 py-1 bg-harmonia-green/20 text-harmonia-green text-xs rounded-full mt-1">
                      Recomendada
                    </span>
                  )}
                </div>
                {selectedVersion === version.id ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-harmonia-green/10 text-harmonia-green border-harmonia-green"
                    disabled
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Selecionada
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hover:bg-harmonia-green/10 hover:text-harmonia-green"
                    onClick={() => setSelectedVersion(version.id)}
                    disabled={projectData.status === 'approved'}
                  >
                    Selecionar
                  </Button>
                )}
              </div>
              
              <p className="text-gray-600 mb-4">{version.description}</p>
              
              <div className="mb-4">
                <LimitedAudioPlayer 
                  audioSrc={version.audioUrl}
                  previewDuration={30}
                  title=""
                  subtitle=""
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {projectData.status !== 'approved' && (
        <Card className="p-6 mb-10">
          <h2 className="text-xl font-bold mb-4">Seus Comentários</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">
                Versão selecionada: {selectedVersion ? 
                  projectData.versions.find(v => v.id === selectedVersion)?.title : 
                  "Nenhuma versão selecionada"}
              </p>
              
              <Textarea 
                placeholder="Conte-nos o que você gostou e quais ajustes você gostaria na versão selecionada..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button 
                type="button" 
                variant="outline"
                className="order-2 sm:order-1"
                onClick={handleApprove}
                disabled={!selectedVersion}
              >
                Aprovar Música
              </Button>
              <Button 
                type="submit" 
                className="bg-harmonia-green hover:bg-harmonia-green/90 order-1 sm:order-2"
                disabled={!selectedVersion}
              >
                Enviar Feedback
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      <Card className="p-6 text-sm text-gray-500">
        <p className="text-center">
          Estas prévias são protegidas por direitos autorais e destinadas apenas para sua avaliação pessoal. 
          © harmonIA {new Date().getFullYear()}
        </p>
      </Card>
    </div>
  );
};

export default MusicPreviewSystem;
