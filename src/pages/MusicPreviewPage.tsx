
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import { useToast } from '@/hooks/use-toast';
import { usePreviewAccess } from '@/hooks/usePreviewAccess';
import EmailAccessCheck from '@/components/previews/EmailAccessCheck';
import { Loader2 } from 'lucide-react';

const MusicPreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthorized, isCheckingAuth, setIsAuthorized } = usePreviewAccess(projectId || '');

  useEffect(() => {
    // Log preview access for analytics and monitoring
    if (projectId) {
      console.log(`Cliente acessando prévia: ${projectId}, data: ${new Date().toISOString()}`);
      window.scrollTo(0, 0);
    }
  }, [projectId]);

  if (!projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-black mb-4">ID do projeto não encontrado</h2>
          <p className="text-black">O código de prévia fornecido não é válido.</p>
        </div>
      </div>
    );
  }
  
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-6">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-harmonia-green" />
          <h2 className="text-xl font-medium text-gray-800">Verificando acesso...</h2>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <EmailAccessCheck 
          projectId={projectId} 
          onAccess={() => setIsAuthorized(true)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-8 pb-16">
      <MusicPreviewSystem projectId={projectId} />
    </div>
  );
};

export default MusicPreviewPage;
