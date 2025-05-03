
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from 'lucide-react';

interface DeadlineExtensionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const DeadlineExtensionDialog: React.FC<DeadlineExtensionDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Estender Prazo</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja estender o prazo da prévia por mais 7 dias?
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-center py-4">
          <Clock className="h-12 w-12 text-amber-500" />
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Confirmar Extensão
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeadlineExtensionDialog;
