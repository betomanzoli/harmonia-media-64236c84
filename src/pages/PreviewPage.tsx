
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';

const PreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!projectId) {
      toast({
        title: "Prévia não encontrada",
        description: "O código de prévia fornecido não é válido ou expirou.",
        variant: "destructive"
      });
    } else {
      // Log preview access for tracking
      console.log(`Visualização da prévia ${projectId} registrada: ${new Date().toISOString()}`);
    }
  }, [projectId, toast]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <MusicPreviewSystem projectId={projectId || ""} />
      </main>
      <Footer />
    </div>
  );
};

export default PreviewPage;
