
import React from 'react';

interface MusicPreviewSystemProps {
  projectId: string;
}

const MusicPreviewSystem: React.FC<MusicPreviewSystemProps> = ({ projectId }) => {
  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Preview do Projeto</h1>
        <p className="text-gray-600">ID do Projeto: {projectId}</p>
        
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <p className="text-center text-gray-500">
            Prévia de áudio carregando...
          </p>
        </div>
      </div>
    </div>
  );
};

export default MusicPreviewSystem;
