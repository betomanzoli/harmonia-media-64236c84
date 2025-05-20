
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomers } from '@/hooks/admin/useCustomers';
import { Loader2 } from 'lucide-react';

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
  const [selectedClient, setSelectedClient] = useState<string>('');

  // Reset selected client when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedClient('');
    }
  }, [open]);

  const handleCreateNew = () => {
    onSelectClient('new');
  };

  const handleSelectExisting = () => {
    if (selectedClient) {
      onSelectClient('existing', selectedClient);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Selecionar Cliente</DialogTitle>
          <DialogDescription>
            Escolha um cliente existente ou crie um novo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="client">Cliente Existente</Label>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <Select onValueChange={setSelectedClient} value={selectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} ({customer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DialogFooter className="flex space-x-2 justify-between sm:justify-between">
          <Button 
            variant="outline" 
            onClick={handleCreateNew}
          >
            Criar Novo Cliente
          </Button>
          <Button 
            onClick={handleSelectExisting} 
            disabled={!selectedClient}
          >
            Selecionar Cliente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientSelectionDialog;
