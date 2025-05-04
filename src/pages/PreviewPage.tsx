
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
      console.log(`Preview access attempt: ${projectId}, Date: ${new Date().toISOString()}`);
      window.scrollTo(0, 0);
      
      // First check if this is an encoded link (should have a dash)
      const isEncodedLink = projectId.includes('-');
      
      // If it's not an encoded link, reject it immediately
      if (!isEncodedLink) {
        console.log("Rejecting direct project ID access:", projectId);
        setIsError(true);
        return;
      }
      
      // Try to decode the encoded link
      const decodedId = getProjectIdFromPreviewLink(projectId);
      console.log("Decoded project ID:", decodedId);
      
      // If decoding failed or returned null, reject access
      if (!decodedId) {
        console.log("Invalid encoded link format:", projectId);
        setIsError(true);
        return;
      }
      
      // Try to find project by decoded ID
      try {
        const storedProjects = localStorage.getItem('harmonIA_preview_projects');
        console.log('Projetos armazenados:', storedProjects);
        
        if (storedProjects) {
          const projects = JSON.parse(storedProjects);
          
          // Check if project exists with decoded ID
          const projectExists = projects.some((p: any) => p.id === decodedId);
          if (projectExists) {
            console.log("Project found with decoded ID:", decodedId);
            setActualProjectId(decodedId);
            
            // Check if admin access or previously authorized
            const isAdmin = localStorage.getItem('admin_preview_access') === 'true';
            const isPreviouslyAuthorized = localStorage.getItem(`preview_auth_${projectId}`) === 'authorized';
            
            if (isAdmin || isPreviouslyAuthorized) {
              setIsAuthorized(true);
              setIsError(false);
            } else {
              // Not authorized yet, but project exists
              setIsError(false);
            }
          } else {
            console.log("Project not found for decoded ID:", decodedId);
            setIsError(true);
          }
        } else {
          console.log("No projects in localStorage");
          setIsError(true);
        }
      } catch (error) {
        console.error("Error verifying project:", error);
        setIsError(true);
      }
    }
  }, [projectId]);

  const handleAccessVerification = (code: string, email: string) => {
    // In a real application, this would validate against your database
    // to check if the provided email matches the project's client email
    
    // Simulate a database check
    const verifyAccess = () => {
      console.log('Verifying access with code:', code, 'and email:', email);
      
      // This would be an API call in a real app
      try {
        const storedProjects = localStorage.getItem('harmonIA_preview_projects');
        if (storedProjects) {
          const projects = JSON.parse(storedProjects);
          
          // First check if we have a decoded ID
          if (actualProjectId) {
            const project = projects.find((p: any) => p.id === actualProjectId);
            if (project) {
              console.log('Project found for authorization:', project);
              return (email.toLowerCase() === project.clientEmail?.toLowerCase()) || 
                    (code === actualProjectId);
            }
          }
        }
        
        // Fallback for demo
        return email.includes('@') && (
          (actualProjectId && code === actualProjectId) || 
          email.toLowerCase().includes('test') || 
          email.toLowerCase().includes('demo')
        );
      } catch (error) {
        console.error("Error in access verification:", error);
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
      toast({
        title: "Autenticação falhou",
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
          <p className="text-gray-600">O link que você acessou não existe ou expirou. Por favor, use o link codificado enviado pelo administrador.</p>
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
      <MusicPreviewSystem projectId={actualProjectId || projectId} />
    </div>
  );
};

export default PreviewPage;
