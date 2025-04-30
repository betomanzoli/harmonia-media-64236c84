
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';

const PreviewProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  if (!projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Código de prévia não encontrado</h2>
          <p className="text-black mb-6">
            Por favor, verifique o link ou entre em contato conosco.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="bg-harmonia-green text-white px-4 py-2 rounded hover:bg-harmonia-green/90"
          >
            Voltar à página inicial
          </button>
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

export default PreviewProjectPage;
