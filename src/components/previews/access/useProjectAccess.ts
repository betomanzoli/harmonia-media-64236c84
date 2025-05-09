
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

export const getCookie = (name: string): string | null => {
  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookieArray = document.cookie.split(';');
  
  for (let i = 0; i < cookieArray.length; i++) {
    let c = cookieArray[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }
  return null;
};

export const useProjectAccessForm = ({ projectId, onVerify }: UseProjectAccessProps) => {
  const [code, setCode] = useState(projectId || '');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    
    if (!code.trim()) {
      newErrors.code = 'Código de prévia é obrigatório';
      isValid = false;
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('[ProjectAccess] Verifying access with code:', code, 'and email:', email);
      
      // Try to sign in anonymously for better RLS support
      try {
        await supabase.auth.signInAnonymously();
        console.log('[ProjectAccess] Anonymous auth successful');
      } catch (authError) {
        console.warn('[ProjectAccess] Anonymous auth failed:', authError);
        // Continue anyway - this is a non-blocking operation
      }
      
      // Verify if project exists
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id, preview_code')
        .eq('preview_code', code.trim())
        .maybeSingle();
      
      console.log('[ProjectAccess] Project lookup response:', { data: projectData, error: projectError });
      
      if (projectError) {
        console.error('[ProjectAccess] Error verifying project:', projectError);
        setError('Erro ao verificar o projeto. Por favor, tente novamente.');
        setIsLoading(false);
        return;
      }
      
      if (!projectData) {
        console.log('[ProjectAccess] Project not found with code:', code);
        setError('Código de prévia inválido. Por favor, verifique e tente novamente.');
        setIsLoading(false);
        return;
      }
      
      // Project exists, set access cookie
      const now = new Date();
      const expirationTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
      
      // Set project-specific access cookie
      setCookie(`preview_auth_${code}`, 'authorized', {
        path: '/',
        expires: expirationTime.toUTCString(),
        sameSite: 'Lax',
        secure: window.location.protocol === 'https:'
      });
      
      // Also set general access cookie with JSON data
      const accessData = {
        project_id: projectData.id,
        access_time: now.getTime(),
        expires_at: expirationTime.getTime(),
        email: email.trim()
      };
      
      setCookie('preview_access', JSON.stringify(accessData), {
        path: '/',
        expires: expirationTime.toUTCString(),
        sameSite: 'Lax',
        secure: window.location.protocol === 'https:'
      });
      
      console.log('[ProjectAccess] Access granted for project:', projectData.id);
      
      // Call the verification callback
      onVerify(code.trim(), email.trim());
    } catch (err) {
      console.error('[ProjectAccess] Error during verification:', err);
      setError('Ocorreu um erro durante a verificação. Por favor, tente novamente.');
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
