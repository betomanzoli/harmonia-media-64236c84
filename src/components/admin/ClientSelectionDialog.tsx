
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCustomers } from '@/hooks/admin/useCustomers';

interface ClientSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectClient: (option: 'new' | 'existing', clientId?: string) => void;
}

const ClientSelectionDialog: React.FC<ClientSelectionDialogProps> = ({ 
  open, 
  onClose,
  onSelectClient 
}) => {
  const { customers, isLoading } = useCustomers();
  const [search, setSearch] = useState('');
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    customer.email.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Selecionar Cliente</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div>
            <Button 
              onClick={() => onSelectClient('new')}
              className="w-full"
              variant="outline"
            >
              Criar Novo Cliente
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar cliente existente..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">Carregando clientes...</div>
            ) : filteredCustomers.length > 0 ? (
              filteredCustomers.map(customer => (
                <div 
                  key={customer.id}
                  className="p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => onSelectClient('existing', customer.id)}
                >
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-gray-500">{customer.email}</div>
                  {customer.phone && (
                    <div className="text-xs text-gray-400">{customer.phone}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                {search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientSelectionDialog;
