import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { usePreviewData } from '@/hooks/usePreviewData';
import PreviewHeader from './PreviewHeader';
import PreviewInstructions from './PreviewInstructions';
import PreviewPlayerList from './PreviewPlayerList';
import PreviewFeedbackForm from './PreviewFeedbackForm';
import PreviewNextSteps from './PreviewNextSteps';
import PreviewLoadingState from './PreviewLoadingState';
import PreviewFooter from './PreviewFooter';
import { notificationService } from '@/services/notificationService';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { getProjectIdFromPreviewLink, isEmailAuthorizedForProject, authorizeEmailForProject } from '@/utils/previewLinkUtils';

interface MusicPreviewSystemProps {
  projectId?: string;
}

const MusicPreviewSystem: React.FC<{ projectId?: string }> = ({ projectId: propProjectId }) => {
  const params = useParams<{ projectId: string }>();
  const encodedProjectId = propProjectId || params.projectId;
  const actualProjectId = encodedProjectId ? getProjectIdFromPreviewLink(encodedProjectId) : null;
  const { toast } = useToast();
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [clientEmail, setClientEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  
  const { projectData, setProjectData, isLoading } = usePreviewData(actualProjectId || undefined);
  
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

  useEffect(() => {
    if (!isLoading && !projectData) {
      setError("Prévias não encontradas ou expiradas. Este link pode não ser mais válido.");
    }
  }, [isLoading, projectData]);

  const handleVerifyEmail = () => {
    if (!clientEmail || !clientEmail.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido para acessar as prévias.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmittingEmail(true);
    
    setTimeout(() => {
      if (actualProjectId) {
        authorizeEmailForProject(clientEmail, actualProjectId);
        setIsEmailVerified(true);
        
        toast({
          title: "Email verificado",
          description: "Acesso concedido às prévias musicais.",
        });
      }
      setIsSubmittingEmail(false);
    }, 1000);
  };

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
    
    notificationService.notify('feedback_received', {
      projectId: actualProjectId,
      clientName: projectData?.clientName || 'Cliente',
      clientEmail: clientEmail,
      message: feedback
    });
    
    setProjectData(prev => prev ? {...prev, status: 'feedback' as const} : null);
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
    
    notificationService.notify('preview_approved', {
      projectId: actualProjectId,
      clientName: projectData?.clientName || 'Cliente',
      clientEmail: clientEmail,
      versionId: selectedVersion
    });
    
    setProjectData(prev => prev ? {...prev, status: 'approved' as const} : null);
  };
  
  useEffect(() => {
    if (actualProjectId && clientEmail) {
      const verified = isEmailAuthorizedForProject(clientEmail, actualProjectId);
      setIsEmailVerified(verified);
    }
  }, [actualProjectId, clientEmail]);
  
  if (isLoading) {
    return <PreviewLoadingState />;
  }

  if (error || !projectData) {
    return (
      <div className="max-w-4xl mx-auto pt-10 px-4">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {error || "Prévia não encontrada ou expirada. Este link pode não ser mais válido."}
          </AlertDescription>
        </Alert>
        
        <div className="text-center mt-8">
          <Button 
            onClick={() => navigate('/')}
            className="bg-harmonia-green hover:bg-harmonia-green/90"
          >
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    );
  }
  
  if (!isEmailVerified) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Acesso às Prévias Musicais</h2>
          <p className="text-gray-600 mt-2">
            Por favor, verifique seu email para acessar as prévias do projeto "{projectData.projectTitle}".
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Seu Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Este deve ser o mesmo email que você forneceu durante a contratação do projeto.
            </p>
          </div>
          
          <Button 
            onClick={handleVerifyEmail}
            className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
            disabled={isSubmittingEmail}
          >
            {isSubmittingEmail ? (
              <span className="inline-flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></span>
                Verificando...
              </span>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Verificar Email
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto pt-10 px-4">
      <PreviewHeader projectData={projectData} />
      
      <PreviewInstructions status={projectData.status} />
      
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
          <PreviewPlayerList
            versions={projectData.previews.map(preview => ({
              ...preview,
              description: preview.description || `Versão musical para ${projectData.clientName}`
            }))}
            selectedVersion={selectedVersion}
            setSelectedVersion={setSelectedVersion}
            isApproved={projectData.status === 'approved'}
          />
        </TabsContent>
        
        <TabsContent value="feedback">
          <PreviewFeedbackForm 
            selectedPreview={selectedVersion}
            projectId={actualProjectId || undefined}
            feedback={feedback}
            setFeedback={setFeedback}
            handleSubmit={handleSubmitFeedback}
            handleApprove={handleApprove}
            status={projectData.status}
            versionTitle={projectData.previews.find(p => p.id === selectedVersion)?.title}
            clientEmail={clientEmail}
          />
        </TabsContent>
      </Tabs>
      
      <PreviewNextSteps status={projectData.status} />
      
      <PreviewFooter />
    </div>
  );
};

export default MusicPreviewSystem;
