
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import emailService from '@/services/emailService';
import { PackageId, PackageDetails } from '@/lib/payment/packageData';
import { calculateExtrasTotal, parsePackagePrice } from '@/lib/payment/priceUtils';
import { createOrderData } from '@/lib/payment/orderUtils';
import { packagePaymentLinks } from '@/lib/payment/paymentLinks';
import { PaymentData } from './types';
import contractAcceptanceLogger from '@/services/contractAcceptanceLogger';

export function usePaymentHandler(
  packageId: PackageId,
  selectedPackage: PackageDetails,
  qualificationData: any,
  selectedExtras: string[] = []
) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [paymentIframeUrl, setPaymentIframeUrl] = useState('');
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  
  // Check if terms have already been accepted for this session
  useState(() => {
    // Check in localStorage if terms were accepted for this package
    const acceptedPackageTerms = localStorage.getItem(`acceptedTerms_${packageId}`);
    if (acceptedPackageTerms) {
      setHasAcceptedTerms(true);
    }
  });
  
  // Log contract acceptance
  const logContractAcceptance = async () => {
    if (!qualificationData) {
      console.warn('Qualification data not available for contract logging');
      return false;
    }
    
    try {
      await contractAcceptanceLogger.logAcceptance({
        packageId,
        customerName: qualificationData.name || 'Cliente Anônimo',
        customerEmail: qualificationData.email || 'email@não-fornecido.com',
        acceptanceDate: new Date().toISOString(),
        ipAddress: 'client-side',
        userAgent: navigator.userAgent,
        contractVersion: '1.0',
        source: 'payment-flow'
      });
      
      // Store in localStorage to avoid asking again in the same session
      localStorage.setItem(`acceptedTerms_${packageId}`, 'true');
      
      setHasAcceptedTerms(true);
      
      toast({
        title: "Contrato aceito",
        description: "Os termos de serviço foram aceitos e registrados."
      });
      
      return true;
    } catch (error) {
      console.error('Error logging contract acceptance:', error);
      toast({
        title: "Erro ao registrar aceitação",
        description: "Ocorreu um erro ao registrar a aceitação dos termos.",
        variant: "destructive"
      });
      
      return false;
    }
  };
  
  const handlePaymentMethod = async (method: string, useDiscount = false) => {
    // Ensure terms are accepted before proceeding
    if (!hasAcceptedTerms) {
      toast({
        title: "Termos não aceitos",
        description: "Você precisa aceitar os termos de serviço para continuar.",
        variant: "destructive"
      });
      
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Calculate values
      const extrasTotal = calculateExtrasTotal(selectedExtras);
      const packagePrice = parsePackagePrice(selectedPackage.price.toString());
      const totalPrice = packagePrice + extrasTotal;
      
      // Generate order ID
      const orderId = `HAR-${Date.now()}`;
      
      // Store payment data in localStorage
      const paymentData: PaymentData = {
        method,
        packageId,
        packageName: selectedPackage.name,
        price: selectedPackage.price.toString(),
        extras: selectedExtras,
        extrasTotal,
        total: `R$ ${totalPrice.toFixed(2).replace('.', ',')}`,
        date: new Date().toISOString(),
        orderId
      };
      
      localStorage.setItem('paymentData', JSON.stringify(paymentData));
      
      // Get the payment link for the selected package
      const paymentLinkData = packagePaymentLinks[packageId];
      
      if (!paymentLinkData) {
        throw new Error('Pacote não encontrado');
      }
      
      // Determine which payment link to use (standard or discount)
      const paymentLink = useDiscount && paymentLinkData.discount 
        ? paymentLinkData.discount.url
        : paymentLinkData.standard.url;
      
      // Setup return URL for redirect after payment
      const returnUrl = `${window.location.origin}/pagamento-retorno?packageId=${packageId}&orderId=${orderId}`;
      
      // Store return URL in session storage to verify later
      sessionStorage.setItem('paymentReturnUrl', returnUrl);
      
      // Redirect to the payment processing page with the actual payment URL
      navigate(`/pagamento-processando?orderId=${orderId}&packageId=${packageId}&paymentUrl=${encodeURIComponent(paymentLink)}&returnUrl=${encodeURIComponent(returnUrl)}`);
      
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
  
  // Check and request terms acceptance if not already accepted
  const ensureTermsAccepted = async () => {
    if (hasAcceptedTerms) return true;
    
    // Here you would typically show a dialog to accept terms
    // For now, we'll just log directly since we're modifying this for any entry point
    return await logContractAcceptance();
  };

  return {
    isLoading,
    isPaymentSuccess,
    handlePaymentMethod,
    paymentIframeUrl,
    hasAcceptedTerms,
    ensureTermsAccepted,
    logContractAcceptance
  };
}

export type { PaymentData } from './types';
