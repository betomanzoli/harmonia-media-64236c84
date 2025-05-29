
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ClientProject {
  id: string;
  title: string;
  clientName: string;
  status: 'waiting' | 'feedback' | 'approved';
  expirationDate?: string;
  feedback?: string;
  versions: Array<{
    id: string;
    name: string;
    description?: string;
    audioUrl?: string;
    dateAdded: string;
    recommended?: boolean;
  }>;
}

export const useClientPreview = (previewCode: string) => {
  const [project, setProject] = useState<ClientProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (previewCode) {
      loadProject();
    }
  }, [previewCode]);

  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('preview_code', previewCode)
        .single();

      if (error) throw error;

      setProject({
        id: data.id,
        title: data.title,
        clientName: data.client_name,
        status: data.status as 'waiting' | 'feedback' | 'approved',
        expirationDate: data.expires_at,
        feedback: data.feedback,
        versions: data.versions as any[] || []
      });
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const authenticateClient = async (email: string) => {
    try {
      if (!project) return;

      const { data, error } = await supabase
        .from('projects')
        .select('client_email')
        .eq('id', project.id)
        .single();

      if (error) throw error;

      if (data.client_email === email) {
        setIsAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError('Email não encontrado para este projeto');
      }
    } catch (error) {
      setAuthError('Erro ao verificar email');
    }
  };

  const submitFeedback = async (feedback: string, email: string) => {
    try {
      if (!project) return false;

      const { error } = await supabase
        .from('projects')
        .update({ 
          feedback,
          status: 'feedback'
        })
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: "Feedback enviado",
        description: "Seu feedback foi registrado com sucesso.",
      });

      setProject(prev => prev ? { ...prev, feedback, status: 'feedback' } : null);
      return true;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o feedback.",
        variant: "destructive",
      });
      return false;
    }
  };

  const approveVersion = async (versionId: string, email: string) => {
    try {
      if (!project) return false;

      const { error } = await supabase
        .from('projects')
        .update({ status: 'approved' })
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: "Versão aprovada",
        description: "A versão foi aprovada com sucesso.",
      });

      setProject(prev => prev ? { ...prev, status: 'approved' } : null);
      return true;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível aprovar a versão.",
        variant: "destructive",
      });
      return false;
    }
  };

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
