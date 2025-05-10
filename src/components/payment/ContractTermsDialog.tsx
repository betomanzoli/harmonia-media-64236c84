
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ContractContent } from '../service-card/ContractContent';

export type PackageId = 'essencial' | 'premium' | 'profissional';

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
  // Use a title based on the package
  const getPackageTitle = () => {
    switch(packageId) {
      case 'essencial':
        return 'Pacote Essencial';
      case 'profissional':
        return 'Pacote Profissional';
      case 'premium':
        return 'Pacote Premium';
      default:
        return 'Contrato de Prestação de Serviços';
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Contrato de Prestação de Serviços - {getPackageTitle()}</DialogTitle>
          <DialogDescription>
            Por favor, leia com atenção o contrato abaixo antes de prosseguir com o pagamento.
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[400px] overflow-y-auto border border-border rounded-md p-4 my-4">
          <ContractContent packageId={packageId} />
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
            className="bg-harmonia-green hover:bg-harmonia-green/90 text-white"
          >
            {isLoading ? "Processando..." : "Aceitar e Prosseguir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContractTermsDialog;
