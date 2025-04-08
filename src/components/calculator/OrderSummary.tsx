
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Info, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { siteConfig } from '@/config/site';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ContractContent } from '@/components/service-card/ContractDetails';
import contractAcceptanceLogger from '@/services/contractAcceptanceLogger';

interface OrderSummaryProps {
  basePrice: number;
  extrasPrice: number;
  finalPrice: number;
  discount: number;
  selectedPackage: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  basePrice, 
  extrasPrice, 
  finalPrice, 
  discount, 
  selectedPackage 
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptingTerms, setAcceptingTerms] = useState(false);
  
  const formatPackageName = () => {
    switch (selectedPackage) {
      case 'essencial':
        return 'Essencial';
      case 'profissional':
        return 'Profissional';
      case 'premium':
        return 'Premium';
      default:
        return 'Essencial';
    }
  };
  
  // Get contract content based on package 
  const getContractContent = () => {
    switch (selectedPackage) {
      case 'premium':
        return ContractContent.getPremiumContract();
      case 'profissional':
        return ContractContent.getProfissionalContract();
      default:
        return ContractContent.getEssencialContract();
    }
  };
  
  const proceedToPayment = () => {
    // Open terms dialog first
    setIsTermsDialogOpen(true);
  };
  
  const handleAcceptTerms = async () => {
    if (!acceptedTerms) {
      toast({
        title: "Aceitação necessária",
        description: "Você precisa aceitar os termos para prosseguir.",
        variant: "destructive"
      });
      return;
    }
    
    setAcceptingTerms(true);
    
    try {
      // Get user data from localStorage if available
      const qualificationData = localStorage.getItem('qualificationData');
      const userData = qualificationData ? JSON.parse(qualificationData) : null;
      
      // Log contract acceptance
      await contractAcceptanceLogger.logAcceptance({
        packageId: selectedPackage as any,
        customerName: userData?.name || 'Cliente Anônimo',
        customerEmail: userData?.email || 'email@não-fornecido.com',
        acceptanceDate: new Date().toISOString(),
        ipAddress: 'client-side',
        userAgent: navigator.userAgent,
        contractVersion: '1.0',
        source: 'calculator-flow'
      });
      
      // Store in localStorage to avoid asking again in the same session
      localStorage.setItem(`acceptedTerms_${selectedPackage}`, 'true');
      
      toast({
        title: "Configuração salva!",
        description: "Você será redirecionado para a página de pagamento.",
      });
      
      // Close dialog and navigate
      setIsTermsDialogOpen(false);
      navigate(`/pagamento/${selectedPackage}`);
    } catch (error) {
      console.error('Error logging contract acceptance:', error);
      toast({
        title: "Erro ao registrar aceitação",
        description: "Ocorreu um erro ao registrar a aceitação dos termos.",
        variant: "destructive"
      });
    } finally {
      setAcceptingTerms(false);
    }
  };
  
  return (
    <div className="lg:sticky lg:top-24 h-fit">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-400">Pacote {formatPackageName()}</span>
            <span>R${basePrice.toFixed(2)}</span>
          </div>
          
          {extrasPrice > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-400">Extras</span>
              <span>+R${extrasPrice.toFixed(2)}</span>
            </div>
          )}
          
          {discount > 0 && (
            <div className="flex justify-between text-harmonia-green">
              <span>Desconto ({discount}%)</span>
              <span>-R${((basePrice + extrasPrice) * discount / 100).toFixed(2)}</span>
            </div>
          )}
          
          <div className="pt-3 border-t border-border flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>R${finalPrice.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button 
            className="w-full bg-harmonia-green hover:bg-harmonia-green/90 text-white h-12"
            onClick={proceedToPayment}
          >
            Prosseguir para Pagamento
          </Button>
          
          <div className="flex items-start gap-2 text-sm text-gray-400 p-3 bg-background rounded-md">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p>Os preços são em reais (BRL) e incluem todos os impostos aplicáveis.</p>
              <p className="mt-1">O briefing completo será preenchido após a confirmação do pagamento.</p>
            </div>
          </div>
        </div>
        
        {/* Terms Acceptance Dialog */}
        <Dialog open={isTermsDialogOpen} onOpenChange={setIsTermsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Contrato de Prestação de Serviços - Pacote {formatPackageName()}</DialogTitle>
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
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
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
                onClick={() => setIsTermsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleAcceptTerms} 
                disabled={!acceptedTerms || acceptingTerms}
                className="bg-harmonia-green hover:bg-harmonia-green/90"
              >
                {acceptingTerms ? 'Processando...' : 'Aceitar e Prosseguir'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OrderSummary;
