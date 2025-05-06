
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import ProjectAccessForm from '@/components/previews/ProjectAccessForm';
import { useToast } from '@/hooks/use-toast';
import { getProjectIdFromPreviewLink, isValidEncodedPreviewLink } from '@/utils/previewLinkUtils';
import { supabase } from '@/lib/supabase';

const PreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    // Log access for analytics
    if (projectId) {
      console.log(`🔍 Tentativa de acesso à prévia: ${projectId}, Data: ${new Date().toISOString()}`);
      window.scrollTo(0, 0);
      setIsLoading(true);
      
      // Validate if this is an encoded preview link
      const isEncodedLink = isValidEncodedPreviewLink(projectId);
      console.log("🔑 É um link codificado?", isEncodedLink ? "Sim" : "Não");
      
      if (!isEncodedLink) {
        console.log("⛔ Formato de link inválido - não é um link de prévia codificado");
        setIsError(true);
        setIsLoading(false);
        return;
      }
      
      // Decode the project ID
      const decodedId = getProjectIdFromPreviewLink(projectId);
      console.log("🔓 ID do projeto decodificado:", decodedId);
      
      if (!decodedId) {
        console.log("❌ Falha ao decodificar ID do projeto");
        setIsError(true);
        setIsLoading(false);
        return;
      }
      
      // Set the actual project ID and attempt to find the project
      setActualProjectId(decodedId);
      
      verifyProjectAccess(decodedId, projectId);
    }
  }, [projectId]);

  // Function to verify project access first in Supabase then in localStorage
  const verifyProjectAccess = async (decodedId: string, encodedId: string) => {
    try {
      setDebugInfo({
        method: 'verifyProjectAccess',
        decodedId,
        encodedId,
        timestamp: new Date().toISOString()
      });
      
      // First check in Supabase
      console.log("🔍 Verificando projeto no Supabase...");
      let projectExists = false;
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id')
          .eq('id', decodedId)
          .maybeSingle();
          
        if (error) {
          console.error('❌ Erro ao verificar projeto no Supabase:', error);
          setDebugInfo(prev => ({ 
            ...prev, 
            supabaseError: error 
          }));
        } else {
          projectExists = !!data;
          setDebugInfo(prev => ({ 
            ...prev, 
            supabaseCheck: { 
              found: projectExists, 
              data 
            } 
          }));
        }
      } catch (supabaseError) {
        console.error('❌ Erro na consulta ao Supabase:', supabaseError);
        setDebugInfo(prev => ({ 
          ...prev, 
          supabaseCheckError: supabaseError 
        }));
      }
      
      // If not found in Supabase, fallback to localStorage
      if (!projectExists) {
        console.log("🔍 Verificando projeto no localStorage...");
        const storedProjects = localStorage.getItem('harmonIA_preview_projects');
        
        if (storedProjects) {
          const projects = JSON.parse(storedProjects);
          projectExists = projects.some((p: any) => p.id === decodedId);
          setDebugInfo(prev => ({ 
            ...prev, 
            localStorageCheck: { 
              found: projectExists, 
              projectsCount: projects.length 
            } 
          }));
        }
      }
      
      if (projectExists) {
        console.log("✅ Projeto encontrado:", decodedId);
        handleAuthorizationCheck(encodedId);
        return;
      }
      
      // No valid project found
      console.log("❌ Nenhum projeto válido encontrado para:", decodedId);
      setIsError(true);
      setIsLoading(false);
    } catch (error) {
      console.error("❌ Erro ao verificar projeto:", error);
      setDebugInfo(prev => ({ 
        ...prev, 
        verifyError: error 
      }));
      setIsError(true);
      setIsLoading(false);
    }
  };
  
  // Check authorization based on admin status or previous authorization
  const handleAuthorizationCheck = (encodedId: string) => {
    // Check if admin access or previously authorized
    const isAdmin = localStorage.getItem('admin_preview_access') === 'true';
    const isPreviouslyAuthorized = localStorage.getItem(`preview_auth_${encodedId}`) === 'authorized';
    
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
    console.log('🔐 Verificando acesso com código:', code, 'e email:', email);
    
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
    
    // Try to verify access using Supabase
    try {
      // Check the project preview_code if available
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('preview_code, client_id')
        .eq('id', actualProjectId)
        .maybeSingle();
        
      if (projectError) {
        console.error('❌ Erro ao buscar dados do projeto para verificação:', projectError);
        setDebugInfo(prev => ({ 
          ...prev, 
          verificationError: projectError 
        }));
      }
      
      setDebugInfo(prev => ({ 
        ...prev, 
        verificationData: { 
          projectFound: !!projectData,
          hasPreviewCode: !!projectData?.preview_code, 
          clientId: projectData?.client_id 
        } 
      }));
      
      // For this implementation, we'll compare preview_code and allow test/demo emails
      const isCodeValid = projectData?.preview_code && code === projectData.preview_code;
      
      // For demo purposes, also allow test/demo emails or specific code
      const isTestEmail = email.includes('@') && (
        email.toLowerCase().includes('test') || 
        email.toLowerCase().includes('demo')
      );
      
      const isDemoCode = code === '123456';
      
      const isAuthorized = isCodeValid || isTestEmail || isDemoCode;
      
      setDebugInfo(prev => ({ 
        ...prev, 
        verificationResult: { 
          isCodeValid, 
          isTestEmail,
          isDemoCode,
          isAuthorized 
        } 
      }));
      
      if (isAuthorized) {
        localStorage.setItem(`preview_auth_${projectId}`, 'authorized');
        setIsAuthorized(true);
        setIsError(false);
        toast({
          title: "Acesso autorizado",
          description: "Bem-vindo à página de prévia do seu projeto.",
        });
      } else {
        toast({
          title: "Autenticação falhou",
          description: "As credenciais fornecidas não correspondem aos registros deste projeto. Por favor, verifique o código e o email.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Erro na verificação de acesso:', error);
      setDebugInfo(prev => ({ 
        ...prev, 
        verificationFatalError: error 
      }));
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

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Link de prévia inválido</h2>
          <p className="text-gray-700">O link que você acessou não existe ou expirou.</p>
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
                  localStorage.removeItem(`preview_auth_${projectId}`);
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
      <MusicPreviewSystem projectId={actualProjectId || projectId} />
    </div>
  );
};

export default PreviewPage;
