
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SecureAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL hash
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const expiresAt = params.get('expires_at');
    
    if (accessToken && expiresAt) {
      // Store secure session data
      try {
        localStorage.setItem('harmonia_secure_session', JSON.stringify({
          access_token: accessToken,
          expires_at: expiresAt,
          timestamp: new Date().getTime()
        }));
      } catch {
        // Fallback to session storage for incognito mode
        sessionStorage.setItem('harmonia_secure_session_temp', JSON.stringify({
          access_token: accessToken,
          expires_at: expiresAt,
          timestamp: new Date().getTime()
        }));
      }
      
      // Redirect to intended destination
      const redirectTo = sessionStorage.getItem('auth_redirect_to') || '/';
      sessionStorage.removeItem('auth_redirect_to');
      navigate(redirectTo);
    } else {
      navigate('/auth-error');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-harmonia-green mx-auto mb-4"></div>
        <p>Finalizando autenticação segura...</p>
      </div>
    </div>
  );
};

export default SecureAuthCallback;
