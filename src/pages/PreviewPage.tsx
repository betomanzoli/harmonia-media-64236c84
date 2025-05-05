
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import ProjectAccessForm from '@/components/previews/ProjectAccessForm';
import { useToast } from '@/hooks/use-toast';
import { getProjectIdFromPreviewLink, isValidEncodedPreviewLink } from '@/utils/previewLinkUtils';
import { supabase } from '@/integrations/supabase/client';

const PreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);

  useEffect(() => {
    // Log access for analytics
    if (projectId) {
      console.log(`Preview access attempt: ${projectId}, Date: ${new Date().toISOString()}`);
      window.scrollTo(0, 0);
      setIsLoading(true);
      
      // Validate if this is an encoded preview link
      const isEncodedLink = isValidEncodedPreviewLink(projectId);
      console.log("Is encoded preview link:", isEncodedLink);
      
      if (!isEncodedLink) {
        console.log("Invalid link format - not an encoded preview link");
        setIsError(true);
        setIsLoading(false);
        return;
      }
      
      // Decode the project ID
      const decodedId = getProjectIdFromPreviewLink(projectId);
      console.log("Decoded project ID:", decodedId);
      
      if (!decodedId) {
        console.log("Failed to decode project ID");
        setIsError(true);
        setIsLoading(false);
        return;
      }
      
      // Set the actual project ID and attempt to find the project
      setActualProjectId(decodedId);
      
      verifyProjectAccess(decodedId, projectId);
    }
  }, [projectId]);

  // Function to verify project access first in localStorage then in Supabase
  const verifyProjectAccess = async (decodedId: string, encodedId: string) => {
    let projectExists = false;
    
    try {
      // First check localStorage
      const storedProjects = localStorage.getItem('harmonIA_preview_projects');
      console.log('Projects in localStorage:', storedProjects ? 'Found' : 'Not found');
      
      if (storedProjects) {
        const projects = JSON.parse(storedProjects);
        
        // Check if project exists in localStorage
        projectExists = projects.some((p: any) => p.id === decodedId);
        
        if (projectExists) {
          console.log("Project found in localStorage:", decodedId);
          handleAuthorizationCheck(encodedId);
          return;
        }
      }
      
      // If not found in localStorage, check Supabase
      console.log("Project not found in localStorage, checking Supabase");
      
      const { data: projectFromSupabase, error } = await supabase
        .from('projects')
        .select('id')
        .eq('id', decodedId)
        .maybeSingle();
        
      if (error) {
        console.error('Error checking project in Supabase:', error);
        setIsError(true);
        setIsLoading(false);
        return;
      }
      
      if (projectFromSupabase) {
        console.log("Project found in Supabase:", projectFromSupabase);
        projectExists = true;
        handleAuthorizationCheck(encodedId);
        return;
      }
      
      // Project not found in either location
      console.log("Project not found in Supabase or localStorage");
      setIsError(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error verifying project:", error);
      setIsError(true);
      setIsLoading(false);
    }
  };
  
  // Check authorization based on admin status or previous authorization
  const handleAuthorizationCheck = (encodedId: string) => {
    // Check if admin access or previously authorized
    const isAdmin = localStorage.getItem('admin_preview_access') === 'true';
    const isPreviouslyAuthorized = localStorage.getItem(`preview_auth_${encodedId}`) === 'authorized';
    
    if (isAdmin || isPreviouslyAuthorized) {
      console.log("User is authorized (admin or previously authorized)");
      setIsAuthorized(true);
      setIsError(false);
    } else {
      // Not authorized, but the project exists - show auth form
      console.log("Project exists but user is not authorized - showing auth form");
      setIsError(false);
    }
    
    setIsLoading(false);
  };

  const handleAccessVerification = async (code: string, email: string) => {
    console.log('Verifying access with code:', code, 'and email:', email);
    
    if (!actualProjectId) {
      toast({
        title: "Erro de verificação",
        description: "Não foi possível verificar o acesso. Tente novamente.",
        variant: "destructive"
      });
      return;
    }
    
    // Try to verify access using Supabase
    try {
      // Check if the email matches the client's email
      const { data: clientData, error: clientError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', actualProjectId)
        .maybeSingle();
        
      if (clientError && clientError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching client data for verification:', clientError);
      }
      
      // Also check against the project preview_code if available
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('preview_code, client_id')
        .eq('id', actualProjectId)
        .maybeSingle();
        
      if (projectError) {
        console.error('Error fetching project data for verification:', projectError);
      }
      
      // If we have a client ID from the project, try to get their email
      let clientEmail = clientData?.email;
      if (!clientEmail && projectData?.client_id) {
        const { data: projectClientData } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', projectData.client_id)
          .maybeSingle();
          
        clientEmail = projectClientData?.email;
      }
      
      const isEmailValid = clientEmail && email.toLowerCase() === clientEmail.toLowerCase();
      const isCodeValid = projectData?.preview_code && code === projectData.preview_code;
      
      // For demo purposes, also allow test/demo emails
      const isTestEmail = email.includes('@') && (
        email.toLowerCase().includes('test') || 
        email.toLowerCase().includes('demo')
      );
      
      const isAuthorized = isEmailValid || isCodeValid || isTestEmail;
      
      if (isAuthorized) {
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
    } catch (error) {
      console.error('Error in access verification:', error);
      toast({
        title: "Erro de verificação",
        description: "Ocorreu um erro ao verificar suas credenciais. Por favor, tente novamente.",
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Carregando prévia...</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
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
