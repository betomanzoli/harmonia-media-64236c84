
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, CreditCard, Percent, FileText } from 'lucide-react';
import { PackageId } from '@/lib/payment/packageData';
import { packagePaymentLinks } from '@/lib/payment/paymentLinks';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ContractContent } from '@/components/service-card/ContractDetails';

interface PaymentMethodsProps {
  isLoading: boolean;
  onSelectMethod: (method: string, useDiscount?: boolean) => void;
  packageId: PackageId;
  hasAcceptedTerms: boolean;
  onAcceptTerms: () => Promise<boolean>;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  isLoading, 
  onSelectMethod, 
  packageId,
  hasAcceptedTerms,
  onAcceptTerms
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [showCouponField, setShowCouponField] = useState(false);
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [acceptingTerms, setAcceptingTerms] = useState(false);
  const [localAcceptedTerms, setLocalAcceptedTerms] = useState(false);
  const { toast } = useToast();
  
  const paymentLinks = packagePaymentLinks[packageId];
  const validDiscountCode = paymentLinks?.discountCode || '';
  
  useEffect(() => {
    // Check if terms have been accepted previously in this flow
    setLocalAcceptedTerms(hasAcceptedTerms);
  }, [hasAcceptedTerms]);
  
  const handlePaymentClick = async (method: string, useDiscount = false) => {
    if (hasAcceptedTerms) {
      // Terms already accepted, proceed with payment
      onSelectMethod(method, useDiscount);
    } else {
      // Need to accept terms first
      setIsTermsDialogOpen(true);
      
      // Store payment method details for after acceptance
      sessionStorage.setItem('pendingPaymentMethod', method);
      sessionStorage.setItem('pendingPaymentDiscount', useDiscount.toString());
    }
  };
  
  const handleAcceptTerms = async () => {
    setAcceptingTerms(true);
    
    try {
      const success = await onAcceptTerms();
      
      if (success) {
        setIsTermsDialogOpen(false);
        setLocalAcceptedTerms(true);
        
        // Get stored payment method details
        const method = sessionStorage.getItem('pendingPaymentMethod') || 'MercadoPago';
        const useDiscount = sessionStorage.getItem('pendingPaymentDiscount') === 'true';
        
        // Clear stored payment method details
        sessionStorage.removeItem('pendingPaymentMethod');
        sessionStorage.removeItem('pendingPaymentDiscount');
        
        // Proceed with payment
        onSelectMethod(method, useDiscount);
      } else {
        toast({
          title: "Erro na aceitação dos termos",
          description: "Ocorreu um erro ao registrar sua aceitação dos termos. Tente novamente.",
          variant: "destructive"
        });
      }
    } finally {
      setAcceptingTerms(false);
    }
  };

  const handleStandardPayment = () => {
    handlePaymentClick('MercadoPago');
  };
  
  const handleDiscountPayment = () => {
    // If we're showing the coupon field, validate the code
    if (showCouponField) {
      if (couponCode.toUpperCase() === validDiscountCode) {
        toast({
          title: "Cupom aplicado!",
          description: `Cupom ${validDiscountCode} aplicado com sucesso!`,
        });
        handlePaymentClick('MercadoPageDiscount', true);
      } else {
        // Invalid coupon code
        toast({
          title: "Código inválido",
          description: `Código de cupom inválido. Use ${validDiscountCode} para este pacote.`,
          variant: "destructive"
        });
      }
    } else {
      // Just show the coupon field
      setShowCouponField(true);
    }
  };
  
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
    <div className="md:col-span-2">
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Formas de Pagamento</h2>
        <p className="text-gray-400 mb-6">Escolha uma opção de pagamento abaixo</p>
        
        {hasAcceptedTerms && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 flex items-center">
            <FileText className="h-4 w-4 mr-2 text-green-600" />
            <span className="text-sm">Você já aceitou os termos de serviço.</span>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="border border-border rounded-lg p-4 hover:border-blue-500/50 transition cursor-pointer bg-gradient-to-r from-blue-50/10 to-blue-100/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Pagamento Normal</h3>
                  <p className="text-sm text-gray-400">Pagar com cartão, boleto ou Pix pelo MercadoPago</p>
                </div>
              </div>
              <Button 
                disabled={isLoading} 
                onClick={handleStandardPayment}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isLoading ? 'Processando...' : 'Pagar agora'}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4 hover:border-green-500/50 transition cursor-pointer bg-gradient-to-r from-green-50/10 to-green-100/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                  <Percent className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">Cupom de Desconto</h3>
                  <p className="text-sm text-gray-400">Pagar com desconto especial pelo MercadoPago</p>
                  
                  {showCouponField && (
                    <div className="mt-2 flex items-center">
                      <input 
                        type="text" 
                        placeholder="Digite o código do cupom"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="text-sm border border-border rounded px-2 py-1 w-48 bg-background"
                      />
                    </div>
                  )}
                </div>
              </div>
              <Button 
                disabled={isLoading} 
                onClick={handleDiscountPayment}
                className="bg-green-500 hover:bg-green-600"
              >
                {isLoading ? 'Processando...' : (showCouponField ? 'Aplicar cupom' : 'Usar cupom de desconto')}
                <Percent className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="text-sm text-gray-400">
          <p className="mb-2">Informações importantes:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Todos os pagamentos são processados em Reais (BRL)</li>
            <li>Pagamentos são processados com segurança pelo MercadoPago</li>
            <li>O prazo de entrega é contado a partir da confirmação do pagamento</li>
            <li>Seus dados de pagamento são protegidos por criptografia</li>
            <li>Após o pagamento, você será redirecionado de volta para preencher o briefing</li>
            <li>Serviços extras poderão ser contratados posteriormente</li>
          </ul>
        </div>
        
        {/* Terms Acceptance Dialog */}
        <Dialog open={isTermsDialogOpen} onOpenChange={setIsTermsDialogOpen}>
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
                checked={localAcceptedTerms}
                onCheckedChange={(checked) => setLocalAcceptedTerms(!!checked)}
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
                disabled={!localAcceptedTerms || acceptingTerms}
                className="bg-harmonia-green hover:bg-harmonia-green/90"
              >
                {acceptingTerms ? 'Processando...' : 'Aceitar e Prosseguir'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default PaymentMethods;
