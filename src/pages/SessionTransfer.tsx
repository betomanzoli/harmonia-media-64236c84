import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionTransfer = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const tempSession = cookies.find(c => c.trim().startsWith('temp_session='));
    
    if (tempSession) {
      const encrypted = tempSession.split('=')[1];
      const sessionData = JSON.parse(atob(encrypted));
      
      document.cookie = 'temp_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      navigate(`/secure-auth-callback#access_token=${sessionData.access_token}&expires_at=${sessionData.expires_at}`);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-harmonia-green mx-auto mb-4"></div>
        <p>Transferindo sua sessão de segurança...</p>
      </div>
    </div>
  );
};

export default SessionTransfer;
