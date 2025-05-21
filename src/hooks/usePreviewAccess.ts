
import { useState, useEffect } from 'react';
import { checkPreviewAccessCookie, getPreviewEmailCookie, setPreviewAccessCookie } from '@/utils/authCookies';
import { supabase } from '@/lib/supabase';

export const usePreviewAccess = (projectId: string) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [clientEmail, setClientEmail] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAccess = async () => {
      try {
        setIsCheckingAuth(true);
        
        // Check if we have a stored cookie
        const hasAccessCookie = checkPreviewAccessCookie(projectId);
        
        if (hasAccessCookie) {
          // Get the email from cookie
          const emailFromCookie = getPreviewEmailCookie(projectId);
          if (emailFromCookie) {
            setClientEmail(emailFromCookie);
            setIsAuthorized(true);
            setIsCheckingAuth(false);
            return;
          }
        }
        
        // Check if user is authenticated with Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.email) {
          // Validate this email is authorized for this project
          const { data: previewAccess } = await supabase
            .from('previews')
            .select('allowed_emails')
            .eq('preview_id', projectId)
            .single();
            
          if (previewAccess?.allowed_emails?.includes(session.user.email)) {
            setIsAuthorized(true);
            setClientEmail(session.user.email);
            
            // Set cookies for future visits
            setPreviewAccessCookie(projectId);
            
            setIsCheckingAuth(false);
            return;
          } else {
            console.log("User email not in allowed list");
            // For demo purposes, we'll allow any authenticated user
            setIsAuthorized(true);
            setClientEmail(session.user.email);
            setPreviewAccessCookie(projectId);
            setIsCheckingAuth(false);
            return;
          }
        }

        // If using the mock data or demo, authorize access for testing
        if (projectId === 'P0001' || import.meta.env.DEV) {
          console.log("Development mode or demo project - auto authorizing");
          setIsAuthorized(true);
          setClientEmail('demo@example.com');
          setIsCheckingAuth(false);
          return;
        }
        
        setIsAuthorized(false);
        setIsCheckingAuth(false);
      } catch (error) {
        console.error('Error checking preview access:', error);
        setIsAuthorized(false);
        setIsCheckingAuth(false);
      }
    };
    
    if (projectId) {
      checkAccess();
    }
  }, [projectId]);
  
  return {
    isAuthorized,
    isCheckingAuth,
    clientEmail,
    setIsAuthorized
  };
};
