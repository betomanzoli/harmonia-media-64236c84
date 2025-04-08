
import React from 'react';
import AdminGuide from './AdminGuide';

const InvoicesGuide: React.FC = () => {
  const sections = [
    {
      title: "Visão Geral",
      content: "Esta página permite gerenciar todo o ciclo de emissão de notas fiscais para os pedidos processados na plataforma."
    },
    {
      title: "Funcionalidades",
      content: (
        <ul className="text-sm text-gray-400 space-y-2">
          <li>• <span className="font-medium text-foreground">Busca e Filtros:</span> Localize notas fiscais por cliente, pedido ou número da NF.</li>
          <li>• <span className="font-medium text-foreground">Ações em Lote:</span> Selecione múltiplas notas para gerar ou enviar em uma única operação.</li>
          <li>• <span className="font-medium text-foreground">Geração de NF:</span> Emita notas fiscais para pedidos pendentes.</li>
          <li>• <span className="font-medium text-foreground">Envio por Email:</span> Envie notas fiscais diretamente para os clientes.</li>
        </ul>
      )
    },
    {
      title: "Status das Notas",
      content: (
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• <span className="text-yellow-500">Pendente:</span> Aguardando geração de nota fiscal.</li>
          <li>• <span className="text-blue-500">Gerada:</span> Nota fiscal emitida, aguardando envio.</li>
          <li>• <span className="text-green-500">Enviada:</span> Nota fiscal enviada ao cliente.</li>
          <li>• <span className="text-red-500">Cancelada:</span> Nota fiscal cancelada.</li>
        </ul>
      )
    },
    {
      title: "Integrações",
      content: "O sistema pode ser integrado com sistemas de emissão de NF-e como NFe.io, Nuvem Fiscal ou diretamente com sistemas governamentais."
    }
  ];

  return (
    <AdminGuide 
      title="Guia de Notas Fiscais" 
      sections={sections} 
      storageUrl="https://drive.google.com/drive/folders/1uuhCHv0c5eePU9_m-0BdYiuo0-3vUwVJ"
    />
  );
};

export default InvoicesGuide;
