
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import { useToast } from '@/hooks/use-toast';

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

    document.addEventListener("contextmenu", handleContextMenu);
    
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [toast]);

  return (
    <div className="min-h-screen pt-20">
      <MusicPreviewSystem />
    </div>
  );
};

export default MusicPreviewPage;
