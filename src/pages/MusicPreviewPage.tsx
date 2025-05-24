
import React from 'react';
import { useParams } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import PreviewAuthForm from '@/components/previews/auth/PreviewAuthForm';
import { usePreviewAuth } from '@/hooks/auth/usePreviewAuth';
import { Loader2 } from 'lucide-react';

const MusicPreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { isAuthenticated, isLoading, email, isPrivateMode, authenticateEmail } = usePreviewAuth(projectId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-harmonia-green" />
          <p className="mt-4 text-gray-600">Verificando acesso à prévia...</p>
          {isPrivateMode && (
            <p className="mt-2 text-sm text-amber-600">
              Modo privado detectado - usando autenticação local
            </p>
          )}
        </div>
      </div>
    );
  }

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 pt-8 pb-16">
        <PreviewAuthForm 
          projectId={projectId}
          onAuthenticate={(email) => authenticateEmail(email, projectId)}
          isPrivateMode={isPrivateMode}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-8 pb-16">
      <MusicPreviewSystem projectId={projectId} userEmail={email} />
    </div>
  );
};

export default MusicPreviewPage;
