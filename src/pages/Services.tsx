
import React from 'react';

const Services: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Nossos Serviços</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Composição Personalizada</h2>
          <p>Criamos músicas exclusivas para seu projeto</p>
        </div>
        <div className="border p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Arranjos</h2>
          <p>Desenvolvemos arranjos para músicas existentes</p>
        </div>
        <div className="border p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Produção Musical</h2>
          <p>Produção completa do seu projeto musical</p>
        </div>
      </div>
    </div>
  );
};

export default Services;
