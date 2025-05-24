
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PreviewAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  email: string | null;
  isPrivateMode: boolean;
}

export const usePreviewAuth = (projectId: string | undefined) => {
  const { toast } = useToast();
  const [authState, setAuthState] = useState<PreviewAuthState>({
    isAuthenticated: false,
    isLoading: true,
    email: null,
    isPrivateMode: false
  });

  // Detect private/incognito mode
  const detectPrivateMode = async (): Promise<boolean> => {
    try {
      // Try to use localStorage
      const testKey = 'preview_private_test';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return false; // localStorage works, not private
    } catch (e) {
      return true; // localStorage failed, likely private mode
    }
  };

  // Enhanced cookie management with better compatibility
  const setCookie = (name: string, value: string, days = 14) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    const isSecure = window.location.protocol === 'https:';
    
    let cookieValue = `${name}=${value}; ${expires}; path=/`;
    
    if (isSecure) {
      cookieValue += '; Secure; SameSite=None';
    } else {
      cookieValue += '; SameSite=Lax';
    }
    
    document.cookie = cookieValue;
  };

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  };

  const setPreviewAccess = (projectId: string, email: string) => {
    try {
      // Set cookies
      setCookie(`preview_access_${projectId}`, 'true');
      setCookie(`preview_email_${projectId}`, email);
      
      // Try localStorage as fallback
      if (!authState.isPrivateMode) {
        try {
          localStorage.setItem(`preview_access_${projectId}`, 'true');
          localStorage.setItem(`preview_email_${projectId}`, email);
          localStorage.setItem(`preview_access_expiry_${projectId}`, 
            new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString());
        } catch (e) {
          console.warn('LocalStorage não disponível, usando apenas cookies');
        }
      }
    } catch (error) {
      console.error('Erro ao definir acesso à prévia:', error);
    }
  };

  const checkPreviewAccess = (projectId: string): { hasAccess: boolean; email: string | null } => {
    try {
      // Check cookies first
      const cookieAccess = getCookie(`preview_access_${projectId}`);
      const cookieEmail = getCookie(`preview_email_${projectId}`);
      
      if (cookieAccess === 'true' && cookieEmail) {
        return { hasAccess: true, email: cookieEmail };
      }

      // Check localStorage as fallback
      if (!authState.isPrivateMode) {
        try {
          const localAccess = localStorage.getItem(`preview_access_${projectId}`);
          const localEmail = localStorage.getItem(`preview_email_${projectId}`);
          const expiry = localStorage.getItem(`preview_access_expiry_${projectId}`);
          
          if (localAccess === 'true' && localEmail && expiry) {
            const expiryDate = new Date(expiry);
            if (expiryDate > new Date()) {
              return { hasAccess: true, email: localEmail };
            }
          }
        } catch (e) {
          console.warn('Erro ao verificar localStorage');
        }
      }

      return { hasAccess: false, email: null };
    } catch (error) {
      console.error('Erro ao verificar acesso à prévia:', error);
      return { hasAccess: false, email: null };
    }
  };

  const authenticateEmail = async (email: string, projectId: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Always set local access regardless of Supabase success
      setPreviewAccess(projectId, email);

      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        email,
        isLoading: false
      }));

      toast({
        title: "Acesso autorizado",
        description: "Você foi autenticado para visualizar a prévia.",
      });

      return true;
    } catch (error) {
      console.error('Erro na autenticação:', error);
      
      // Even if there's an error, try local auth
      setPreviewAccess(projectId, email);
      
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        email,
        isLoading: false
      }));

      toast({
        title: "Acesso local autorizado",
        description: "Você foi autenticado localmente para visualizar a prévia.",
      });

      return true;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (!projectId) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const isPrivate = await detectPrivateMode();
      
      setAuthState(prev => ({ ...prev, isPrivateMode: isPrivate }));

      // Check local access
      const { hasAccess, email } = checkPreviewAccess(projectId);
      
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: hasAccess,
        email,
        isLoading: false
      }));
    };

    checkAuth();
  }, [projectId]);

  return {
    ...authState,
    authenticateEmail,
    setPreviewAccess,
    checkPreviewAccess
  };
};
