
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ContractContent } from '@/components/service-card/ContractDetails';
import { PackageId } from '@/lib/payment/packageData';

interface ContractTermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageId: PackageId;
  accepted: boolean;
  onAcceptedChange: (accepted: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const ContractTermsDialog: React.FC<ContractTermsDialogProps> = ({
  open,
  onOpenChange,
  packageId,
  accepted,
  onAcceptedChange,
  onConfirm,
  isLoading
}) => {
  // Get contract content based on package ID
  const getContractContent = () => {
    switch (packageId) {
      case 'premium':
        return ContractContent.getPremiumContract();
      case 'profissional':
        return ContractContent.getProfissionalContract();
      default:
        return ContractContent.getEssencialContract();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Contrato de Prestação de Serviços</DialogTitle>
          <DialogDescription>
            Por favor, leia com atenção o contrato abaixo antes de prosseguir com o pagamento.
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[400px] overflow-y-auto border border-border rounded-md p-4 my-4">
          <div dangerouslySetInnerHTML={{ __html: getContractContent() }} />
        </div>
        
        <div className="flex items-start space-x-2 mt-4">
          <Checkbox 
            id="terms" 
            checked={accepted}
            onCheckedChange={(checked) => onAcceptedChange(!!checked)}
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
            onClick={onConfirm} 
            disabled={!accepted || isLoading}
            className="bg-harmonia-green hover:bg-harmonia-green/90"
          >
            {isLoading ? 'Processando...' : 'Aceitar e Prosseguir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContractTermsDialog;
