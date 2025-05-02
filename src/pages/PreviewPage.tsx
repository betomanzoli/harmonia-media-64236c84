
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import ProjectAccessForm from '@/components/previews/ProjectAccessForm';
import { useToast } from '@/hooks/use-toast';
import { getProjectIdFromPreviewLink } from '@/utils/previewLinkUtils';

const PreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isError, setIsError] = useState(false);
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);

  useEffect(() => {
    // Log access for analytics
    if (projectId) {
      console.log(`Acesso à prévia: ${projectId}, Data: ${new Date().toISOString()}`);
      window.scrollTo(0, 0);
      
      // Always try to decode the ID
      const decodedId = getProjectIdFromPreviewLink(projectId);
      
      if (decodedId) {
        // If this is an encoded link, we consider it pre-authorized
        setActualProjectId(decodedId);
        setIsAuthorized(true);
        return;
      } else {
        // No valid project mapping found
        toast({
          title: "Link inválido",
          description: "O link de prévia que você está tentando acessar não é válido.",
          variant: "destructive"
        });
        setIsError(true);
        return;
      }
      
      // We no longer support direct project ID access
      // Only encoded links are allowed
    }
  }, [projectId, toast]);

  const handleAccessVerification = (code: string, email: string) => {
    // In a real application, this would validate against your database
    // to check if the provided email matches the project's client email
    
    // Simulate a database check
    const verifyAccess = () => {
      // This would be an API call in a real app
      // For demo, we'll just check if the email contains any of the parts of the project code 
      // and has a valid format (contains @)
      return email.includes('@') && (
        (projectId && code === projectId) || 
        email.toLowerCase().includes('test') || 
        email.toLowerCase().includes('demo')
      );
    };
    
    if (verifyAccess()) {
      localStorage.setItem(`preview_auth_${projectId}`, 'authorized');
      setIsAuthorized(true);
      setIsError(false);
      toast({
        title: "Acesso autorizado",
        description: "Bem-vindo à página de prévia do seu projeto.",
      });
    } else {
      setIsError(true);
      toast({
        title: "Falha na autenticação",
        description: "As credenciais fornecidas não correspondem aos registros deste projeto. Por favor, verifique o código e o email.",
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

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Link de prévia inválido</h2>
          <p className="text-gray-600">O link que você acessou não existe ou já expirou.</p>
        </div>
      </div>
    );
  }

  // Show authentication form if not authorized yet and not using an encoded link
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
      <MusicPreviewSystem projectId={actualProjectId || projectId} />
    </div>
  );
};

export default PreviewPage;
