
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Plus } from 'lucide-react';
import { useClients } from '@/hooks/admin/useClients';

interface ClientSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectClient: (client: any) => void;
}

const ClientSelectionDialog: React.FC<ClientSelectionDialogProps> = ({
  isOpen,
  onOpenChange,
  onSelectClient
}) => {
  const { clients, isLoading } = useClients();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Selecionar Cliente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isLoading ? (
            <p>Carregando clientes...</p>
          ) : (
            <div className="space-y-2">
              {clients.map((client) => (
                <Button
                  key={client.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onSelectClient(client)}
                >
                  {client.name} - {client.email}
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientSelectionDialog;
