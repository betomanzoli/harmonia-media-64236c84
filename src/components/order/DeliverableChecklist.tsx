
import React, { useState } from 'react';
import { CheckSquare, Square, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DeliverableItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  packageTypes: string[];
}

const initialDeliverables: DeliverableItem[] = [
  {
    id: '1',
    title: 'Composição musical personalizada',
    description: 'Música original composta de acordo com o briefing',
    completed: false,
    packageTypes: ['essencial', 'profissional', 'premium']
  },
  {
    id: '2',
    title: 'Mix e masterização padrão',
    description: 'Mixagem e masterização básica para qualidade de reprodução',
    completed: false,
    packageTypes: ['essencial', 'profissional', 'premium']
  },
  {
    id: '3',
    title: 'Stems separados (faixas isoladas)',
    description: 'Arquivos individuais de cada instrumento ou elemento musical',
    completed: false,
    packageTypes: ['profissional', 'premium']
  },
  {
    id: '4',
    title: 'Masterização premium',
    description: 'Masterização avançada com maior dinâmica e qualidade',
    completed: false,
    packageTypes: ['premium']
  },
  {
    id: '5',
    title: 'Registro BN',
    description: 'Registro oficial da composição',
    completed: false,
    packageTypes: ['premium']
  },
  {
    id: '6',
    title: 'Formato MusicXML',
    description: 'Arquivo para edição em software de notação musical',
    completed: false,
    packageTypes: ['premium']
  },
  {
    id: '7',
    title: 'Versão final aprovada',
    description: 'Versão final da música após todos os ajustes solicitados',
    completed: false,
    packageTypes: ['essencial', 'profissional', 'premium']
  }
];

interface DeliverableChecklistProps {
  packageType: string;
  orderId: string;
  readOnly?: boolean;
}

export const DeliverableChecklist: React.FC<DeliverableChecklistProps> = ({
  packageType = 'essencial',
  orderId,
  readOnly = false
}) => {
  const { toast } = useToast();
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>(
    // Filter deliverables based on package type
    initialDeliverables.filter(item => item.packageTypes.includes(packageType))
  );
  
  const handleToggleItem = (id: string) => {
    if (readOnly) return;
    
    const updatedDeliverables = deliverables.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    
    setDeliverables(updatedDeliverables);
    
    // In a real implementation, this would save to a database
    console.log(`Toggled item ${id} for order ${orderId}`);
  };
  
  const handleSaveProgress = () => {
    // In a real implementation, this would save to a database
    console.log(`Saving progress for order ${orderId}`, deliverables);
    
    toast({
      title: "Progresso salvo",
      description: "O checklist de entregáveis foi atualizado com sucesso.",
    });
  };
  
  const getCompletionPercentage = () => {
    const completed = deliverables.filter(item => item.completed).length;
    const total = deliverables.length;
    return Math.round((completed / total) * 100);
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Checklist de Entregáveis</span>
          <span className="text-sm text-muted-foreground">
            {getCompletionPercentage()}% concluído
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {deliverables.map(item => (
            <div 
              key={item.id}
              className={`flex items-start p-3 rounded-md border ${
                item.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-card border-border'
              }`}
              onClick={() => handleToggleItem(item.id)}
            >
              <div className={`mr-2 ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}>
                {item.completed ? (
                  <CheckSquare className="h-5 w-5 text-green-600" />
                ) : (
                  <Square className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-grow">
                <h3 className={`font-medium ${item.completed ? 'text-green-700' : ''}`}>
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {!readOnly && (
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={handleSaveProgress}
              className="bg-harmonia-green hover:bg-harmonia-green/90"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Salvar Progresso
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliverableChecklist;
