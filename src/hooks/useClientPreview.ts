
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ClientPreviewData {
  projectId: string;
  clientName: string;
  packageType: string;
  status: 'waiting' | 'feedback' | 'approved';
  versions: Array<{
    id: string;
    name: string;
    bandcampUrl?: string;
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
      if (!previewCode) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Buscar projeto pelo preview_code
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('preview_code', previewCode)
          .maybeSingle();

        if (projectError) {
          console.error('Error fetching project:', projectError);
          setError('Erro ao carregar projeto');
          return;
        }

        if (!project) {
          setError('Preview não encontrado');
          return;
        }

        // Buscar versões do projeto
        const { data: versions, error: versionsError } = await supabase
          .from('project_versions')
          .select('*')
          .eq('project_id', project.id)
          .order('created_at', { ascending: false });

        if (versionsError) {
          console.error('Error fetching versions:', versionsError);
        }

        const formattedVersions = (versions || []).map(version => ({
          id: version.id,
          name: version.name,
          bandcampUrl: version.audio_url || '',
          recommended: version.recommended || false,
          description: version.description,
          dateAdded: new Date(version.created_at).toLocaleDateString('pt-BR')
        }));

        setPreviewData({
          projectId: project.id,
          clientName: project.client_name || 'Cliente',
          packageType: project.package_type || 'essencial',
          status: (project.status as 'waiting' | 'feedback' | 'approved') || 'waiting',
          title: project.title || 'Projeto Musical',
          expirationDate: project.expires_at ? new Date(project.expires_at).toLocaleDateString('pt-BR') : undefined,
          feedback: project.feedback,
          versions: formattedVersions
        });
        
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error loading preview data:', err);
        setError('Não foi possível carregar os dados da prévia.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPreviewData();
  }, [previewCode]);

  const authenticateClient = async (email: string) => {
    try {
      if (!email || !email.includes('@')) {
        setAuthError('Email inválido');
        return false;
      }

      setIsAuthenticated(true);
      setAuthError(null);
      return true;
    } catch (error) {
      setAuthError('Erro na autenticação');
      return false;
    }
  };

  const submitFeedback = async (feedback: string, email: string) => {
    if (!previewData) return false;

    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          status: 'feedback',
          feedback: feedback,
          updated_at: new Date().toISOString()
        })
        .eq('id', previewData.projectId);

      if (error) throw error;

      setPreviewData(prev => prev ? {
        ...prev,
        status: 'feedback',
        feedback: feedback
      } : null);

      return true;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return false;
    }
  };

  const approveVersion = async (versionId: string, email: string) => {
    if (!previewData) return false;

    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', previewData.projectId);

      if (error) throw error;

      setPreviewData(prev => prev ? {
        ...prev,
        status: 'approved'
      } : null);

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
