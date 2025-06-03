
// src/hooks/useClientPreview.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProjectVersion } from './admin/useProjects'; // Import updated interface
import { logProjectHistory } from '@/utils/historyLogger';

// Interface for the data returned by the hook
export interface ClientPreviewData {
  projectId: string;
  title: string;
  clientName: string;
  clientEmail: string; // Email is required for authentication
  packageType?: string | null;
  status: 'waiting' | 'feedback' | 'approved';
  versions: ClientPreviewVersion[];
  expirationDate?: string | null; // Formatted expiration date
  feedback?: string | null;
  approved_version_id?: string | null;
}

// Interface for versions specific to client preview (includes private link)
export interface ClientPreviewVersion extends Omit<ProjectVersion, 'project_id'> {
  // Inherits id, name, description, embed_url, audio_url, original_bandcamp_url,
  // bandcamp_private_url, recommended, final, created_at
}

export const useClientPreview = (previewCode: string | undefined) => {
  const [previewData, setPreviewData] = useState<ClientPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchPreviewData = useCallback(async () => {
    if (!previewCode) {
      setError("Código de prévia inválido.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Find project by preview_code
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*') // Select all project fields
        .eq('preview_code', previewCode)
        .single();

      if (projectError || !project) {
        throw new Error(projectError?.message || "Código de prévia não encontrado ou inválido.");
      }

      // Check expiration
      if (project.expires_at && new Date(project.expires_at) < new Date()) {
        throw new Error("Este link de prévia expirou.");
      }

      // 2. Fetch versions for this project (including the new private link field)
      const { data: versionsData, error: versionsError } = await supabase
        .from('project_versions')
        .select('*') // Select all version fields
        .eq('project_id', project.id)
        .order('created_at', { ascending: false });

      if (versionsError) {
        console.error("Error fetching versions:", versionsError);
        // Don't throw, maybe show a partial view? Or throw? Let's throw for now.
        throw new Error("Erro ao carregar as versões do projeto.");
      }

      // Format data for the hook's return value
      const formattedData: ClientPreviewData = {
        projectId: project.id,
        title: project.title,
        clientName: project.client_name,
        clientEmail: project.client_email, // Store the expected email
        packageType: project.package_type,
        status: project.status as 'waiting' | 'feedback' | 'approved',
        versions: (versionsData || []) as ClientPreviewVersion[],
        expirationDate: project.expires_at ? new Date(project.expires_at).toLocaleDateString('pt-BR') : null,
        feedback: project.feedback,
        approved_version_id: (project as any).approved_version_id || null, // Cast to any to handle missing type
      };

      setPreviewData(formattedData);

    } catch (err: any) {
      console.error("Error in fetchPreviewData:", err);
      setError(err.message || "Ocorreu um erro desconhecido.");
    } finally {
      setIsLoading(false); // Loading finished even if only project data loaded (auth needed for versions)
    }
  }, [previewCode]);

  // Fetch initial project data (without versions initially shown)
  useEffect(() => {
    fetchPreviewData();
  }, [fetchPreviewData]);

  // --- Authentication ---
  const authenticateClient = async (emailInput: string) => {
    if (!previewData) {
      setAuthError("Dados do projeto não carregados.");
      return;
    }
    if (!previewData.clientEmail) {
        setAuthError("Email do cliente não configurado para este projeto."); // Security check
        return;
    }

    setIsAuthenticating(true);
    setAuthError(null);

    // Simple email comparison (case-insensitive)
    if (emailInput.trim().toLowerCase() === previewData.clientEmail.toLowerCase()) {
      setIsAuthenticated(true);
      // Optionally fetch versions again here if they weren't fetched initially
      // or simply allow the UI to display the already fetched versions.
    } else {
      setAuthError("Email incorreto. Verifique o email fornecido.");
      setIsAuthenticated(false);
    }
    setIsAuthenticating(false);
  };

  // --- Actions (Feedback / Approval) ---
  const submitFeedback = async (feedbackText: string, versionId: string, versionName: string) => {
    if (!isAuthenticated || !previewData) return { success: false, error: "Não autenticado." };

    try {
      // Update project status and feedback field
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          feedback: feedbackText,
          status: 'feedback', // Set status to feedback
          updated_at: new Date().toISOString(),
          approved_version_id: null // Clear approval if giving new feedback
        })
        .eq('id', previewData.projectId);

      if (updateError) throw updateError;

      // Log history
      await logProjectHistory(previewData.projectId, 'client_feedback_received', {
        versionId: versionId,
        versionName: versionName,
        feedbackSnippet: feedbackText.substring(0, 50) + (feedbackText.length > 50 ? '...' : '')
      }); // No user ID for client actions

      // Update local state to reflect change immediately
      setPreviewData(prev => prev ? { ...prev, status: 'feedback', feedback: feedbackText, approved_version_id: null } : null);

      return { success: true };
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      return { success: false, error: error.message || "Erro ao enviar feedback." };
    }
  };

  const approveVersion = async (versionId: string, versionName: string) => {
    if (!isAuthenticated || !previewData) return { success: false, error: "Não autenticado." };

    try {
      // Update project status and approved version ID
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          status: 'approved',
          approved_version_id: versionId,
          feedback: `Versão "${versionName}" aprovada pelo cliente.`, // Add an approval note to feedback
          updated_at: new Date().toISOString()
        })
        .eq('id', previewData.projectId);

      if (updateError) throw updateError;

      // Log history
      await logProjectHistory(previewData.projectId, 'client_version_approved', {
        versionId: versionId,
        versionName: versionName
      }); // No user ID for client actions

      // Update local state
      setPreviewData(prev => prev ? { ...prev, status: 'approved', approved_version_id: versionId, feedback: `Versão "${versionName}" aprovada pelo cliente.` } : null);

      return { success: true };
    } catch (error: any) {
      console.error("Error approving version:", error);
      return { success: false, error: error.message || "Erro ao aprovar versão." };
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
    approveVersion
  };
};
