import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import emailService from '@/services/emailService';
import { PackageId, PackageInfo } from '@/lib/payment/packageData';
import { extraServicesData } from '@/data/extraServices';

export interface PaymentData {
  method: string;
  packageId: string;
  packageName: string;
  price: string;
  extras: string[];
  extrasTotal: number;
  total: string;
  date: string;
  orderId: string;
}

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

  const calculateExtrasTotal = (): number => {
    return selectedExtras.reduce((total, extraId) => {
      const extra = extraServicesData.find(e => e.id === extraId);
      if (extra && typeof extra.price === 'number') {
        return total + extra.price;
      }
      return total;
    }, 0);
  };

  const handlePaymentMethod = async (method: string) => {
    setIsLoading(true);
    
    // Simular processo de pagamento (em um ambiente real, redirecionaria para gateway)
    try {
      // Simulação de processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calcular valores
      const extrasTotal = calculateExtrasTotal();
      const packagePrice = parseInt(selectedPackage.price.replace(/[^0-9]/g, ''));
      const totalPrice = packagePrice + extrasTotal;
      
      // Armazenar dados do pagamento no localStorage
      const paymentData: PaymentData = {
        method,
        packageId,
        packageName: selectedPackage.name,
        price: selectedPackage.price,
        extras: selectedExtras,
        extrasTotal,
        total: `R$ ${totalPrice},00`,
        date: new Date().toISOString(),
        orderId: `HAR-${Date.now()}`
      };
      
      localStorage.setItem('paymentData', JSON.stringify(paymentData));
      
      // Armazenar dados do pedido para acompanhamento
      const orderData = {
        orderId: paymentData.orderId,
        clientName: qualificationData?.name || 'Cliente',
        packageType: packageId,
        status: 'Em Análise',
        currentStep: 1,
        progress: [
          {
            step: 1,
            title: "Pagamento Confirmado",
            description: "Seu pagamento foi confirmado e seu projeto foi iniciado.",
            date: new Date().toLocaleDateString('pt-BR'),
            status: "completed",
            icon: "CreditCard"
          },
          {
            step: 2,
            title: "Análise Inicial",
            description: "Nossa equipe está analisando seu briefing e definindo a abordagem criativa.",
            date: null,
            status: "current",
            icon: "FileText"
          },
          {
            step: 3,
            title: "Composição",
            description: "Nossos compositores estão trabalhando na sua música personalizada.",
            date: null,
            status: "pending",
            icon: "Music"
          },
          {
            step: 4,
            title: "Produção",
            description: "Fase de arranjo e produção musical da sua composição.",
            date: null,
            status: "pending",
            icon: "Settings"
          },
          {
            step: 5,
            title: "Apresentação",
            description: "Prévias da sua música estão prontas para sua avaliação.",
            date: null,
            status: "pending",
            icon: "Headphones"
          }
        ]
      };
      
      localStorage.setItem('orderData', JSON.stringify(orderData));
      
      // Se temos email, enviar confirmação
      if (qualificationData?.email) {
        await emailService.sendPaymentConfirmation(
          qualificationData.email,
          qualificationData.name || 'Cliente',
          selectedPackage.name,
          selectedExtras.length > 0 ? `+ ${selectedExtras.length} serviços extras` : ''
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
