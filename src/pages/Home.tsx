
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">harmonIA</h1>
      <div className="text-center mb-8">
        <p className="text-xl mb-4">Bem-vindo ao sistema de gerenciamento de projetos musicais</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/admin-j28s7d1k/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Acessar Área Administrativa
          </Link>
          <Link to="/briefing" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Enviar Briefing
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
