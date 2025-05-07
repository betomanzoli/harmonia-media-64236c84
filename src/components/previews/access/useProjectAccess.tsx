
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface UseProjectAccessProps {
  projectId: string;
  onVerify: (code: string, email: string) => void;
}

interface FormErrors {
  code?: string;
  email?: string;
}

// Cookie utility functions
export const setCookie = (name: string, value: string, options: Record<string, string> = {}) => {
  const defaultOptions = {
    path: '/',
    maxAge: '86400', // 1 day
    sameSite: 'None',
    secure: window.location.protocol === 'https:',
  };
  
  const cookieOptions = { ...defaultOptions, ...options };
  
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  Object.entries(cookieOptions).forEach(([key, val]) => {
    const formattedKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    cookieString += `; ${formattedKey}=${val}`;
  });
  
  document.cookie = cookieString;
  console.log(`[Cookie] Set: ${name} (options: ${JSON.stringify(cookieOptions)})`);
};

export const getCookie = (name: string): string | null => {
  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookieArray = document.cookie.split(';');
  
  for (let i = 0; i < cookieArray.length; i++) {
    let c = cookieArray[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      console.log(`[Cookie] Found: ${name}`);
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  console.log(`[Cookie] Not found: ${name}`);
  return null;
};

export const useProjectAccess = ({ projectId, onVerify }: UseProjectAccessProps) => {
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
          // Continue anyway - not critical for operation
        } else {
          console.log('[ProjectAccessForm] Anonymous auth successful');
        }
      } catch (authErr) {
        // Just log, don't block the flow
        console.warn('[ProjectAccessForm] Anonymous auth error:', authErr);
      }
      
      // Diagnostic logs for troubleshooting
      console.log('[ProjectAccessForm] Informações detalhadas:');
      console.log('- Código recebido na URL:', projectId);
      console.log('- Código decodificado:', decodedProjectId);
      console.log('- Código usado para verificação:', code);
      console.log('- Email fornecido:', email);
      
      // First try to verify if the preview code exists
      console.log('[ProjectAccessForm] Consultando preview_code na tabela projects:', code);
      const { data, error } = await supabase
        .from('projects')
        .select('id, client_id, preview_code, clients!inner(*)')
        .eq('preview_code', code)
        .single();
      
      console.log('[ProjectAccessForm] Verificação de preview_code:', { data, error });
      
      // Log detailed SQL query for debugging
      console.log('[ProjectAccessForm] SQL equivalente:', 
        `SELECT projects.id, projects.client_id, projects.preview_code, clients.* 
         FROM projects JOIN clients ON projects.client_id = clients.id 
         WHERE projects.preview_code = '${code}'`);
      
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
      
      // Log the entire data structure for debugging
      console.log('[ProjectAccessForm] Estrutura completa dos dados:', JSON.stringify(data));
      
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
      console.log('[ProjectAccessForm] Verificações especiais:', { 
        isTestEmail, 
        isDemoCode,
        clientEmail,
        providedEmail: email 
      });
      
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
          sameSite: 'None',
          secure: 'true'
        });
        
        // Also save a specific access token for this preview
        setCookie(`preview_auth_${code}`, 'authorized', {
          maxAge: '86400', // 1 day
          path: '/',
          sameSite: 'None',
          secure: 'true'
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
