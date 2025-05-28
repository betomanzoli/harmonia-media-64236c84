
import { useState, useEffect } from 'react';
import { dbOperations, clientAuth } from '@/lib/supabase/index';
import { useToast } from '@/hooks/use-toast';

export interface ClientProject {
  id: string;
  title: string;
  clientName: string;
  status: 'waiting' | 'feedback' | 'approved';
  versions: Array<{
    id: string;
    name: string;
    description: string;
    audioUrl: string;
    fileId?: string;
    recommended: boolean;
    dateAdded: string;
    final?: boolean;
  }>;
  feedback?: string;
  expirationDate?: string;
}

export const useClientPreview = (previewCode: string) => {
  const [project, setProject] = useState<ClientProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();

  // Autenticar acesso do cliente
  const authenticateClient = async (email: string) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      console.log('Authenticating client access:', { previewCode, email });
      
      const validatedProject = await clientAuth.validatePreviewAccess(previewCode, email);
      
      const formattedProject: ClientProject = {
        id: validatedProject.id,
        title: validatedProject.title || 'Projeto Musical',
        clientName: validatedProject.client_name,
        status: validatedProject.status as 'waiting' | 'feedback' | 'approved',
        versions: validatedProject.project_versions?.map((v: any) => ({
          id: v.id,
          name: v.name,
          description: v.description || '',
          audioUrl: v.audio_url || '',
          fileId: v.file_id,
          recommended: v.recommended || false,
          dateAdded: new Date(v.created_at).toLocaleDateString('pt-BR'),
          final: v.name?.includes('FINAL') || false
        })) || [],
        feedback: validatedProject.feedback,
        expirationDate: validatedProject.expires_at ? 
          new Date(validatedProject.expires_at).toLocaleDateString('pt-BR') : undefined
      };
      
      setProject(formattedProject);
      setIsAuthenticated(true);
      
      // Salvar autenticação no localStorage para esta sessão
      localStorage.setItem(`auth_${previewCode}`, email);
      
      toast({
        title: "Acesso autorizado",
        description: `Bem-vindo, ${validatedProject.client_name}!`
      });
      
    } catch (error: any) {
      console.error('Authentication error:', error);
      setAuthError(error.message || 'Erro de autenticação');
      setIsAuthenticated(false);
      
      toast({
        title: "Erro de acesso",
        description: error.message || 'Não foi possível verificar seu acesso.',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Enviar feedback
  const submitFeedback = async (feedback: string, userEmail: string) => {
    if (!project || !isAuthenticated) return false;
    
    try {
      console.log('Submitting feedback:', { projectId: project.id, feedback });
      
      await dbOperations.addFeedback(project.id, feedback, userEmail);
      
      // Atualizar projeto local
      setProject(prev => prev ? {
        ...prev,
        status: 'feedback',
        feedback
      } : null);
      
      toast({
        title: "Feedback enviado",
        description: "Seu feedback foi registrado com sucesso!"
      });
      
      return true;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Erro ao enviar feedback",
        description: "Não foi possível registrar seu feedback.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Aprovar versão
  const approveVersion = async (versionId: string, userEmail: string) => {
    if (!project || !isAuthenticated) return false;
    
    try {
      console.log('Approving version:', { projectId: project.id, versionId });
      
      await dbOperations.updateProject(project.id, {
        status: 'approved'
      });
      
      // Registrar aprovação no feedback
      await dbOperations.addFeedback(
        project.id, 
        `Versão aprovada: ${project.versions.find(v => v.id === versionId)?.name || versionId}`,
        userEmail
      );
      
      // Atualizar projeto local
      setProject(prev => prev ? {
        ...prev,
        status: 'approved'
      } : null);
      
      toast({
        title: "Versão aprovada",
        description: "A versão foi aprovada com sucesso!"
      });
      
      return true;
    } catch (error) {
      console.error('Error approving version:', error);
      toast({
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar a versão.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Verificar autenticação existente na inicialização
  useEffect(() => {
    const savedEmail = localStorage.getItem(`auth_${previewCode}`);
    if (savedEmail) {
      authenticateClient(savedEmail);
    } else {
      setIsLoading(false);
    }
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
