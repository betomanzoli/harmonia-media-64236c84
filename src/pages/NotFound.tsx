
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-medium text-gray-600 mb-6">Página não encontrada</h2>
      <p className="text-gray-500 mb-8 text-center">
        A página que você está procurando não existe ou foi removida.
      </p>
      <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full">
        Voltar para a página inicial
      </Link>
    </div>
  );
};

export default NotFound;
