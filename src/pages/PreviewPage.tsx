
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
      
      // First try to decode the ID in case it's an encoded preview link
      const decodedId = getProjectIdFromPreviewLink(projectId);
      
      if (decodedId) {
        // If this is an encoded link, we consider it pre-authorized
        console.log("Link codificado detectado, ID do projeto:", decodedId);
        setActualProjectId(decodedId);
        setIsAuthorized(true);
        return;
      }
      
      // For backward compatibility, also support direct project IDs
      // Check if the project exists in localStorage
      try {
        const storedProjects = localStorage.getItem('harmonIA_preview_projects');
        if (storedProjects) {
          const projects = JSON.parse(storedProjects);
          const projectExists = projects.some((p: any) => p.id === projectId);
          
          if (projectExists) {
            console.log("ID de projeto direto encontrado:", projectId);
            setActualProjectId(projectId);
            
            // Check if admin access or previously authorized
            const isAdmin = localStorage.getItem('admin_preview_access') === 'true';
            const isPreviouslyAuthorized = localStorage.getItem(`preview_auth_${projectId}`) === 'authorized';
            
            if (isAdmin || isPreviouslyAuthorized) {
              setIsAuthorized(true);
            }
            return;
          }
        }
        
        // No valid project mapping found
        setIsError(true);
        toast({
          title: "Link inválido",
          description: "O link de prévia que você está tentando acessar não é válido.",
          variant: "destructive"
        });
      } catch (error) {
        console.error("Erro ao verificar projeto:", error);
        setIsError(true);
      }
    }
  }, [projectId, toast]);

  const handleAccessVerification = (code: string, email: string) => {
    // In a real application, this would validate against your database
    // to check if the provided email matches the project's client email
    
    // Simulate a database check
    const verifyAccess = () => {
      // This would be an API call in a real app
      try {
        const storedProjects = localStorage.getItem('harmonIA_preview_projects');
        if (storedProjects) {
          const projects = JSON.parse(storedProjects);
          const project = projects.find((p: any) => p.id === projectId);
          
          if (project) {
            // Match by email or code
            return (email.toLowerCase() === project.clientEmail?.toLowerCase()) || 
                   (code === projectId);
          }
        }
        
        // Fallback for demo
        return email.includes('@') && (
          (projectId && code === projectId) || 
          email.toLowerCase().includes('test') || 
          email.toLowerCase().includes('demo')
        );
      } catch (error) {
        console.error("Erro na verificação de acesso:", error);
        return false;
      }
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
