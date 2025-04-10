
import React from 'react';

const PreviewFooter: React.FC = () => {
  return (
    <div className="mt-8 text-center py-4 text-xs text-gray-400 border-t">
      <p>Todas as prévias são limitadas a 30 segundos e protegidas contra download não autorizado.</p>
      <p>© {new Date().getFullYear()} harmonIA - Todos os direitos reservados</p>
    </div>
  );
};

export default PreviewFooter;
