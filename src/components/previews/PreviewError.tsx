
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PreviewErrorProps {
  title: string;
  description: string;
}

const PreviewError: React.FC<PreviewErrorProps> = ({ title, description }) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-gray-400 mb-6">{description}</p>
      <button 
        onClick={() => navigate('/')}
        className="bg-harmonia-green hover:bg-harmonia-green/90 text-white px-4 py-2 rounded"
      >
        Voltar à página inicial
      </button>
    </div>
  );
};

export default PreviewError;
