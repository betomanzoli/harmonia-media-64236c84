
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ExtraService } from '@/types/project.types';
import { Plus, Trash } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface ExtraServicesProps {
  services: ExtraService[];
  onServicesChange: (services: ExtraService[]) => void;
  editable?: boolean;
}

const ExtraServices: React.FC<ExtraServicesProps> = ({
  services,
  onServicesChange,
  editable = false
}) => {
  const [newService, setNewService] = useState<Partial<ExtraService>>({
    name: '',
    description: '',
    price: 0
  });

  const handleServiceSelection = (id: string, checked: boolean) => {
    const updatedServices = services.map(service => 
      service.id === id ? { ...service, selected: checked } : service
    );
    onServicesChange(updatedServices);
  };

  const handleAddService = () => {
    if (!newService.name || newService.price === undefined) return;
    
    const service: ExtraService = {
      id: `service-${Date.now()}`,
      name: newService.name,
      description: newService.description || '',
      price: newService.price,
      selected: false
    };
    
    onServicesChange([...services, service]);
    setNewService({ name: '', description: '', price: 0 });
  };

  const handleRemoveService = (id: string) => {
    const updatedServices = services.filter(service => service.id !== id);
    onServicesChange(updatedServices);
  };

  const totalSelected = services
    .filter(service => service.selected)
    .reduce((sum, service) => sum + service.price, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços Extras</CardTitle>
        <CardDescription>Adicione ou selecione serviços extras para este projeto</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {services.length === 0 ? (
            <p className="text-gray-500 text-sm italic">Nenhum serviço extra disponível</p>
          ) : (
            services.map(service => (
              <div key={service.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-start gap-2">
                  <Checkbox 
                    id={`service-${service.id}`}
                    checked={service.selected}
                    onCheckedChange={(checked) => handleServiceSelection(service.id, checked === true)}
                  />
                  <div>
                    <Label 
                      htmlFor={`service-${service.id}`}
                      className="font-medium cursor-pointer"
                    >
                      {service.name} - {formatCurrency(service.price)}
                    </Label>
                    {service.description && (
                      <p className="text-sm text-gray-500">{service.description}</p>
                    )}
                  </div>
                </div>
                
                {editable && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveService(service.id)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
        
        {totalSelected > 0 && (
          <div className="pt-2 border-t">
            <p className="text-right">
              <span className="text-sm text-gray-500">Total de extras:</span>{' '}
              <span className="font-semibold">{formatCurrency(totalSelected)}</span>
            </p>
          </div>
        )}
        
        {editable && (
          <div className="pt-4 border-t space-y-3">
            <h3 className="text-sm font-medium">Adicionar Novo Serviço</h3>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <Input 
                  placeholder="Nome do serviço" 
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                />
              </div>
              <div>
                <Input 
                  type="number"
                  placeholder="Preço" 
                  value={newService.price === 0 ? '' : newService.price}
                  onChange={(e) => setNewService({...newService, price: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
            
            <Input 
              placeholder="Descrição (opcional)" 
              value={newService.description}
              onChange={(e) => setNewService({...newService, description: e.target.value})}
            />
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleAddService}
              disabled={!newService.name || !newService.price}
            >
              <Plus className="h-4 w-4 mr-1" /> Adicionar Serviço
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExtraServices;
