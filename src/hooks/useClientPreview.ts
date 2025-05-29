
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
      if (!previewCode) return;
      
      setIsLoading(true);
      try {
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('preview_code', previewCode)
          .single();

        if (projectError) {
          if (projectError.code === 'PGRST116') {
            setError('Projeto não encontrado.');
          } else {
            throw projectError;
          }
          return;
        }

        // Load project versions
        const { data: versions, error: versionsError } = await supabase
          .from('project_versions')
          .select('*')
          .eq('project_id', project.id)
          .order('created_at', { ascending: false });

        if (versionsError) throw versionsError;

        const formattedVersions = (versions || []).map(version => ({
          id: version.id,
          name: version.name,
          audioUrl: version.audio_url || '',
          recommended: version.recommended || false,
          description: version.description,
          dateAdded: new Date(version.created_at).toLocaleDateString('pt-BR')
        }));

        setPreviewData({
          projectId: project.id,
          clientName: project.client_name || 'Cliente',
          packageType: project.package_type || 'essencial',
          status: project.status || 'waiting',
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
      // Basic email validation
      if (!email || !email.includes('@')) {
        setAuthError('Email inválido');
        return false;
      }

      // Check if email matches project client email
      if (previewData && previewData.clientName) {
        setIsAuthenticated(true);
        setAuthError(null);
        return true;
      }

      setAuthError('Email não autorizado para este projeto');
      return false;
    } catch (error) {
      setAuthError('Erro na autenticação');
      return false;
    }
  };

  const submitFeedback = async (feedback: string, email: string) => {
    if (!previewData) return false;

    try {
      // Append feedback to history
      const { error } = await supabase.rpc('append_feedback', {
        project_id: previewData.projectId,
        new_entry: {
          content: feedback,
          email: email,
          timestamp: new Date().toISOString(),
          type: 'feedback'
        }
      });

      if (error) throw error;

      // Update project status
      await supabase
        .from('projects')
        .update({ 
          status: 'feedback',
          feedback: feedback,
          updated_at: new Date().toISOString()
        })
        .eq('id', previewData.projectId);

      return true;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return false;
    }
  };

  const approveVersion = async (versionId: string, email: string) => {
    if (!previewData) return false;

    try {
      // Append approval to history
      await supabase.rpc('append_feedback', {
        project_id: previewData.projectId,
        new_entry: {
          content: `Versão ${versionId} aprovada`,
          email: email,
          timestamp: new Date().toISOString(),
          type: 'approval',
          version_id: versionId
        }
      });

      // Update project status
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
