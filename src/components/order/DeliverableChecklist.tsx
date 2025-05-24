
import React, { useState } from 'react';
import { CheckSquare, Square, Clock, CheckCircle, AlertCircle, File } from 'lucide-react';

interface DeliverableChecklistProps {
  packageType: string;
  orderId: string;
}

const DeliverableChecklist: React.FC<DeliverableChecklistProps> = ({ 
  packageType,
  orderId
}) => {
  // Simulated deliverables based on package type
  const getDeliverables = () => {
    const baseDeliverables = [
      { id: '1', name: 'Composição da Música', completed: true, date: '2023-05-15' },
      { id: '2', name: 'Mixagem', completed: true, date: '2023-05-18' },
      { id: '3', name: 'Arquivo Final em MP3', completed: false, date: null }
    ];
    
    if (packageType === 'premium') {
      return [
        ...baseDeliverables,
        { id: '4', name: 'Partitura', completed: false, date: null },
        { id: '5', name: 'Faixas Separadas (Stems)', completed: false, date: null },
        { id: '6', name: 'Arquivo Final em WAV 48kHz/24bit', completed: false, date: null }
      ];
    }
    
    if (packageType === 'profissional') {
      return [
        ...baseDeliverables,
        { id: '4', name: 'Faixas Separadas (Stems)', completed: false, date: null },
        { id: '5', name: 'Arquivo Final em WAV 48kHz/24bit', completed: false, date: null }
      ];
    }
    
    return baseDeliverables;
  };
  
  const [deliverables, setDeliverables] = useState(getDeliverables());
  
  const toggleDeliverable = (id: string) => {
    setDeliverables(prev => 
      prev.map(item => 
        item.id === id
          ? { ...item, completed: !item.completed, date: !item.completed ? new Date().toISOString().split('T')[0] : null }
          : item
      )
    );
  };
  
  const completedCount = deliverables.filter(d => d.completed).length;
  const progress = Math.round((completedCount / deliverables.length) * 100);
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Checklist de Entregáveis</h3>
      
      <div className="flex items-center mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
          <div 
            className="bg-harmonia-green h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      
      <div className="space-y-3">
        {deliverables.map((deliverable) => (
          <div 
            key={deliverable.id}
            className={`flex items-center p-3 rounded-md border ${
              deliverable.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
            }`}
            onClick={() => toggleDeliverable(deliverable.id)}
          >
            <div className="mr-3 cursor-pointer">
              {deliverable.completed ? (
                <CheckSquare className="h-5 w-5 text-green-600" />
              ) : (
                <Square className="h-5 w-5 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1">
              <div className={`font-medium ${deliverable.completed ? 'text-green-700' : ''}`}>
                {deliverable.name}
              </div>
              {deliverable.completed && deliverable.date && (
                <div className="text-xs text-gray-500 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  Concluído em {deliverable.date}
                </div>
              )}
            </div>
            
            <div>
              {deliverable.completed ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {packageType === 'premium' && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-start">
            <File className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
            <div>
              <h4 className="font-medium text-blue-800">Entregáveis Adicionais</h4>
              <p className="text-sm text-blue-600 mt-1">
                Este pacote premium inclui entregáveis extras como partitura e faixas separadas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliverableChecklist;
