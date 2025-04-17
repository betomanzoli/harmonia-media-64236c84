
import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContractContent } from './ContractContent';

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  acceptedTerms: boolean;
  onAcceptedTermsChange: (accepted: boolean) => void;
  onAccept: () => void;
}

const TermsDialog: React.FC<TermsDialogProps> = ({
  open,
  onOpenChange,
  title,
  acceptedTerms,
  onAcceptedTermsChange,
  onAccept,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Termos de Serviço - {title}</DialogTitle>
          <DialogDescription>
            Por favor, leia e aceite os termos abaixo para prosseguir.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 max-h-[50vh] mt-4 rounded-md border p-4">
          <ContractContent />
        </ScrollArea>
        
        <div className="flex items-center space-x-2 my-4">
          <Checkbox 
            id="accept-terms" 
            checked={acceptedTerms}
            onCheckedChange={(checked) => onAcceptedTermsChange(checked as boolean)}
          />
          <Label htmlFor="accept-terms" className="text-sm">
            Li e aceito os termos de serviço
          </Label>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={onAccept}
            disabled={!acceptedTerms}
            className="bg-harmonia-green hover:bg-harmonia-green/90"
          >
            Aceitar e Prosseguir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsDialog;
