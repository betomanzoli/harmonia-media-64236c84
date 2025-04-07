
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePreviewData } from '@/hooks/use-preview-data';
import PreviewCountdown from './PreviewCountdown';
import PreviewProjectDetails from './PreviewProjectDetails';
import PreviewVersionsList from './PreviewVersionsList';
import PreviewFeedbackForm from './PreviewFeedbackForm';
import PreviewCopyright from './PreviewCopyright';

const MusicPreviewSystem: React.FC = () => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projectData, setProjectData } = usePreviewData(projectId);

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

  const selectedVersionTitle = projectData.versions.find(v => v.id === selectedVersion)?.title;

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <PreviewCountdown />
      
      <PreviewProjectDetails projectData={projectData} />
      
      <PreviewVersionsList 
        versions={projectData.versions}
        selectedVersion={selectedVersion}
        setSelectedVersion={setSelectedVersion}
        isApproved={projectData.status === 'approved'}
      />
      
      <PreviewFeedbackForm 
        selectedVersion={selectedVersion}
        feedback={feedback}
        setFeedback={setFeedback}
        handleSubmit={handleSubmit}
        handleApprove={handleApprove}
        status={projectData.status}
        versionTitle={selectedVersionTitle}
      />
      
      <PreviewCopyright />
    </div>
  );
};

export default MusicPreviewSystem;
