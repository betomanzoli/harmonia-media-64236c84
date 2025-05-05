import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import ProjectAccessForm from '@/components/previews/ProjectAccessForm';
import { useToast } from '@/hooks/use-toast';
import { getProjectIdFromPreviewLink, isValidEncodedPreviewLink } from '@/utils/previewLinkUtils';

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
      
      // Validate if this is an encoded preview link
      const isEncodedLink = isValidEncodedPreviewLink(projectId);
      console.log("Is encoded preview link:", isEncodedLink);
      
      if (!isEncodedLink) {
        console.log("Invalid link format - not an encoded preview link");
        setIsError(true);
        return;
      }
      
      // Decode the project ID
      const decodedId = getProjectIdFromPreviewLink(projectId);
      console.log("Decoded project ID:", decodedId);
      
      if (!decodedId) {
        console.log("Failed to decode project ID");
        setIsError(true);
        return;
      }
      
      // Set the actual project ID and attempt to find the project
      setActualProjectId(decodedId);
      
      try {
        const storedProjects = localStorage.getItem('harmonIA_preview_projects');
        console.log('Projects in localStorage:', storedProjects ? 'Found' : 'Not found');
        
        if (storedProjects) {
          const projects = JSON.parse(storedProjects);
          
          // Check if project exists
          const projectExists = projects.some((p: any) => p.id === decodedId);
          
          if (projectExists) {
            console.log("Project found:", decodedId);
            
            // Check if admin access or previously authorized
            const isAdmin = localStorage.getItem('admin_preview_access') === 'true';
            const isPreviouslyAuthorized = localStorage.getItem(`preview_auth_${projectId}`) === 'authorized';
            
            if (isAdmin || isPreviouslyAuthorized) {
              setIsAuthorized(true);
              setIsError(false);
            } else {
              // Not authorized, but the project exists
              // Keep isError as false so the ProjectAccessForm will be shown
              setIsError(false);
            }
            return;
          }
          
          // No valid project found
          console.log("No valid project found for:", decodedId);
          setIsError(true);
        } else {
          // No projects in localStorage
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
    console.log('Verifying access with code:', code, 'and email:', email);
    
    // Simulate a database check
    const verifyAccess = () => {
      // This would be an API call in a real app
      try {
        const storedProjects = localStorage.getItem('harmonIA_preview_projects');
        if (storedProjects && actualProjectId) {
          const projects = JSON.parse(storedProjects);
          const project = projects.find((p: any) => p.id === actualProjectId);
          
          if (project) {
            console.log('Project found for authorization:', project);
            return (email.toLowerCase() === project.clientEmail?.toLowerCase()) || 
                  (code === actualProjectId);
          }
        }
        
        // Fallback for demo
        return email.includes('@') && (
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ID do projeto não encontrado</h2>
          <p className="text-gray-700">O link que você acessou não é válido.</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Link de prévia inválido</h2>
          <p className="text-gray-700">O link que você acessou não existe ou expirou.</p>
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
