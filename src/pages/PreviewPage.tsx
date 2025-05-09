
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';

const PreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Log access for analytics
    if (projectId) {
      console.log(`Acesso à prévia: ${projectId}, Data: ${new Date().toISOString()}`);
      window.scrollTo(0, 0);
    }
  }, [projectId]);

  if (!projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ID do projeto não encontrado</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-8 pb-16">
      <MusicPreviewSystem projectId={projectId} />
    </div>
  );
};

export default PreviewPage;
