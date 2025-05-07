
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

export const useProjectAccess = ({ projectId, onVerify }: UseProjectAccessProps) => {
  const [code, setCode] = useState(projectId || '');
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
      // First try to verify if the preview code exists
      console.log('[ProjectAccessForm] Consultando preview_code na tabela projects:', code);
      const { data, error } = await supabase
        .from('projects')
        .select('id, client_id, preview_code, clients!inner(*)')
        .eq('preview_code', code)
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
          clientEmail = data.clients.length > 0 && data.clients[0]?.email ? 
            data.clients[0].email : null;
          console.log('[ProjectAccessForm] Clients is array, email:', clientEmail);
        } 
        // If it's an object with an email property
        else if (typeof data.clients === 'object' && data.clients !== null && 'email' in data.clients) {
          clientEmail = (data.clients as { email?: string }).email || null;
          console.log('[ProjectAccessForm] Clients is object, email:', clientEmail);
        }
      }
      
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
        
        // Save access in localStorage
        localStorage.setItem('preview_access', JSON.stringify({
          code: code,
          email: email,
          timestamp: Date.now()
        }));
        
        // Also save a specific access token for this preview
        localStorage.setItem(`preview_auth_${code}`, 'authorized');
        
        // Call the onVerify callback to notify parent component
        onVerify(code, email);
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
