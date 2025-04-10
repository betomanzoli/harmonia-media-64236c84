
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PreviewHeader from './PreviewHeader';
import PreviewInstructions from './PreviewInstructions';
import PreviewVersionsList from './PreviewVersionsList';
import PreviewFeedbackForm from './PreviewFeedbackForm';
import PreviewNextSteps from './PreviewNextSteps';
import { useToast } from '@/hooks/use-toast';
import { useGoogleDriveAudio } from '@/hooks/audio/useGoogleDriveAudio';
import { Lock } from 'lucide-react';

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
}

// Mock data - in a real implementation, this would come from the database
const getMockPreviewData = (projectId: string) => {
  const mockData = {
    clientName: 'Cliente Exemplo',
    projectTitle: 'Projeto de Música Personalizada',
    status: 'waiting' as const,
    previews: [
      {
        id: 'v1',
        title: 'Versão Acústica',
        description: 'Versão suave com violão e piano',
        audioUrl: 'https://drive.google.com/uc?export=download&id=1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl',
      },
      {
        id: 'v2',
        title: 'Versão Orquestral',
        description: 'Arranjo completo com cordas e metais',
        audioUrl: 'https://drive.google.com/uc?export=download&id=11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a',
      },
      {
        id: 'v3',
        title: 'Versão Minimalista',
        description: 'Abordagem simplificada com foco na melodia',
        audioUrl: 'https://drive.google.com/uc?export=download&id=1fCsWubN8pXwM-mRlDtnQFTCkBbIkuUyW',
      }
    ]
  };
  
  return mockData;
};

const MusicPreviewSystem: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);
  const [isProtected, setIsProtected] = useState(true);
  const { audioFiles, isLoading } = useGoogleDriveAudio();
  
  useEffect(() => {
    if (projectId) {
      // In a real implementation, this would fetch from an API or database
      setPreviewData(getMockPreviewData(projectId));
      
      // Log preview access in real implementation
      console.log(`Cliente acessando prévia: ${projectId}, data: ${new Date().toISOString()}`);
    }
  }, [projectId]);

  // Add protection to prevent audio downloads
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest('audio')) {
        e.preventDefault();
        toast({
          title: "Proteção de conteúdo",
          description: "O download direto das prévias não é permitido nesta fase.",
          variant: "destructive"
        });
        return false;
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [toast]);

  const handleSubmitFeedback = () => {
    if (!selectedVersion) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma das versões antes de enviar seu feedback.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Feedback enviado!",
      description: "Obrigado pelo seu feedback. Nossa equipe já está analisando.",
    });
    
    // Update status locally for demo purposes
    setPreviewData(prev => prev ? {...prev, status: 'feedback' as const} : null);
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
    
    toast({
      title: "Música aprovada!",
      description: "Excelente escolha! Vamos finalizar sua música e entregar em breve.",
    });
    
    // Update status locally for demo purposes
    setPreviewData(prev => prev ? {...prev, status: 'approved' as const} : null);
  };
  
  if (!previewData) {
    return (
      <div className="max-w-4xl mx-auto pt-10">
        <Card>
          <CardHeader>
            <CardTitle>Carregando Prévia...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto pt-10">
      <Card className="mb-6 border-b-4 border-harmonia-green">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{previewData.projectTitle}</h1>
              <p className="text-gray-500">Olá, {previewData.clientName}! Aqui estão suas prévias musicais.</p>
            </div>
            <div className="bg-harmonia-green/10 p-2 rounded-md flex items-center text-harmonia-green">
              <Lock className="w-4 h-4 mr-2" />
              <span className="text-xs font-medium">Prévias Protegidas</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <PreviewInstructions status={previewData.status} />
      
      <Tabs defaultValue="versions" className="mt-6">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="versions" className="flex-1 data-[state=active]:bg-harmonia-green data-[state=active]:text-white">
            Versões Propostas
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex-1 data-[state=active]:bg-harmonia-green data-[state=active]:text-white">
            Enviar Feedback
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="versions">
          <PreviewVersionsList
            versions={previewData.previews.map(p => ({
              id: p.id,
              title: p.title,
              description: p.description,
              audioUrl: p.audioUrl,
              recommended: p.id === 'v1'
            }))}
            selectedVersion={selectedVersion}
            setSelectedVersion={setSelectedVersion}
            isApproved={previewData.status === 'approved'}
          />
        </TabsContent>
        
        <TabsContent value="feedback">
          <PreviewFeedbackForm 
            selectedPreview={selectedVersion}
            feedback={feedback}
            setFeedback={setFeedback}
            handleSubmit={handleSubmitFeedback}
            handleApprove={handleApprove}
            status={previewData.status}
            versionTitle={previewData.previews.find(p => p.id === selectedVersion)?.title}
          />
        </TabsContent>
      </Tabs>
      
      <PreviewNextSteps status={previewData.status} />
      
      <div className="mt-8 text-center py-4 text-xs text-gray-400 border-t">
        <p>Todas as prévias são limitadas a 30 segundos e protegidas contra download não autorizado.</p>
        <p>© {new Date().getFullYear()} harmonIA - Todos os direitos reservados</p>
      </div>
    </div>
  );
};

export default MusicPreviewSystem;
