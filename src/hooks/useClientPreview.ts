
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
    description?: string;
    dateAdded: string;
  }>;
  title: string;
  expirationDate?: string;
  feedback?: string;
}

export const useClientPreview = (previewCode: string) => {
  const [previewData, setPreviewData] = useState<ClientPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

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
          title: 'Projeto Musical - João Silva',
          expirationDate: '20/02/2024',
          versions: [
            {
              id: 'v1',
              name: 'Versão 1',
              audioUrl: 'https://example.com/audio1.mp3',
              recommended: true,
              description: 'Primeira versão do projeto',
              dateAdded: '20/01/2024'
            }
          ]
        });
        setIsAuthenticated(true);
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

  const authenticateClient = async (email: string) => {
    try {
      // Mock authentication
      console.log('Authenticating client:', email);
      setIsAuthenticated(true);
      setAuthError(null);
      return true;
    } catch (error) {
      setAuthError('Erro na autenticação');
      return false;
    }
  };

  const submitFeedback = async (feedback: string, email: string) => {
    try {
      // Mock submit
      console.log('Feedback submitted:', { feedback, email });
      return true;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return false;
    }
  };

  const approveVersion = async (versionId: string, email: string) => {
    try {
      // Mock approve
      console.log('Version approved:', { versionId, email });
      if (previewData) {
        setPreviewData({
          ...previewData,
          status: 'approved'
        });
      }
      return true;
    } catch (error) {
      console.error('Error approving version:', error);
      return false;
    }
  };

  return {
    project: previewData,
    previewData,
    isLoading,
    error,
    isAuthenticated,
    authError,
    authenticateClient,
    submitFeedback,
    approveVersion
  };
};
