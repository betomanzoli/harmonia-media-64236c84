
import { useState, useEffect } from 'react';

export interface ClientPreviewData {
  projectId: string;
  clientName: string;
  packageType: string;
  status: 'waiting' | 'feedback' | 'approved';
  versions: Array<{
    id: string;
    name: string;
    audioUrl: string;
    recommended: boolean;
  }>;
}

export const useClientPreview = (previewCode: string) => {
  const [previewData, setPreviewData] = useState<ClientPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPreviewData = async () => {
      setIsLoading(true);
      try {
        // Mock data temporário
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setPreviewData({
          projectId: 'P0001',
          clientName: 'João Silva',
          packageType: 'essencial',
          status: 'waiting',
          versions: []
        });
      } catch (err) {
        setError('Não foi possível carregar os dados da prévia.');
      } finally {
        setIsLoading(false);
      }
    };

    if (previewCode) {
      loadPreviewData();
    }
  }, [previewCode]);

  const submitFeedback = async (feedback: string, approved: boolean) => {
    try {
      // Mock submit
      console.log('Feedback submitted:', { feedback, approved });
      return true;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return false;
    }
  };

  return {
    previewData,
    isLoading,
    error,
    submitFeedback
  };
};
