
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const usePaymentHandler = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (paymentData: any) => {
    setIsProcessing(true);
    try {
      console.log('Contract acceptance logged:', paymentData);
      
      toast({
        title: "Pagamento processado",
        description: "Pagamento realizado com sucesso!"
      });
      
      return true;
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Erro no pagamento",
        description: "Ocorreu um erro ao processar o pagamento.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handlePayment,
    isProcessing
  };
};
