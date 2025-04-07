
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import emailService from '@/services/emailService';
import { PackageId, PackageInfo } from '@/lib/payment/packageData';

export interface PaymentData {
  method: string;
  packageId: string;
  packageName: string;
  price: string;
  date: string;
  orderId: string;
}

export function usePaymentHandler(
  packageId: PackageId,
  selectedPackage: PackageInfo,
  qualificationData: any
) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  const handlePaymentMethod = async (method: string) => {
    setIsLoading(true);
    
    // Simular processo de pagamento (em um ambiente real, redirecionaria para gateway)
    try {
      // Simulação de processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Armazenar dados do pagamento no localStorage
      const paymentData: PaymentData = {
        method,
        packageId,
        packageName: selectedPackage.name,
        price: selectedPackage.price,
        date: new Date().toISOString(),
        orderId: `HAR-${Date.now()}`
      };
      
      localStorage.setItem('paymentData', JSON.stringify(paymentData));
      
      // Se temos email, enviar confirmação
      if (qualificationData?.email) {
        await emailService.sendPaymentConfirmation(
          qualificationData.email,
          qualificationData.name || 'Cliente',
          selectedPackage.name
        );
      }
      
      // Mostrar mensagem de sucesso
      setIsPaymentSuccess(true);
      
      toast({
        title: "Pagamento realizado com sucesso!",
        description: `Seu pedido para o ${selectedPackage.name} foi confirmado.`,
      });
      
      // Após 3 segundos, redirecionar para a página de agradecimento
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
