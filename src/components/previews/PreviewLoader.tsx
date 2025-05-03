
import React from 'react';

const PreviewLoader: React.FC = () => {
  return (
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-harmonia-green"></div>
      <p className="mt-4 text-gray-500">Carregando prévias...</p>
    </div>
  );
};

export default PreviewLoader;
