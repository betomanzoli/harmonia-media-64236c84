
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, UserCheck } from 'lucide-react';

interface ClientSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectClient: (option: 'new' | 'existing', clientId?: string) => void;
}

const ClientSelectionDialog: React.FC<ClientSelectionDialogProps> = ({
  open,
  onClose,
  onSelectClient,
}) => {
  // Mock client data - in a real app this would come from a database
  const mockClients = [
    { id: 'client1', name: 'João Silva', email: 'joao@example.com' },
    { id: 'client2', name: 'Maria Santos', email: 'maria@example.com' },
    { id: 'client3', name: 'Carlos Oliveira', email: 'carlos@example.com' },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Selecionar Cliente</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <Button 
            variant="outline" 
            className="justify-start gap-2"
            onClick={() => onSelectClient('new')}
          >
            <Plus className="h-4 w-4" />
            Criar novo cliente
          </Button>
          
          <div className="text-sm font-medium">Ou selecionar cliente existente:</div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {mockClients.map(client => (
              <Button
                key={client.id}
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => onSelectClient('existing', client.id)}
              >
                <UserCheck className="h-4 w-4" />
                <div className="flex flex-col items-start text-left">
                  <span>{client.name}</span>
                  <span className="text-xs text-muted-foreground">{client.email}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientSelectionDialog;
