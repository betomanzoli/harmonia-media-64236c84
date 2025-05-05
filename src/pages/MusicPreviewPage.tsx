
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import { useToast } from '@/hooks/use-toast';
import { getProjectIdFromPreviewLink, isValidEncodedPreviewLink } from '@/utils/previewLinkUtils';

const MusicPreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Log preview access for analytics and monitoring
    if (projectId) {
      console.log(`Cliente acessando prévia: ${projectId}, data: ${new Date().toISOString()}`);
      
      // Check if this is a direct or encoded link
      const isEncodedLink = isValidEncodedPreviewLink(projectId);
      console.log("Is encoded preview link:", isEncodedLink);
      
      // For backwards compatibility, we still support direct project IDs
      // but only when accessed by admin users
      const isAdmin = localStorage.getItem('admin_preview_access') === 'true';
      
      if (!isEncodedLink && !isAdmin) {
        console.log("Direct link access denied - only encoded links are allowed for clients");
        setIsError(true);
        return;
      }
      
      // Process encoded link or direct link (admin only)
      if (isEncodedLink) {
        const decodedId = getProjectIdFromPreviewLink(projectId);
        console.log("Decoded project ID:", decodedId);
        
        if (decodedId) {
          setActualProjectId(decodedId);
        } else {
          console.log("Failed to decode project ID");
          setIsError(true);
        }
      } else if (isAdmin) {
        // Direct access for admins
        setActualProjectId(projectId);
      }
      
      window.scrollTo(0, 0);
    }
  }, [projectId, toast]);

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

  return (
    <div className="min-h-screen bg-gray-100 pt-8 pb-16">
      <MusicPreviewSystem projectId={actualProjectId || projectId} />
    </div>
  );
};

export default MusicPreviewPage;
