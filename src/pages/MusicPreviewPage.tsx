
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import { useToast } from '@/hooks/use-toast';
import { getProjectIdFromPreviewLink, isValidEncodedPreviewLink } from '@/utils/previewLinkUtils';
import { supabase } from '@/integrations/supabase/client';

const MusicPreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Log preview access for analytics and monitoring
    if (projectId) {
      console.log(`Cliente acessando prévia: ${projectId}, data: ${new Date().toISOString()}`);
      setIsLoading(true);
      
      // Check if this is a direct or encoded link
      const isEncodedLink = isValidEncodedPreviewLink(projectId);
      console.log("Is encoded preview link:", isEncodedLink);
      
      // For backwards compatibility, we still support direct project IDs
      // but only when accessed by admin users
      const isAdmin = localStorage.getItem('admin_preview_access') === 'true';
      
      if (!isEncodedLink && !isAdmin) {
        console.log("Direct link access denied - only encoded links are allowed for clients");
        setIsError(true);
        setIsLoading(false);
        return;
      }
      
      // Process encoded link or direct link (admin only)
      let decodedId: string | null = null;
      
      if (isEncodedLink) {
        decodedId = getProjectIdFromPreviewLink(projectId);
        console.log("Decoded project ID:", decodedId);
        
        if (!decodedId) {
          console.log("Failed to decode project ID");
          setIsError(true);
          setIsLoading(false);
          return;
        }
      } else if (isAdmin) {
        // Direct access for admins
        decodedId = projectId;
      }
      
      setActualProjectId(decodedId);
      
      // Verify project exists
      verifyProjectExists(decodedId);
      
      window.scrollTo(0, 0);
    }
  }, [projectId]);

  // Function to verify project exists in localStorage or Supabase
  const verifyProjectExists = async (projectId: string | null) => {
    if (!projectId) {
      setIsError(true);
      setIsLoading(false);
      return;
    }
    
    try {
      // First check localStorage
      const storedProjects = localStorage.getItem('harmonIA_preview_projects');
      
      if (storedProjects) {
        const projects = JSON.parse(storedProjects);
        const projectExists = projects.some((p: any) => p.id === projectId);
        
        if (projectExists) {
          console.log("Project found in localStorage:", projectId);
          setIsError(false);
          setIsLoading(false);
          return;
        }
      }
      
      // If not found in localStorage, check Supabase
      console.log("Project not found in localStorage, checking Supabase");
      const { data, error } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .maybeSingle();
        
      if (error) {
        console.error("Error checking project in Supabase:", error);
        setIsError(true);
        setIsLoading(false);
        return;
      }
      
      if (data) {
        console.log("Project found in Supabase:", data);
        setIsError(false);
      } else {
        console.log("Project not found in Supabase");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error verifying project:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!projectId || isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Link de prévia inválido</h2>
          <p className="text-gray-700">O código de prévia fornecido não é válido ou expirou.</p>
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

  return (
    <div className="min-h-screen bg-gray-100 pt-8 pb-16">
      <MusicPreviewSystem projectId={actualProjectId || projectId} />
    </div>
  );
};

export default MusicPreviewPage;
