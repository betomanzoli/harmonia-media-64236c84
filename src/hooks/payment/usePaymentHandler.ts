
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import emailService from '@/services/emailService';
import { PackageId, PackageInfo } from '@/lib/payment/packageData';
import { calculateExtrasTotal, parsePackagePrice } from '@/lib/payment/priceUtils';
import { createOrderData } from '@/lib/payment/orderUtils';
import { PaymentData } from './types';

export function usePaymentHandler(
  packageId: PackageId,
  selectedPackage: PackageInfo,
  qualificationData: any,
  selectedExtras: string[] = []
) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [paymentIframeUrl, setPaymentIframeUrl] = useState('');
  
  // This function handles direct payment links instead of embedding an iframe
  const handlePaymentMethod = async (method: string) => {
    setIsLoading(true);
    
    try {
      // Calculate values
      const extrasTotal = calculateExtrasTotal(selectedExtras);
      const packagePrice = parsePackagePrice(selectedPackage.price);
      const totalPrice = packagePrice + extrasTotal;
      
      // Generate order ID
      const orderId = `HAR-${Date.now()}`;
      
      // Store payment data in localStorage
      const paymentData: PaymentData = {
        method,
        packageId,
        packageName: selectedPackage.name,
        price: selectedPackage.price,
        extras: selectedExtras,
        extrasTotal,
        total: `R$ ${totalPrice.toFixed(2).replace('.', ',')}`,
        date: new Date().toISOString(),
        orderId
      };
      
      localStorage.setItem('paymentData', JSON.stringify(paymentData));
      
      // Setup return URL for redirect after payment
      const returnUrl = `${window.location.origin}/pagamento-retorno?packageId=${packageId}&orderId=${orderId}`;
      
      // Instead of creating an iframe, we'll redirect to the payment processing page
      // which will handle the specific payment links
      navigate(`/pagamento-processando?orderId=${orderId}&packageId=${packageId}&returnUrl=${encodeURIComponent(returnUrl)}`);
      
    } catch (error) {
      console.error('Erro no processamento do pagamento:', error);
      toast({
        title: "Erro no pagamento",
        description: "Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isPaymentSuccess,
    handlePaymentMethod,
    paymentIframeUrl
  };
}

export type { PaymentData } from './types';
