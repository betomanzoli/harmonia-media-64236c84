
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
    
    // Simulate payment process (in a real environment, would redirect to gateway)
    try {
      // Payment processing simulation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calculate values
      const extrasTotal = calculateExtrasTotal(selectedExtras);
      const packagePrice = parsePackagePrice(selectedPackage.price);
      const totalPrice = packagePrice + extrasTotal;
      
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
        orderId: `HAR-${Date.now()}`
      };
      
      localStorage.setItem('paymentData', JSON.stringify(paymentData));
      
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
          ? `Seu pedido para o ${selectedPackage.name} foi registrado. O projeto será iniciado após a confirmação do pagamento.`
          : `Seu pedido para o ${selectedPackage.name} foi confirmado e será iniciado imediatamente.`,
      });
      
      // After 3 seconds, redirect to the thank you page
      setTimeout(() => {
        navigate('/agradecimento');
      }, 3000);
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
