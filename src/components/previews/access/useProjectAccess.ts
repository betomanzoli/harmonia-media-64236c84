
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { setCookie, getCookie } from '@/utils/cookieUtils';

interface UseProjectAccessProps {
  projectId: string;
  onVerify: (code: string, email: string) => void;
}

interface FormErrors {
  code?: string;
  email?: string;
}

// The base project access hook with authorization state
export const useProjectAccess = (projectId: string | null) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize and check authorization on mount
  useState(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }
    
    // Check for admin access
    const hasAdminAccess = getCookie('admin_preview_access') === 'true';
    if (hasAdminAccess) {
      console.log('[useProjectAccess] Admin access detected, granting access');
      setIsAuthorized(true);
      setLoading(false);
      return;
    }
    
    // Check for project specific cookie authorization
    const projectAuthCookie = getCookie(`preview_auth_${projectId}`);
    if (projectAuthCookie === 'authorized') {
      console.log('[useProjectAccess] Project authorization cookie found');
      setIsAuthorized(true);
      setLoading(false);
      return;
    }
    
    // Check for general preview access
    const previewAccessCookie = getCookie('preview_access');
    if (previewAccessCookie) {
      try {
        const accessData = JSON.parse(previewAccessCookie);
        const isValid = 
          accessData.code === projectId && 
          accessData.timestamp && 
          (Date.now() - accessData.timestamp < 24 * 60 * 60 * 1000); // 24 hours
          
        if (isValid) {
          console.log('[useProjectAccess] Valid preview access cookie found');
          setIsAuthorized(true);
        } else {
          console.log('[useProjectAccess] Preview access cookie invalid or expired');
          setIsAuthorized(false);
        }
      } catch (err) {
        console.error('[useProjectAccess] Error parsing access cookie:', err);
        setIsAuthorized(false);
      }
    } else {
      console.log('[useProjectAccess] No access cookie found');
      setIsAuthorized(false);
    }
    
    setLoading(false);
  });
  
  // Function to grant access to a project
  const grantAccess = (projectId: string, expirationHours = 24) => {
    if (!projectId) return false;
    
    try {
      // Set cookie with appropriate attributes
      setCookie(`preview_auth_${projectId}`, 'authorized', {
        maxAge: String(expirationHours * 60 * 60), // Convert hours to seconds
        path: '/',
        sameSite: 'Lax'
      });
      
      setIsAuthorized(true);
      return true;
    } catch (err) {
      console.error('[useProjectAccess] Error granting access:', err);
      return false;
    }
  };
  
  // Function to revoke access
  const revokeAccess = () => {
    try {
      // Remove all preview auth cookies
      removeCookie('preview_access');
      
      if (projectId) {
        removeCookie(`preview_auth_${projectId}`);
      }
      
      setIsAuthorized(false);
      return true;
    } catch (err) {
      console.error('[useProjectAccess] Error revoking access:', err);
      return false;
    }
  };
  
  return { isAuthorized, loading, grantAccess, revokeAccess };
};

// Remove a cookie (helper function)
const removeCookie = (name: string): void => {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

// The form-specific hook for handling project access verification
export const useProjectAccessForm = ({ projectId, onVerify }: UseProjectAccessProps) => {
  // Always use decoded project ID
  const decodedProjectId = decodeURIComponent(projectId || '');
  const [code, setCode] = useState(decodedProjectId || '');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateInputs = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    
    // Validate code
    if (!code.trim()) {
      newErrors.code = 'Por favor, informe o código do projeto.';
      isValid = false;
    }
    
    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Por favor, informe um email.';
      isValid = false;
    } else if (!email.includes('@')) {
      newErrors.email = 'Por favor, informe um email válido.';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setErrors({});
    
    // Perform validation
    if (!validateInputs()) {
      setIsLoading(false);
      return;
    }
    
    console.log('[ProjectAccessForm] Verificando acesso com código:', code, 'e email:', email);
    
    try {
      // Try anonymous authentication first to ensure RLS access
      try {
        const { error: authError } = await supabase.auth.signInAnonymously();
        if (authError) {
          console.warn('[ProjectAccessForm] Anonymous auth warning:', authError);
        } else {
          console.log('[ProjectAccessForm] Anonymous auth successful');
        }
      } catch (authErr) {
        console.warn('[ProjectAccessForm] Anonymous auth error:', authErr);
      }
      
      // First try to verify if the preview code exists
      console.log('[ProjectAccessForm] Consultando preview_code na tabela projects:', code);
      
      const { data, error } = await supabase
        .from('projects')
        .select('id, client_id, preview_code, clients!inner(*)')
        .eq('preview_code', code) // Use snake_case for column names
        .single();
      
      console.log('[ProjectAccessForm] Verificação de preview_code:', { data, error });
      
      if (error) {
        console.error('[ProjectAccessForm] Erro ao verificar preview_code:', error);
        
        // Try again with direct ID as fallback
        console.log('[ProjectAccessForm] Tentando buscar por ID direto:', code);
        const { data: directData, error: directError } = await supabase
          .from('projects')
          .select('id, preview_code')
          .eq('id', code)
          .single();
        
        console.log('[ProjectAccessForm] Resultado da busca por ID direto:', { directData, directError });
        
        if (directError || !directData) {
          console.log('[ProjectAccessForm] Código não encontrado por nenhum método');
          setError('Código de prévia não encontrado ou inválido.');
          setIsLoading(false);
          return;
        }
        
        // If we found the project by direct ID
        console.log('[ProjectAccessForm] Projeto encontrado por ID direto:', directData);
      }
      
      // For demo purposes, also allow test/demo emails or specific codes
      const isTestEmail = email.toLowerCase().includes('test') || 
        email.toLowerCase().includes('demo') || 
        email.toLowerCase().includes('admin') ||
        email.toLowerCase().includes('harmonia');
      
      const isDemoCode = code === '123456' || code.startsWith('P');
      
      // Fix: Properly handle the clients data with proper TypeScript types
      let clientEmail: string | null = null;
      
      if (data?.clients) {
        // Check if clients is an array and handle accordingly
        if (Array.isArray(data.clients)) {
          console.log('[ProjectAccessForm] clients é um array:', data.clients);
          clientEmail = data.clients.length > 0 && data.clients[0]?.email ? 
            data.clients[0].email : null;
        } 
        // If it's an object with an email property
        else if (typeof data.clients === 'object' && data.clients !== null) {
          console.log('[ProjectAccessForm] clients é um objeto:', data.clients);
          // Use optional chaining and type assertion
          clientEmail = (data.clients as { email?: string }).email || null;
        }
      }
      
      console.log('[ProjectAccessForm] Email do cliente extraído:', clientEmail);
      
      // Client verification logic - compare emails if available
      const emailMatches = clientEmail && email.toLowerCase() === clientEmail.toLowerCase();
      const isAuthorized = emailMatches || isTestEmail || isDemoCode || data;
      
      if (isAuthorized) {
        console.log('[ProjectAccessForm] Acesso autorizado');
        
        // Save access in cookie instead of localStorage
        const accessData = JSON.stringify({
          code: code,
          email: email,
          timestamp: Date.now()
        });
        
        // Set cookie with appropriate attributes
        setCookie('preview_access', accessData, {
          maxAge: '86400', // 1 day
          path: '/',
          sameSite: 'Lax',
          secure: window.location.protocol === 'https:'
        });
        
        // Also save a specific access token for this preview
        setCookie(`preview_auth_${code}`, 'authorized', {
          maxAge: '86400', // 1 day
          path: '/',
          sameSite: 'Lax',
          secure: window.location.protocol === 'https:'
        });
        
        // Call the onVerify callback to notify parent component
        onVerify(code, email);
        
        // Force page reload to ensure all permissions are applied
        window.location.href = `/preview/${encodeURIComponent(code)}`;
      } else {
        console.log('[ProjectAccessForm] Acesso negado: email não autorizado');
        setError('Email não autorizado para este código de prévia.');
      }
    } catch (err) {
      console.error('[ProjectAccessForm] Erro ao verificar acesso:', err);
      setError('Ocorreu um erro ao verificar o acesso. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    code,
    setCode,
    email,
    setEmail,
    isLoading,
    error,
    errors,
    handleSubmit
  };
};
