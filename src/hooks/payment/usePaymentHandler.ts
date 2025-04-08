
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
      
      if (method === 'MercadoPago') {
        // Redirect to biolivre.com.br/harmonizam with parameters
        const returnUrl = `${window.location.origin}/pagamento-retorno?packageId=${packageId}&orderId=${orderId}`;
        const biolivreUrl = `https://biolivre.com.br/harmonizam?package=${packageId}&price=${totalPrice}&returnUrl=${encodeURIComponent(returnUrl)}`;
        
        // In a real implementation, you would add more relevant parameters
        window.location.href = biolivreUrl;
        return; // Stop execution as we're redirecting
      }
      
      // For local payment methods like Pix or Credit Card, continue with existing flow
      // Simulate payment process (in a real environment, would redirect to gateway)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store order data for tracking
      const orderData = createOrderData(
        paymentData, 
        qualificationData?.name || 'Cliente', 
        method, 
        packageId
      );
      
      localStorage.setItem('orderData', JSON.stringify(orderData));
      
      // If we have email, send confirmation
      if (qualificationData?.email) {
        await emailService.sendPaymentConfirmation(
          qualificationData.email,
          qualificationData.name || 'Cliente',
          `${selectedPackage.name}${selectedExtras.length > 0 ? ` + ${selectedExtras.length} serviços extras` : ''}`
        );
      }
      
      // Show success message
      setIsPaymentSuccess(true);
      
      toast({
        title: method === 'Pix' ? "QR Code Pix gerado com sucesso!" : "Pagamento confirmado!",
        description: method === 'Pix' 
          ? `Seu pedido para o ${selectedPackage.name} foi registrado. Preencha o briefing após a confirmação do pagamento.`
          : `Seu pedido para o ${selectedPackage.name} foi confirmado. Por favor, preencha o briefing para iniciarmos o projeto.`,
      });
      
      // After 3 seconds, redirect to the briefing page
      setTimeout(() => {
        navigate('/briefing');
      }, 5000);
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
    handlePaymentMethod
  };
}

export type { PaymentData } from './types';
