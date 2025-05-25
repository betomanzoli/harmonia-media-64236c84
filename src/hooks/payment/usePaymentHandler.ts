
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import contractAcceptanceLogger from '@/services/contractAcceptanceLogger';

export const usePaymentHandler = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const processPayment = async (
    packageData: any,
    clientData: any,
    paymentMethod: string
  ) => {
    setIsProcessing(true);
    
    try {
      // Log contract acceptance
      await contractAcceptanceLogger.logAcceptance({
        client_name: clientData.name,
        client_email: clientData.email,
        package_type: packageData.type,
        accepted_at: new Date().toISOString(),
        ip_address: 'unknown',
        user_agent: navigator.userAgent,
        terms_version: '1.0'
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Pagamento processado!",
        description: "Seu pedido foi confirmado com sucesso."
      });

      navigate('/pagamento-retorno?status=success');
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: "Erro no pagamento",
        description: "Ocorreu um erro ao processar o pagamento. Tente novamente.",
        variant: "destructive"
      });
      navigate('/pagamento-retorno?status=error');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processPayment,
    isProcessing
  };
};
