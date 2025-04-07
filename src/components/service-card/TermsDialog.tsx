
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ContractContent from './ContractContent';

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  acceptedTerms: boolean;
  onAcceptedTermsChange: (checked: boolean) => void;
  onAccept: () => void;
}

const TermsDialog: React.FC<TermsDialogProps> = ({
  open,
  onOpenChange,
  title,
  acceptedTerms,
  onAcceptedTermsChange,
  onAccept
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Contrato de Prestação de Serviços - {title}</DialogTitle>
          <DialogDescription>
            Por favor, leia com atenção o contrato abaixo antes de prosseguir.
          </DialogDescription>
        </DialogHeader>
        
        <ContractContent title={title} />
        
        <div className="flex items-start space-x-2 mt-4">
          <Checkbox 
            id="terms" 
            checked={acceptedTerms}
            onCheckedChange={(checked) => {
              onAcceptedTermsChange(checked as boolean);
            }}
          />
          <Label 
            htmlFor="terms"
            className="text-sm leading-tight"
          >
            Li e aceito os termos e condições deste contrato.
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
