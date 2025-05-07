
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import ProjectAccessForm from '@/components/previews/ProjectAccessForm';
import { useToast } from '@/hooks/use-toast';
import { getProjectIdFromPreviewLink, isValidEncodedPreviewLink, decodePreviewCode } from '@/utils/previewLinkUtils';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { getCookie } from '@/components/previews/access/useProjectAccess';

// Force dynamic content to prevent caching
export const dynamic = 'force-dynamic';

const PreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to sign in anonymously for better RLS support
        await supabase.auth.signInAnonymously();
        console.log('[PreviewPage] Anonymous auth successful');
      } catch (error) {
        console.warn('[PreviewPage] Anonymous auth failed - continuing without it:', error);
        // Continue anyway - this is just to improve RLS behavior
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    // Log preview access for analytics and monitoring
    if (projectId) {
      console.log(`Cliente acessando prévia: ${projectId}, data: ${new Date().toISOString()}`);
      setIsLoading(true);
      
      // Browser detection for debugging
      const isPrivate = !window.localStorage;
      console.log("[PreviewPage] Browser context:", isPrivate ? "private/incognito" : "normal");
      
      // Try to decode the preview code from the URL
      const decodedCode = decodePreviewCode(`/preview/${projectId}`);
      console.log("[PreviewPage] Decoded preview code:", decodedCode);
      
      // Check if this is a direct or encoded link
      const isEncodedLink = isValidEncodedPreviewLink(projectId);
      console.log("[PreviewPage] Is encoded preview link:", isEncodedLink);
      console.log("[PreviewPage] Token recebido:", projectId);
      
      // For backwards compatibility, we still support direct project IDs
      // but only when accessed by admin users
      const isAdmin = getCookie('admin_preview_access') === 'true';
      
      if (!isEncodedLink && !isAdmin) {
        console.log("[PreviewPage] Direct link access denied - only encoded links are allowed for clients");
        setIsError(true);
        setErrorDetails("Link de prévia inválido ou expirado.");
        setIsLoading(false);
        return;
      }
      
      // Process encoded link or direct link (admin only)
      let decodedId: string | null = null;
      
      if (isEncodedLink) {
        decodedId = getProjectIdFromPreviewLink(projectId);
        console.log("[PreviewPage] Decoded project ID:", decodedId);
        
        if (!decodedId) {
          console.log("[PreviewPage] Failed to decode project ID");
          setIsError(true);
          setErrorDetails("Não foi possível decodificar o link de prévia.");
          setIsLoading(false);
          return;
        }
      } else if (isAdmin) {
        // Direct access for admins
        decodedId = projectId;
      }
      
      setActualProjectId(decodedId);
      
      // Verify project exists and check authorization
      verifyProjectExists(decodedId);
      
      window.scrollTo(0, 0);
    }
  }, [projectId]);

  // Function to verify project exists in Supabase
  const verifyProjectExists = async (projectId: string | null) => {
    if (!projectId) {
      setIsError(true);
      setIsLoading(false);
      setErrorDetails("ID do projeto não fornecido.");
      return;
    }
    
    try {
      console.log("[PreviewPage] Verificando projeto:", projectId);
      
      // First check if there's a preview code match in Supabase
      const { data: previewData, error: previewError } = await supabase
        .from('projects')
        .select('id, client_id, preview_code, project_files(*)')
        .eq('preview_code', projectId)
        .maybeSingle();
      
      console.log("[PreviewPage] Consulta por preview_code:", { previewData, previewError });
      
      if (previewData) {
        console.log("[PreviewPage] Project found by preview_code:", previewData);
        console.log("[PreviewPage] Project files:", previewData.project_files);
        setDebugInfo(prev => ({ ...prev, projectData: previewData }));
        
        // Check if user is authorized or needs to enter credentials
        handleAuthorizationCheck(projectId);
        return;
      }
      
      // Next check by ID in Supabase
      const { data, error } = await supabase
        .from('projects')
        .select('id, client_id, preview_code, project_files(*)')
        .eq('id', projectId)
        .maybeSingle();
        
      console.log("[PreviewPage] Consulta por ID direto:", { data, error });
      
      if (error) {
        console.error("[PreviewPage] Error checking project in Supabase:", error);
        setDebugInfo(prev => ({ ...prev, supabaseError: error }));
      } else if (data) {
        console.log("[PreviewPage] Project found by ID:", data);
        console.log("[PreviewPage] Project files:", data.project_files);
        setDebugInfo(prev => ({ ...prev, projectData: data }));
        
        // Check if user is authorized or needs to enter credentials
        handleAuthorizationCheck(projectId);
        return;
      }
      
      // If not found, show error
      console.log("[PreviewPage] Project not found anywhere");
      setIsError(true);
      setErrorDetails("Projeto não encontrado. O link pode ter expirado ou sido removido.");
    } catch (error) {
      console.error("[PreviewPage] Error verifying project:", error);
      setIsError(true);
      setErrorDetails("Erro ao verificar o projeto. Por favor, tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check authorization based on admin status or previous authorization
  const handleAuthorizationCheck = (encodedId: string) => {
    // Check if admin access or previously authorized
    const isAdmin = getCookie('admin_preview_access') === 'true';
    
    // Try both specific and general authorization cookies
    const isPreviouslyAuthorized = 
      getCookie(`preview_auth_${encodedId}`) === 'authorized' ||
      getCookie('preview_access') !== null;
    
    setDebugInfo(prev => ({ 
      ...prev, 
      authCheck: { 
        isAdmin, 
        isPreviouslyAuthorized, 
        encodedId 
      } 
    }));
    
    if (isAdmin || isPreviouslyAuthorized) {
      console.log("✅ Usuário autorizado (admin ou previamente autorizado)");
      setIsAuthorized(true);
      setIsError(false);
    } else {
      // Not authorized, but the project exists - show auth form
      console.log("ℹ️ Projeto existe mas usuário não está autorizado - mostrando formulário de autenticação");
      setIsError(false);
    }
    
    setIsLoading(false);
  };

  const handleAccessVerification = async (code: string, email: string) => {
    console.log('[PreviewPage] 🔐 Verificando acesso com código:', code, 'e email:', email);
    
    setDebugInfo(prev => ({ 
      ...prev, 
      accessVerification: { 
        code, 
        email: email.replace(/./g, '*'),
        timestamp: new Date().toISOString()
      } 
    }));
    
    if (!actualProjectId) {
      toast({
        title: "Erro de verificação",
        description: "Não foi possível verificar o acesso. Tente novamente.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // For demo purposes, accept any email with valid project code
      // This is a simplified version - in production you'd verify against actual client emails
      
      setIsAuthorized(true);
      setIsError(false);
      
      toast({
        title: "Acesso autorizado",
        description: "Bem-vindo à página de prévia do seu projeto.",
      });
      
      // Force page reload to ensure permissions are applied
      window.location.href = `/preview/${encodeURIComponent(code)}`;
    } catch (error) {
      console.error('[PreviewPage] ❌ Erro na verificação de acesso:', error);
      toast({
        title: "Erro de verificação",
        description: "Ocorreu um erro ao verificar suas credenciais. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Easter egg: Debug mode via ?debug=true parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const debugMode = params.get('debug') === 'true';
    
    if (debugMode) {
      console.log('🐞 Modo de depuração ativado');
      // Debug mode will show info in the console only
      console.log('Informações de depuração:', debugInfo);
    }
  }, [debugInfo]);

  // Not found or no projectId
  if (!projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ID do projeto não encontrado</h2>
          <p className="text-gray-700">O link que você acessou não é válido.</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Carregando prévia...</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Link de prévia inválido</h2>
          <p className="text-gray-700">
            {errorDetails || "O link que você acessou não existe ou expirou."}
          </p>
          <p className="mt-3 text-gray-600 text-sm">
            Dúvidas? Entre em contato pelo WhatsApp (11) 92058-5072
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  // Show authentication form if not authorized yet
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <ProjectAccessForm 
          projectId={projectId} 
          onVerify={handleAccessVerification} 
        />
      </div>
    );
  }

  // Debug view if ?debug=true is in URL
  const params = new URLSearchParams(window.location.search);
  const showDebugView = params.get('debug') === 'true';

  if (showDebugView) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-4">🐞 Modo de Depuração</h1>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Informações básicas:</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Link codificado: <code>{projectId}</code></li>
                <li>ID real do projeto: <code>{actualProjectId}</code></li>
                <li>Status de autorização: {isAuthorized ? '✅ Autorizado' : '❌ Não autorizado'}</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Logs de depuração:</h2>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-xs">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
            
            <div className="pt-4 flex justify-between">
              <button 
                onClick={() => navigate(`/preview/${projectId}`)} 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Ver Prévia Normal
              </button>
              
              <button 
                onClick={() => {
                  document.cookie = `preview_auth_${projectId}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
                  window.location.reload();
                }} 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Remover Autorização
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-8 pb-16">
      {duplicateWarning && (
        <div className="max-w-4xl mx-auto px-4 mb-4">
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Aviso</AlertTitle>
            <AlertDescription>{duplicateWarning}</AlertDescription>
          </Alert>
        </div>
      )}
      <MusicPreviewSystem projectId={actualProjectId || projectId} />
    </div>
  );
};

export default PreviewPage;
