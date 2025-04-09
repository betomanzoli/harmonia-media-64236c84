
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { CreditCard, Percent, FileText } from 'lucide-react';
import { PackageId } from '@/lib/payment/packageData';
import { packagePaymentLinks } from '@/lib/payment/paymentLinks';
import { useToast } from '@/hooks/use-toast';
import PaymentOption from './PaymentOption';
import CouponField from './CouponField';
import ContractTermsDialog from './ContractTermsDialog';
import PaymentInfoList from './PaymentInfoList';

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
    // If we're showing the coupon field, validate the code in the CouponField component
    if (!showCouponField) {
      // Just show the coupon field
      setShowCouponField(true);
    }
  };
  
  const handleApplyCoupon = (code: string) => {
    if (code.toUpperCase() === validDiscountCode) {
      handlePaymentClick('MercadoPageDiscount', true);
    }
  };
  
  return (
    <div className="md:col-span-2">
      <Card className="p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Formas de Pagamento</h2>
        <p className="text-gray-400 mb-3 text-sm">Escolha uma opção de pagamento abaixo</p>
        
        {hasAcceptedTerms && (
          <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-md text-green-700 flex items-center">
            <FileText className="h-4 w-4 mr-2 text-green-600" />
            <span className="text-sm">Você já aceitou os termos de serviço.</span>
          </div>
        )}
        
        <div className="space-y-3">
          <PaymentOption
            title="Pagamento Normal"
            description="Pagar com cartão, boleto ou Pix pelo MercadoPago"
            icon={<CreditCard className="w-4 h-4 text-blue-500" />}
            buttonText="Pagar agora"
            onClick={handleStandardPayment}
            isLoading={isLoading}
            variant="standard"
          />
          
          <PaymentOption
            title="Cupom de Desconto"
            description="Pagar com desconto especial pelo MercadoPago"
            icon={<Percent className="w-4 h-4 text-green-500" />}
            buttonText={showCouponField ? "Aplicar cupom" : "Usar cupom"}
            onClick={handleDiscountPayment}
            isLoading={isLoading}
            variant="discount"
          >
            {showCouponField && (
              <CouponField 
                onApplyCoupon={handleApplyCoupon}
                validDiscountCode={validDiscountCode}
              />
            )}
          </PaymentOption>
        </div>
        
        <PaymentInfoList />
        
        {/* Terms Acceptance Dialog */}
        <ContractTermsDialog
          open={isTermsDialogOpen}
          onOpenChange={setIsTermsDialogOpen}
          packageId={packageId}
          accepted={localAcceptedTerms}
          onAcceptedChange={setLocalAcceptedTerms}
          onConfirm={handleAcceptTerms}
          isLoading={acceptingTerms}
        />
      </Card>
    </div>
  );
};

export default PaymentMethods;
