
import React from 'react';

interface DeliverableChecklistProps {
  items?: string[];
}

const DeliverableChecklist: React.FC<DeliverableChecklistProps> = ({ items = [] }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Entregas</h3>
      {items.length > 0 ? (
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Nenhum item de entrega definido.</p>
      )}
    </div>
  );
};

export default DeliverableChecklist;
