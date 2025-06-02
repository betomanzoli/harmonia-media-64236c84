// src/hooks/useClientPreview_v3.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logProjectHistory } from '@/utils/historyLogger'; // Import history logger

// Interfaces atualizadas
export interface ClientPreviewVersion {
  id: string;
  name: string;
  description?: string;
  embed_url?: string;
  audio_url?: string;
  original_bandcamp_url?: string;
  recommended: boolean;
  final?: boolean;
  created_at: string;
}

export interface ClientPreviewData {
  projectId: string;
  clientName: string;
  clientEmail: string;
  packageType: string;
  status: 'waiting' | 'feedback' | 'approved';
  versions: ClientPreviewVersion[];
  title: string;
  expirationDate?: string;
  feedback?: string;
  approved_version_id?: string; // <-- Novo campo para armazenar ID da versão aprovada
}

export const useClientPreview = (previewCode: string | undefined) => {
  const [previewData, setPreviewData] = useState<ClientPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    setIsAuthenticated(false);
    setPreviewData(null);

    try {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id, title, client_name, client_email, package_type, status, expires_at, feedback, approved_version_id') // <-- Inclui approved_version_id
        .eq('preview_code', previewCode)
        .maybeSingle();

      if (projectError) throw projectError;

      if (!project) {
        setError('Prévia não encontrada ou código inválido.');
        setIsLoading(false);
        return;
      }

      if (project.expires_at && new Date(project.expires_at) < new Date()) {
        setError('Esta prévia expirou.');
        setIsLoading(false);
        return;
      }

      setPreviewData({
        projectId: project.id,
        clientName: project.client_name || 'Cliente',
        clientEmail: project.client_email || '',
        packageType: project.package_type || 'essencial',
        status: (project.status as 'waiting' | 'feedback' | 'approved') || 'waiting',
        title: project.title || 'Projeto Musical',
        expirationDate: project.expires_at ? new Date(project.expires_at).toLocaleDateString('pt-BR') : undefined,
        feedback: project.feedback,
        approved_version_id: project.approved_version_id, // <-- Carrega ID aprovado
        versions: []
      });

    } catch (err: any) {
      console.error('Error loading preview project data:', err);
      setError(`Não foi possível carregar os dados da prévia: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [previewCode]);

  useEffect(() => {
    loadPreviewData();
  }, [loadPreviewData]);

  const loadVersions = async () => {
    if (!previewData || !isAuthenticated) return;

    setIsLoading(true);
    try {
      const { data: versions, error: versionsError } = await supabase
        .from('project_versions')
        .select('id, name, description, embed_url, audio_url, original_bandcamp_url, recommended, final, created_at')
        .eq('project_id', previewData.projectId)
        .order('created_at', { ascending: false });

      if (versionsError) {
        console.error('Error fetching versions:', versionsError);
        setError('Erro ao carregar versões.');
        return;
      }

      setPreviewData(prev => prev ? {
        ...prev,
        versions: (versions || []) as ClientPreviewVersion[]
      } : null);

    } catch (err: any) {
      console.error('Error loading versions:', err);
      setError(`Erro ao carregar versões: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const authenticateClient = async (emailInput: string) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      if (!previewData || !previewData.clientEmail) {
        setAuthError('Não foi possível verificar o email. Dados do projeto incompletos.');
        setIsAuthenticated(false);
        return false;
      }

      const formattedEmailInput = emailInput.trim().toLowerCase();
      const formattedStoredEmail = previewData.clientEmail.trim().toLowerCase();

      if (formattedEmailInput === formattedStoredEmail) {
        setIsAuthenticated(true);
        await loadVersions();
        return true;
      } else {
        setAuthError('Email não corresponde ao cadastrado para este projeto.');
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setAuthError('Ocorreu um erro durante a autenticação.');
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  // **Função de Feedback CORRIGIDA para incluir versão**
  const submitFeedback = async (feedbackText: string, versionId: string, versionName: string) => {
    if (!previewData || !isAuthenticated) {
      return { success: false, error: 'Autenticação necessária ou dados não carregados.' };
    }
    if (!feedbackText || feedbackText.trim().length === 0) {
      return { success: false, error: 'O campo de feedback não pode estar vazio.' };
    }
    if (!versionId) {
       return { success: false, error: 'Nenhuma versão selecionada para o feedback.' };
    }

    try {
      // Adiciona informação da versão ao feedback
      const feedbackWithVersion = `Feedback sobre a versão "${versionName}" (ID: ${versionId}):

${feedbackText.trim()}`;

      const { error } = await supabase
        .from('projects')
        .update({
          status: 'feedback',
          feedback: feedbackWithVersion, // Salva o feedback com info da versão
          updated_at: new Date().toISOString(),
          approved_version_id: null // Limpa aprovação anterior se houver
        })
        .eq('id', previewData.projectId);

      if (error) throw error;

      setPreviewData(prev => prev ? { ...prev, status: 'feedback', feedback: feedbackWithVersion, approved_version_id: null } : null);

      await logProjectHistory(previewData.projectId, 'feedback_received', {
        clientName: previewData.clientName,
        versionId: versionId,
        versionName: versionName,
        feedbackLength: feedbackText.trim().length
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      return { success: false, error: `Erro ao enviar feedback: ${error.message}` };
    }
  };

  // **Função de Aprovação CORRIGIDA para incluir versão**
  const approveVersion = async (versionId: string, versionName: string) => {
    if (!previewData || !isAuthenticated) {
      return { success: false, error: 'Autenticação necessária ou dados não carregados.' };
    }
     if (!versionId) {
       return { success: false, error: 'Nenhuma versão selecionada para aprovação.' };
    }

    try {
      const approvalFeedback = `Versão "${versionName}" (ID: ${versionId}) aprovada pelo cliente.`;

      const { error } = await supabase
        .from('projects')
        .update({
          status: 'approved',
          feedback: approvalFeedback, // Define um feedback padrão de aprovação
          approved_version_id: versionId, // <-- Salva o ID da versão aprovada
          updated_at: new Date().toISOString()
        })
        .eq('id', previewData.projectId);

      if (error) throw error;

      setPreviewData(prev => prev ? { ...prev, status: 'approved', feedback: approvalFeedback, approved_version_id: versionId } : null);

      await logProjectHistory(previewData.projectId, 'project_approved', {
        clientName: previewData.clientName,
        versionId: versionId,
        versionName: versionName
      });

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
    approveVersion,
    reloadPreviewData: loadPreviewData
  };
};

