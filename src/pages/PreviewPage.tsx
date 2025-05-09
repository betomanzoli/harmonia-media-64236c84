
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import ProjectAccessForm from '@/components/previews/ProjectAccessForm';
import { useToast } from '@/hooks/use-toast';
import { checkPreviewAccessCookie, getPreviewEmailCookie } from '@/utils/authCookies';

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
      
      // Try all possible methods to check if already authenticated
      const isAuthenticated = checkPreviewAccessCookie(projectId);
      
      // Try alternate methods for cross-browser compatibility
      let authorized = isAuthenticated;
      
      if (!authorized) {
        try {
          // Try to check localStorage directly
          const hasAccess = localStorage.getItem(`preview_access_${projectId}`) === 'authorized';
          if (hasAccess) authorized = true;
        } catch (e) {
          console.error("Failed to check localStorage:", e);
        }
      }
      
      if (!authorized) {
        try {
          // Try to check sessionStorage as a fallback
          const hasAccess = sessionStorage.getItem(`preview_access_${projectId}`) === 'authorized';
          if (hasAccess) authorized = true;
        } catch (e) {
          console.error("Failed to check sessionStorage:", e);
        }
      }
      
      // Check for non-httpOnly cookies
      if (!authorized) {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
          const [key, value] = cookie.trim().split('=');
          if (key === `preview_access_${projectId}` && value === 'authorized') {
            authorized = true;
            break;
          }
        }
      }
      
      if (authorized) {
        console.log("User is already authorized for this project");
        setIsAuthorized(true);
        
        // Get email for analytics
        const email = getPreviewEmailCookie(projectId);
        if (email) {
          console.log(`Usuário autorizado: ${email}`);
        }
      } else {
        console.log("User needs to authenticate");
      }
    }
  }, [projectId]);

  const handleAccessVerification = (code: string, email: string) => {
    // Access is now validated in the ProjectAccessForm component
    setIsAuthorized(true);
    toast({
      title: "Acesso autorizado",
      description: "Bem-vindo à página de prévia do seu projeto.",
    });
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
