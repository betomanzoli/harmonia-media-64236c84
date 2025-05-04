
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
      console.log(`Preview access: ${projectId}, Date: ${new Date().toISOString()}`);
      console.log('Verificando acesso para projectId:', projectId);
      window.scrollTo(0, 0);
      
      // First try to decode the ID in case it's an encoded preview link
      const decodedId = getProjectIdFromPreviewLink(projectId);
      console.log("ID decodificado:", decodedId);
      
      // Try to find project either by decoded ID or direct ID
      try {
        const storedProjects = localStorage.getItem('harmonIA_preview_projects');
        console.log('Projetos armazenados:', storedProjects);
        
        if (storedProjects) {
          const projects = JSON.parse(storedProjects);
          
          // First check if it's an encoded link
          if (decodedId) {
            const projectExists = projects.some((p: any) => p.id === decodedId);
            if (projectExists) {
              console.log("Projeto com link codificado encontrado:", decodedId);
              setActualProjectId(decodedId);
              
              // Check if admin access or previously authorized
              const isAdmin = localStorage.getItem('admin_preview_access') === 'true';
              const isPreviouslyAuthorized = localStorage.getItem(`preview_auth_${projectId}`) === 'authorized';
              
              if (isAdmin || isPreviouslyAuthorized) {
                setIsAuthorized(true);
                setIsError(false);
              } else {
                // Não está autorizado, mas o projeto existe
                setIsError(false);
              }
              return;
            }
          }
          
          // For backward compatibility, also check direct project ID
          const projectExists = projects.some((p: any) => p.id === projectId);
          if (projectExists) {
            console.log("ID direto de projeto encontrado:", projectId);
            setActualProjectId(projectId);
            
            // Check if admin access or previously authorized
            const isAdmin = localStorage.getItem('admin_preview_access') === 'true';
            const isPreviouslyAuthorized = localStorage.getItem(`preview_auth_${projectId}`) === 'authorized';
            
            if (isAdmin || isPreviouslyAuthorized) {
              setIsAuthorized(true);
              setIsError(false);
            } else {
              // Não está autorizado, mas o projeto existe
              setIsError(false);
            }
            return;
          }
          
          // No valid project found
          console.log("Nenhum projeto válido encontrado para:", projectId);
          setIsError(true);
        } else {
          // No projects in localStorage
          console.log("Nenhum projeto no localStorage");
          setIsError(true);
        }
      } catch (error) {
        console.error("Erro ao verificar projeto:", error);
        setIsError(true);
      }
    }
  }, [projectId]);

  const handleAccessVerification = (code: string, email: string) => {
    // In a real application, this would validate against your database
    // to check if the provided email matches the project's client email
    
    // Simulate a database check
    const verifyAccess = () => {
      console.log('Verificando acesso com código:', code, 'e email:', email);
      
      // This would be an API call in a real app
      try {
        const storedProjects = localStorage.getItem('harmonIA_preview_projects');
        if (storedProjects) {
          const projects = JSON.parse(storedProjects);
          
          // First check if we have a decoded ID
          if (actualProjectId) {
            const project = projects.find((p: any) => p.id === actualProjectId);
            if (project) {
              console.log('Projeto encontrado para autorização:', project);
              return (email.toLowerCase() === project.clientEmail?.toLowerCase()) || 
                    (code === actualProjectId);
            }
          }
          
          // Then check for direct project ID
          const project = projects.find((p: any) => p.id === projectId);
          if (project) {
            console.log('Projeto encontrado para autorização (ID direto):', project);
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
          <p className="text-gray-600">O link que você acessou não existe ou expirou.</p>
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
