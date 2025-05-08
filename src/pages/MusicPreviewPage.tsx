
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import { useToast } from '@/hooks/use-toast';
import { getProjectIdFromPreviewLink, isValidEncodedPreviewLink } from '@/utils/previewLinkUtils';
import { supabase } from '@/lib/supabase';

// Force dynamic content to prevent caching
export const dynamic = 'force-dynamic';

const MusicPreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    // Log preview access for analytics and monitoring
    if (projectId) {
      console.log(`Cliente acessando prévia: ${projectId}, data: ${new Date().toISOString()}`);
      setIsLoading(true);
      
      // Try anonymous authentication for better RLS support
      const initAuth = async () => {
        try {
          const { data, error } = await supabase.auth.signInAnonymously();
          if (error) {
            console.warn("[MusicPreviewPage] Anonymous auth warning:", error);
            setDebugInfo(prev => ({ ...prev, authError: error }));
          } else {
            console.log("[MusicPreviewPage] Anonymous auth successful:", data);
            setDebugInfo(prev => ({ ...prev, authData: data }));
          }
        } catch (authErr) {
          console.warn("[MusicPreviewPage] Anonymous auth error:", authErr);
          setDebugInfo(prev => ({ ...prev, authException: authErr }));
        }
      };
      
      initAuth();
      
      // Check if this is a direct or encoded link
      const isEncodedLink = isValidEncodedPreviewLink(projectId);
      console.log("[MusicPreviewPage] Is encoded preview link:", isEncodedLink);
      console.log("[MusicPreviewPage] Token recebido:", projectId);
      setDebugInfo(prev => ({ ...prev, isEncodedLink, rawProjectId: projectId }));
      
      // For backwards compatibility, we still support direct project IDs
      // but only when accessed by admin users
      const isAdmin = localStorage.getItem('admin_preview_access') === 'true';
      
      if (!isEncodedLink && !isAdmin) {
        console.log("[MusicPreviewPage] Direct link access denied - only encoded links are allowed for clients");
        setIsError(true);
        setErrorMessage("Código de prévia inválido");
        setIsLoading(false);
        return;
      }
      
      // Process encoded link or direct link (admin only)
      let decodedId: string | null = null;
      
      if (isEncodedLink) {
        decodedId = getProjectIdFromPreviewLink(projectId);
        console.log("[MusicPreviewPage] Decoded project ID:", decodedId);
        
        if (!decodedId) {
          console.log("[MusicPreviewPage] Failed to decode project ID");
          setIsError(true);
          setErrorMessage("Falha ao decodificar ID do projeto");
          setIsLoading(false);
          return;
        }
      } else if (isAdmin) {
        // Direct access for admins
        decodedId = projectId;
      }
      
      setActualProjectId(decodedId);
      setDebugInfo(prev => ({ ...prev, decodedId }));
      
      // Verify project exists
      verifyProjectExists(projectId, decodedId);
      
      window.scrollTo(0, 0);
    }
  }, [projectId]);

  // Function to verify project exists in localStorage or Supabase
  const verifyProjectExists = async (rawProjectId: string | null, decodedId: string | null) => {
    if (!rawProjectId && !decodedId) {
      setIsError(true);
      setErrorMessage("ID do projeto não fornecido");
      setIsLoading(false);
      return;
    }
    
    try {
      // We'll search using both the raw projectId and decodedId for maximum compatibility
      const idsToCheck = [rawProjectId, decodedId].filter(Boolean);
      console.log("[MusicPreviewPage] IDs to check:", idsToCheck);
      
      // First check localStorage
      const storedProjects = localStorage.getItem('harmonIA_preview_projects');
      
      if (storedProjects) {
        const projects = JSON.parse(storedProjects);
        
        // Check if any project matches by id OR preview_code
        const projectExists = projects.some((p: any) => {
          return idsToCheck.includes(p.id) || 
                 idsToCheck.includes(p.preview_code);
        });
        
        if (projectExists) {
          console.log("[MusicPreviewPage] Project found in localStorage");
          setIsError(false);
          setIsLoading(false);
          return;
        }
      }
      
      // If not found in localStorage, check Supabase by preview_code first
      console.log("[MusicPreviewPage] Project not found in localStorage, checking Supabase by preview_code");
      
      // We'll try both codes
      for (const codeToTry of idsToCheck) {
        const { data: previewData, error: previewError } = await supabase
          .from('projects')
          .select('id')
          .eq('preview_code', codeToTry);
        
        console.log(`[MusicPreviewPage] Supabase lookup by preview_code '${codeToTry}':`, { previewData, previewError });
        setDebugInfo(prev => ({ 
          ...prev, 
          previewCodeLookup: { code: codeToTry, data: previewData, error: previewError } 
        }));
          
        if (previewData && previewData.length > 0) {
          console.log("[MusicPreviewPage] Project found in Supabase by preview_code");
          setIsError(false);
          setIsLoading(false);
          return;
        }
      }
      
      // Then check by ID
      console.log("[MusicPreviewPage] Project not found by preview_code, checking by ID");
      
      // Try both IDs
      for (const idToTry of idsToCheck) {
        const { data, error } = await supabase
          .from('projects')
          .select('id')
          .eq('id', idToTry);
          
        console.log(`[MusicPreviewPage] Supabase lookup by id '${idToTry}':`, { data, error });
        setDebugInfo(prev => ({ 
          ...prev, 
          idLookup: { id: idToTry, data, error } 
        }));
          
        if (error) {
          console.error(`[MusicPreviewPage] Error checking project by id '${idToTry}' in Supabase:`, error);
        }
        
        if (data && data.length > 0) {
          console.log("[MusicPreviewPage] Project found in Supabase by ID");
          setIsError(false);
          setIsLoading(false);
          return;
        }
      }
      
      // If we get here, no project was found
      console.log("[MusicPreviewPage] Project not found in Supabase");
      setIsError(true);
      setErrorMessage("Projeto não encontrado");
      
    } catch (error) {
      console.error("[MusicPreviewPage] Error verifying project:", error);
      setIsError(true);
      setErrorMessage("Erro ao verificar o projeto");
      setDebugInfo(prev => ({ ...prev, verifyError: error }));
    } finally {
      setIsLoading(false);
    }
  };

  // Special debug mode
  const isDebugMode = new URLSearchParams(window.location.search).get('debug') === 'true';
  
  if (isDebugMode) {
    return (
      <div className="min-h-screen p-8 bg-gray-100">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">🐞 Debug Mode: Music Preview</h1>
          
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Request Info:</h2>
            <div className="bg-gray-100 p-4 rounded-md">
              <p><strong>Raw Project ID:</strong> {projectId}</p>
              <p><strong>Decoded ID:</strong> {actualProjectId}</p>
              <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
              <p><strong>Error:</strong> {isError ? 'Yes' : 'No'}</p>
              {errorMessage && <p><strong>Error Message:</strong> {errorMessage}</p>}
            </div>
          </div>
          
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Debug Info:</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-xs">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
          
          <div className="mt-6 flex space-x-4">
            <button 
              onClick={() => window.location.href = `/preview/${projectId}`}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              View Normal Preview
            </button>
            <button 
              onClick={() => {
                // Test a direct supabase fetch
                const testFetch = async () => {
                  try {
                    // Reset auth just to be sure
                    await supabase.auth.signOut();
                    await supabase.auth.signInAnonymously();
                    
                    // Test query by preview_code
                    const { data, error } = await supabase
                      .from('projects')
                      .select('*')
                      .eq('preview_code', projectId);
                      
                    setDebugInfo(prev => ({ 
                      ...prev, 
                      manualTest: { 
                        timestamp: new Date().toISOString(),
                        projectId,
                        data,
                        error
                      } 
                    }));
                    
                    // Show toast with results
                    toast({
                      title: error ? 'Test failed' : 'Test succeeded',
                      description: error 
                        ? `Error: ${error.message}` 
                        : `Found ${data?.length || 0} projects`,
                      variant: error ? 'destructive' : 'default'
                    });
                    
                  } catch (err) {
                    console.error("Manual test error:", err);
                    setDebugInfo(prev => ({ 
                      ...prev, 
                      manualTestError: err 
                    }));
                    
                    toast({
                      title: 'Test exception',
                      description: `Error: ${err instanceof Error ? err.message : String(err)}`,
                      variant: 'destructive'
                    });
                  }
                };
                
                testFetch();
              }}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Test Direct Fetch
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Regular display modes
  if (!projectId || isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Link de prévia inválido</h2>
          <p className="text-gray-700">{errorMessage || "O código de prévia fornecido não é válido ou expirou."}</p>
          <p className="text-sm text-gray-500 mt-4">
            Dúvidas? Entre em contato pelo WhatsApp (11) 92058-5072
          </p>
        </div>
      </div>
    );
  }
  
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

  return (
    <div className="min-h-screen bg-gray-100 pt-8 pb-16">
      <MusicPreviewSystem projectId={actualProjectId || projectId} />
    </div>
  );
};

export default MusicPreviewPage;
