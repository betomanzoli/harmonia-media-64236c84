
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import { useToast } from '@/hooks/use-toast';
import PublicLayout from '@/layouts/PublicLayout';

const MusicPreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Log preview access for analytics and monitoring
    console.log(`Cliente acessando prévia: ${projectId}, data: ${new Date().toISOString()}`);

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [projectId]);

  // Add protection against right-click to prevent audio downloads
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast({
        title: "Proteção de conteúdo",
        description: "O download direto das prévias não é permitido nesta fase.",
        variant: "destructive"
      });
      return false;
    };

    // Add protection against keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+S, Ctrl+U, F12
      if (
        (e.ctrlKey && (e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        toast({
          title: "Proteção de conteúdo",
          description: "Esta ação não é permitida na página de prévias.",
          variant: "destructive"
        });
        return false;
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-16">
      <MusicPreviewSystem projectId={projectId || ""} />
    </div>
  );
};

export default MusicPreviewPage;
