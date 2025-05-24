
import React from 'react';

interface DeliverableChecklistProps {
  items: Array<{
    id: string;
    name: string;
    status: 'pending' | 'completed' | 'delayed';
    dueDate?: string;
  }>;
}

const DeliverableChecklist: React.FC<DeliverableChecklistProps> = ({ items }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Entregáveis do Projeto</h3>
      <ul className="divide-y">
        {items.map(item => (
          <li key={item.id} className="py-3 flex items-center justify-between">
            <div>
              <span className="font-medium">{item.name}</span>
              {item.dueDate && (
                <span className="text-sm text-gray-500 ml-2">Prazo: {item.dueDate}</span>
              )}
            </div>
            <div>
              {item.status === 'completed' ? (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Completo
                </span>
              ) : item.status === 'delayed' ? (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                  Atrasado
                </span>
              ) : (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Pendente
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeliverableChecklist;
