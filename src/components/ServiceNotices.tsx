
import React from 'react';

const ServiceNotices: React.FC = () => {
  return (
    <div className="mt-10 border-t border-border pt-8">
      <h3 className="font-semibold mb-4">Avisos Importantes</h3>
      <ul className="space-y-2 text-gray-400">
        <li>• Os serviços extras devem ser solicitados durante ou até 7 dias após a entrega inicial do projeto.</li>
        <li>• Após o prazo de 7 dias, os arquivos podem ser removidos da plataforma, dificultando revisões ou upgrades.</li>
        <li>• Para garantir acesso contínuo aos arquivos, recomendamos contratar nosso serviço de armazenamento premium.</li>
      </ul>
    </div>
  );
};

export default ServiceNotices;
