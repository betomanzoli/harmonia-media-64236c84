
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import { useToast } from '@/hooks/use-toast';
import { getProjectIdFromPreviewLink } from '@/utils/previewLinkUtils';

const MusicPreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const [isError, setIsError] = useState(false);
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);

  useEffect(() => {
    // Log preview access for analytics and monitoring
    if (projectId) {
      console.log(`Cliente acessando prévia: ${projectId}, data: ${new Date().toISOString()}`);
      window.scrollTo(0, 0);
      
      // First check if this is an encoded link (should have a dash)
      const isEncodedLink = projectId.includes('-');
      
      // If it's not an encoded link, reject it immediately
      if (!isEncodedLink) {
        console.log("Rejecting direct project ID access in MusicPreviewPage:", projectId);
        setIsError(true);
        return;
      }
      
      // Try to decode the encoded link
      const decodedId = getProjectIdFromPreviewLink(projectId);
      console.log("MusicPreviewPage - Decoded project ID:", decodedId);
      
      // If decoding failed or returned null, reject access
      if (!decodedId) {
        console.log("MusicPreviewPage - Invalid encoded link format:", projectId);
        setIsError(true);
        return;
      }
      
      // Set the actual project ID for use in the MusicPreviewSystem
      setActualProjectId(decodedId);
      
      // Check if project exists (could be expanded)
      try {
        const storedProjects = localStorage.getItem('harmonIA_preview_projects');
        if (storedProjects) {
          const projects = JSON.parse(storedProjects);
          const projectExists = projects.some((p: any) => p.id === decodedId);
          if (!projectExists) {
            console.log("MusicPreviewPage - Project not found for decoded ID:", decodedId);
            setIsError(true);
          }
        } else {
          console.log("MusicPreviewPage - No projects in localStorage");
          setIsError(true);
        }
      } catch (error) {
        console.error("MusicPreviewPage - Error verifying project:", error);
        setIsError(true);
      }
    }
  }, [projectId]);

  if (!projectId || isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-black mb-4">ID do projeto não encontrado</h2>
          <p className="text-black">O código de prévia fornecido não é válido. Por favor, use o link codificado enviado pelo administrador.</p>
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
