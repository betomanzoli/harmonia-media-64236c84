
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import ProjectAccessForm from '@/components/previews/ProjectAccessForm';
import { useToast } from '@/hooks/use-toast';

const PreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Log access for analytics
    if (projectId) {
      console.log(`Acesso à prévia: ${projectId}, Data: ${new Date().toISOString()}`);
      window.scrollTo(0, 0);
      
      // Check if already authenticated for this project
      const authStatus = localStorage.getItem(`preview_auth_${projectId}`);
      if (authStatus === 'authorized') {
        setIsAuthorized(true);
      }
    }
  }, [projectId]);

  const handleAccessVerification = (code: string, email: string) => {
    // This would normally verify against a database
    // For now, just grant access if fields are filled
    if (code && email) {
      localStorage.setItem(`preview_auth_${projectId}`, 'authorized');
      setIsAuthorized(true);
      toast({
        title: "Acesso autorizado",
        description: "Bem-vindo à página de prévia do seu projeto.",
      });
    } else {
      toast({
        title: "Falha na autenticação",
        description: "Por favor, verifique o código do projeto e email.",
        variant: "destructive"
      });
    }
  };

  if (!projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-black mb-4">ID do projeto não encontrado</h2>
          <p className="text-gray-600">O link que você acessou não é válido.</p>
        </div>
      </div>
    );
  }

  // Show authentication form if not authorized yet
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <ProjectAccessForm 
          projectId={projectId} 
          onVerify={handleAccessVerification} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-8 pb-16">
      <MusicPreviewSystem projectId={projectId} />
    </div>
  );
};

export default PreviewPage;
