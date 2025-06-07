
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContractContent } from '@/components/service-card/ContractDetails';

export type PackageId = 'essencial' | 'premium' | 'profissional' | 'express';

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
  // Obter o contrato específico para o pacote selecionado
  const getContractHtml = () => {
    switch(packageId) {
      case 'express':
        return ContractContent.getExpressContract();
      case 'essencial':
        return ContractContent.getEssencialContract();
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
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Contrato de Prestação de Serviços - {packageId.charAt(0).toUpperCase() + packageId.slice(1)}</DialogTitle>
          <DialogDescription>
            Por favor, leia com atenção o contrato abaixo antes de prosseguir com o pagamento.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 max-h-[50vh] overflow-auto mt-4 rounded-md border p-4">
          <div dangerouslySetInnerHTML={{ __html: getContractHtml() }} />
        </ScrollArea>
        
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
