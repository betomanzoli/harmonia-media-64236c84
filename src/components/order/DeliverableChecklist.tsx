
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface DeliverableChecklistProps {
  packageType: string;
  orderId: string;
}

const DeliverableChecklist: React.FC<DeliverableChecklistProps> = ({ packageType, orderId }) => {
  // Mock data for demonstration purposes
  const [items, setItems] = useState(() => {
    const baseItems = [
      { id: 'comp', label: 'Composição musical', completed: false },
      { id: 'demo', label: 'Demo simplificado', completed: false },
      { id: 'melody', label: 'Melodia principal', completed: false },
      { id: 'lyrics', label: 'Letra finalizada', completed: false }
    ];
    
    const profItems = [
      ...baseItems,
      { id: 'arr', label: 'Arranjo completo', completed: false },
      { id: 'mix', label: 'Mixagem básica', completed: false }
    ];
    
    const premiumItems = [
      ...profItems,
      { id: 'master', label: 'Masterização profissional', completed: false },
      { id: 'stems', label: 'Stems de áudio', completed: false },
      { id: 'revisions', label: 'Revisões ilimitadas', completed: false }
    ];
    
    if (packageType.toLowerCase() === 'premium') {
      return premiumItems;
    } else if (packageType.toLowerCase() === 'profissional') {
      return profItems;
    } else {
      return baseItems;
    }
  });
  
  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };
  
  const completedCount = items.filter(item => item.completed).length;
  const progressPercentage = Math.round((completedCount / items.length) * 100);
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Checklist de Entregáveis</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Pacote: {packageType.charAt(0).toUpperCase() + packageType.slice(1)}</span>
          <span>•</span>
          <span>{completedCount}/{items.length} concluídos</span>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-harmonia-green h-2 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="space-y-3 mt-4">
        {items.map(item => (
          <div key={item.id} className="flex items-start space-x-2">
            <Checkbox 
              id={`${item.id}-${orderId}`} 
              checked={item.completed}
              onCheckedChange={() => toggleItem(item.id)}
            />
            <Label 
              htmlFor={`${item.id}-${orderId}`}
              className={`text-sm ${item.completed ? 'line-through text-gray-500' : ''}`}
            >
              {item.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliverableChecklist;
