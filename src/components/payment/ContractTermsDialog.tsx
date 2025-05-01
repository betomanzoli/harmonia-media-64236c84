
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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

const getContractContent = (packageId: PackageId): string => {
  // Contrato base para todos os pacotes
  let contractBase = `
    <h3 class="text-lg font-semibold mb-2">Contrato de Prestação de Serviços - Pacote ${packageId.charAt(0).toUpperCase() + packageId.slice(1)}</h3>
    
    <p class="mb-2">Por meio deste instrumento particular, a empresa HarmonIA, prestadora de serviços de produção musical, doravante denominada CONTRATADA, e o cliente, doravante denominado CONTRATANTE, estabelecem as seguintes cláusulas:</p>
    
    <h4 class="font-medium mt-4 mb-2">1. OBJETO</h4>
    <p>1.1. O presente contrato tem como objeto a prestação de serviços de criação e produção de uma música personalizada, de acordo com as informações fornecidas pelo CONTRATANTE através do briefing.</p>
    
    <h4 class="font-medium mt-4 mb-2">2. DESCRIÇÃO DOS SERVIÇOS</h4>
    <p>2.1. A CONTRATADA se compromete a prestar os seguintes serviços:</p>
    <ul class="list-disc pl-5 my-2">
      <li>Composição de música original com letra personalizada;</li>
      <li>Produção musical completa;</li>
      <li>Envio de prévia(s) para aprovação do CONTRATANTE;</li>
      <li>Entrega da música finalizada em formato digital após aprovação.</li>
    </ul>
    
    <h4 class="font-medium mt-4 mb-2">3. PRAZO DE ENTREGA</h4>
    <p>3.1. O prazo para entrega da primeira prévia será de até 10 dias úteis após a aprovação do briefing e confirmação do pagamento.</p>
    <p>3.2. O prazo para entrega da versão final será de até 7 dias úteis após a aprovação da última prévia pelo CONTRATANTE.</p>
    
    <h4 class="font-medium mt-4 mb-2">4. ALTERAÇÕES E AJUSTES</h4>
    <p>4.1. O CONTRATANTE terá direito a solicitar alterações conforme os termos do pacote contratado.</p>
    
    <h4 class="font-medium mt-4 mb-2">5. PAGAMENTO</h4>
    <p>5.1. O CONTRATANTE pagará à CONTRATADA o valor correspondente ao pacote escolhido.</p>
    <p>5.2. O pagamento deverá ser efetuado integralmente no ato da contratação dos serviços.</p>
    
    <h4 class="font-medium mt-4 mb-2">6. DIREITOS AUTORAIS</h4>
    <p>6.1. A CONTRATADA cede ao CONTRATANTE os direitos de uso da música para fins não comerciais.</p>
    <p>6.2. A CONTRATADA manterá os créditos da composição e produção musical.</p>
    
    <h4 class="font-medium mt-4 mb-2">7. CONFIDENCIALIDADE</h4>
    <p>7.1. A CONTRATADA se compromete a manter sigilo sobre todas as informações fornecidas pelo CONTRATANTE no briefing.</p>
    
    <h4 class="font-medium mt-4 mb-2">8. RESCISÃO</h4>
    <p>8.1. Este contrato poderá ser rescindido por acordo entre as partes ou no caso de descumprimento de qualquer uma das cláusulas.</p>
  `;
  
  // Adicionar termos específicos para cada pacote
  switch(packageId) {
    case 'essencial':
      contractBase += `
        <h4 class="font-medium mt-4 mb-2">TERMOS ESPECÍFICOS DO PACOTE ESSENCIAL</h4>
        <p>- O CONTRATANTE terá direito a 1 (uma) versão da música com possibilidade de ajustes menores;</p>
        <p>- O prazo de entrega da primeira prévia será de até 10 dias úteis;</p>
        <p>- O CONTRATANTE terá direito a uso não comercial da música.</p>
      `;
      break;
    case 'premium':
      contractBase += `
        <h4 class="font-medium mt-4 mb-2">TERMOS ESPECÍFICOS DO PACOTE PREMIUM</h4>
        <p>- O CONTRATANTE terá direito a até 3 (três) versões da música;</p>
        <p>- O prazo de entrega da primeira prévia será de até 7 dias úteis;</p>
        <p>- Mixagem e masterização profissional incluídas;</p>
        <p>- O CONTRATANTE terá direito a uso não comercial da música.</p>
      `;
      break;
    case 'profissional':
      contractBase += `
        <h4 class="font-medium mt-4 mb-2">TERMOS ESPECÍFICOS DO PACOTE PROFISSIONAL</h4>
        <p>- O CONTRATANTE terá direito a múltiplas versões da música até sua completa satisfação;</p>
        <p>- O prazo de entrega da primeira prévia será de até 7 dias úteis;</p>
        <p>- Arranjo com músicos profissionais;</p>
        <p>- Acompanhamento prioritário durante todo o processo;</p>
        <p>- O CONTRATANTE receberá os direitos comerciais da música.</p>
      `;
      break;
  }
  
  contractBase += `
    <h4 class="font-medium mt-4 mb-2">9. DISPOSIÇÕES GERAIS</h4>
    <p>9.1. Ao aceitar este contrato, o CONTRATANTE declara estar de acordo com todos os termos e condições aqui estabelecidos.</p>
    <p>9.2. Os casos omissos serão resolvidos de acordo com a legislação vigente.</p>
    
    <p class="mt-6">Data: ${new Date().toLocaleDateString('pt-BR')}</p>
  `;
  
  return contractBase;
};

const ContractTermsDialog: React.FC<ContractTermsDialogProps> = ({
  open,
  onOpenChange,
  packageId,
  accepted,
  onAcceptedChange,
  onConfirm,
  isLoading
}) => {
  const contractContent = getContractContent(packageId);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Contrato de Prestação de Serviços - Pacote {packageId.charAt(0).toUpperCase() + packageId.slice(1)}</DialogTitle>
          <DialogDescription>
            Por favor, leia com atenção o contrato abaixo antes de prosseguir com o pagamento.
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[400px] overflow-y-auto border border-border rounded-md p-4 my-4">
          <div dangerouslySetInnerHTML={{ __html: contractContent }} />
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
