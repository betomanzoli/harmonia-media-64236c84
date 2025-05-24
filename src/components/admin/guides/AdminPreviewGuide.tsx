
import React from 'react';

const AdminPreviewGuide: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Guia de Uso - Prévias Musicais</h2>
      <p>
        Esta seção permite gerenciar as prévias musicais enviadas aos clientes.
        Aqui você pode criar, editar e monitorar o status das prévias.
      </p>
      
      <div className="p-4 bg-gray-100 rounded-md">
        <h3 className="font-bold mb-2">Como utilizar</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Clique em "Nova Prévia" para criar uma nova prévia musical</li>
          <li>Selecione o cliente ou crie um novo</li>
          <li>Faça o upload do arquivo de áudio</li>
          <li>Envie a prévia ao cliente</li>
          <li>Acompanhe o status e feedback</li>
        </ol>
      </div>
      
      <div className="p-4 bg-gray-100 rounded-md">
        <h3 className="font-bold mb-2">Status das Prévias</h3>
        <ul className="space-y-2">
          <li><span className="font-medium">Aguardando</span> - Prévia enviada, esperando visualização do cliente</li>
          <li><span className="font-medium">Feedback</span> - Cliente visualizou e deve enviar feedback</li>
          <li><span className="font-medium">Aprovado</span> - Cliente aprovou a prévia</li>
          <li><span className="font-medium">Processando</span> - Prévia em processo de produção</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPreviewGuide;
