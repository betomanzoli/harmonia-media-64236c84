
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PreviewProject {
  id: string;
  title: string;
  clientName: string;
  status: string;
  expirationDate?: string;
  feedback?: string;
  versions: Array<{
    id: string;
    name: string;
    audioUrl?: string;
    description?: string;
    recommended?: boolean;
    dateAdded: string;
  }>;
}

export const useClientPreview = (previewCode: string) => {
  const [project, setProject] = useState<PreviewProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const authenticateClient = async (email: string) => {
    try {
      setAuthError(null);
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('preview_code', previewCode)
        .eq('client_email', email)
        .single();

      if (error || !data) {
        setAuthError('Email não autorizado para este projeto');
        return;
      }

      setIsAuthenticated(true);
      
      // Transform project data
      const transformedProject: PreviewProject = {
        id: data.id,
        title: data.title || 'Projeto harmonIA',
        clientName: data.client_name || 'Cliente',
        status: data.status || 'waiting',
        expirationDate: data.expires_at ? new Date(data.expires_at).toLocaleDateString('pt-BR') : undefined,
        feedback: data.feedback,
        versions: Array.isArray(data.versions) ? data.versions : []
      };
      
      setProject(transformedProject);
    } catch (error) {
      console.error('Erro na autenticação:', error);
      setAuthError('Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitFeedback = async (feedback: string, email: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          feedback,
          status: 'feedback'
        })
        .eq('preview_code', previewCode)
        .eq('client_email', email);

      if (error) throw error;
      
      // Update local state
      if (project) {
        setProject({
          ...project,
          feedback,
          status: 'feedback'
        });
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      return false;
    }
  };

  const approveVersion = async (versionId: string, email: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'approved' })
        .eq('preview_code', previewCode)
        .eq('client_email', email);

      if (error) throw error;
      
      // Update local state
      if (project) {
        setProject({
          ...project,
          status: 'approved'
        });
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao aprovar versão:', error);
      return false;
    }
  };

  useEffect(() => {
    if (!previewCode) {
      setIsLoading(false);
      return;
    }
    
    // Initial load without authentication
    setIsLoading(false);
  }, [previewCode]);

  return {
    project,
    isLoading,
    isAuthenticated,
    authError,
    authenticateClient,
    submitFeedback,
    approveVersion
  };
};
