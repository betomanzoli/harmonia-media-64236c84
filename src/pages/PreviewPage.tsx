
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { usePreviewData } from '@/hooks/use-preview-data';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import { getProjectIdFromPreviewLink } from '@/utils/previewLinkUtils';

const PreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const actualProjectId = projectId ? getProjectIdFromPreviewLink(projectId) : null;
  
  const { projectData, isLoading } = usePreviewData(actualProjectId || undefined);
  
  useEffect(() => {
    if (projectId && !isLoading) {
      if (!actualProjectId || !projectData) {
        toast({
          title: "Prévia não encontrada",
          description: "O código de prévia fornecido não é válido ou expirou.",
          variant: "destructive"
        });
      } else {
        // Log preview access for tracking
        console.log(`Visualização da prévia ${actualProjectId} registrada: ${new Date().toISOString()}`);
      }
    }
  }, [projectId, actualProjectId, projectData, isLoading, toast]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <MusicPreviewSystem projectId={actualProjectId} />
      </main>
      <Footer />
    </div>
  );
};

export default PreviewPage;
