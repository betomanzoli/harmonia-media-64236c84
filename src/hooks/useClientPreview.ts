import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Interface atualizada para usar embed_url
export interface ClientPreviewVersion {
  id: string;
  name: string;
  description?: string;
  embed_url: string; // <-- Espera embed_url
  original_bandcamp_url?: string;
  recommended: boolean;
  final?: boolean;
  created_at: string;
}

export interface ClientPreviewData {
  projectId: string;
  clientName: string;
  clientEmail: string; // <-- Adicionado para validação
  packageType: string;
  status: 'waiting' | 'feedback' | 'approved';
  versions: ClientPreviewVersion[]; // <-- Usa a interface atualizada
  title: string;
  expirationDate?: string;
  feedback?: string;
}

// Função auxiliar para registrar histórico (a ser implementada ou importada)
const logProjectHistory = async (projectId: string, actionType: string, details: any) => {
  console.log('[Log History Placeholder]', { projectId, actionType, details });
  // try {
  //   await supabase.from('project_history').insert({ project_id: projectId, action_type: actionType, details: details });
  // } catch (error) {
  //   console.error(`Error logging history (${actionType}):`, error);
  // }
};

export const useClientPreview = (previewCode: string | undefined) => {
  const [previewData, setPreviewData] = useState<ClientPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Autenticação baseada no email
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const loadPreviewData = useCallback(async () => {
    if (!previewCode) {
      setError('Código de prévia inválido.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAuthError(null);
    setIsAuthenticated(false); // Reseta autenticação ao carregar

    try {
      // Buscar projeto pelo preview_code
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id, title, client_name, client_email, package_type, status, expires_at, feedback') // Seleciona campos necessários
        .eq('preview_code', previewCode)
        .maybeSingle();

      if (projectError) throw projectError;

      if (!project) {
        setError('Prévia não encontrada ou código inválido.');
        return;
      }

      // Verificar expiração (opcional)
      if (project.expires_at && new Date(project.expires_at) < new Date()) {
        setError('Esta prévia expirou.');
        return;
      }

      // Buscar versões do projeto
      const { data: versions, error: versionsError } = await supabase
        .from('project_versions')
        .select('id, name, description, embed_url, original_bandcamp_url, recommended, final, created_at') // <-- Busca embed_url
        .eq('project_id', project.id)
        .order('created_at', { ascending: false });

      if (versionsError) {
        console.error('Error fetching versions:', versionsError);
        // Pode continuar mesmo com erro nas versões, mas avisa
        setError('Erro ao carregar versões, mas os detalhes do projeto foram encontrados.');
      }

      setPreviewData({
        projectId: project.id,
        clientName: project.client_name || 'Cliente',
        clientEmail: project.client_email || '', // <-- Armazena email para validação
        packageType: project.package_type || 'essencial',
        status: (project.status as 'waiting' | 'feedback' | 'approved') || 'waiting',
        title: project.title || 'Projeto Musical',
        expirationDate: project.expires_at ? new Date(project.expires_at).toLocaleDateString('pt-BR') : undefined,
        feedback: project.feedback,
        versions: (versions || []) as ClientPreviewVersion[]
      });

    } catch (err: any) {
      console.error('Error loading preview data:', err);
      setError(`Não foi possível carregar os dados da prévia: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [previewCode]);

  useEffect(() => {
    loadPreviewData();
  }, [loadPreviewData]);

  // **Função de Autenticação por Email**
  const authenticateClient = async (emailInput: string) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      if (!previewData || !previewData.clientEmail) {
        setAuthError('Não foi possível verificar o email. Dados do projeto incompletos.');
        return false;
      }

      const formattedEmailInput = emailInput.trim().toLowerCase();
      const formattedStoredEmail = previewData.clientEmail.trim().toLowerCase();

      if (formattedEmailInput === formattedStoredEmail) {
        setIsAuthenticated(true);
        return true;
      } else {
        setAuthError('Email não corresponde ao cadastrado para este projeto.');
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setAuthError('Ocorreu um erro durante a autenticação.');
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const submitFeedback = async (feedbackText: string) => {
    if (!previewData || !isAuthenticated) {
      console.warn('Submit feedback attempt without data or authentication.');
      return { success: false, error: 'Autenticação necessária ou dados não carregados.' };
    }

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          status: 'feedback',
          feedback: feedbackText,
          updated_at: new Date().toISOString()
        })
        .eq('id', previewData.projectId);

      if (error) throw error;

      // Atualiza estado local para refletir mudança
      setPreviewData(prev => prev ? { ...prev, status: 'feedback', feedback: feedbackText } : null);
      await logProjectHistory(previewData.projectId, 'feedback_received', { feedbackLength: feedbackText.length });

      return { success: true };
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      return { success: false, error: `Erro ao enviar feedback: ${error.message}` };
    }
  };

  const approveProject = async () => { // Renomeado de approveVersion para clareza
    if (!previewData || !isAuthenticated) {
      console.warn('Approve project attempt without data or authentication.');
      return { success: false, error: 'Autenticação necessária ou dados não carregados.' };
    }

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          status: 'approved',
          feedback: previewData.feedback || 'Projeto aprovado sem feedback adicional.', // Mantém feedback anterior ou adiciona nota
          updated_at: new Date().toISOString()
        })
        .eq('id', previewData.projectId);

      if (error) throw error;

      // Atualiza estado local
      setPreviewData(prev => prev ? { ...prev, status: 'approved' } : null);
      await logProjectHistory(previewData.projectId, 'project_approved', {});

      return { success: true };
    } catch (error: any) {
      console.error('Error approving project:', error);
      return { success: false, error: `Erro ao aprovar projeto: ${error.message}` };
    }
  };

  return {
    previewData,
    isLoading,
    error,
    isAuthenticated,
    isAuthenticating,
    authError,
    authenticateClient,
    submitFeedback,
    approveProject,
    reloadPreviewData: loadPreviewData // Expõe função para recarregar se necessário
  };
};

