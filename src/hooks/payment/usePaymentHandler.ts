
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

  // Parse package price from string like "R$ 1500,00" to number 1500
  const parsePackagePrice = (priceString: string): number => {
    // Remove non-numeric characters except for comma/period
    const numericString = priceString.replace(/[^0-9,\.]/g, '');
    // Replace comma with period for parsing
    const formattedString = numericString.replace(',', '.');
    return parseFloat(formattedString);
  };

  const handlePaymentMethod = async (method: string) => {
    setIsLoading(true);
    
    // Simular processo de pagamento (em um ambiente real, redirecionaria para gateway)
    try {
      // Simulação de processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calcular valores
      const extrasTotal = calculateExtrasTotal();
      const packagePrice = parsePackagePrice(selectedPackage.price);
      const totalPrice = packagePrice + extrasTotal;
      
      // Armazenar dados do pagamento no localStorage
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
      
      // Armazenar dados do pedido para acompanhamento
      const orderData = {
        orderId: paymentData.orderId,
        clientName: qualificationData?.name || 'Cliente',
        packageType: packageId,
        status: 'Em Análise',
        currentStep: 1,
        orderDate: new Date().toISOString(),
        expectedDelivery: getExpectedDeliveryDate(packageId, method),
        previewLink: null,
        progress: [
          {
            step: 1,
            title: "Pagamento Confirmado",
            description: method === 'Boleto' 
              ? "Seu pagamento via boleto foi registrado. O projeto será iniciado após a confirmação do pagamento."
              : "Seu pagamento foi confirmado e seu projeto foi iniciado.",
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
        // Fixed to use only 3 parameters as expected by the function
        await emailService.sendPaymentConfirmation(
          qualificationData.email,
          qualificationData.name || 'Cliente',
          `${selectedPackage.name}${selectedExtras.length > 0 ? ` + ${selectedExtras.length} serviços extras` : ''}`
        );
      }
      
      // Mostrar mensagem de sucesso
      setIsPaymentSuccess(true);
      
      toast({
        title: "Pagamento registrado com sucesso!",
        description: method === 'Boleto' 
          ? `Seu pedido para o ${selectedPackage.name} foi registrado. O projeto será iniciado após a confirmação do pagamento.`
          : `Seu pedido para o ${selectedPackage.name} foi confirmado.`,
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

  // Função para calcular data de entrega estimada com base no método de pagamento
  const getExpectedDeliveryDate = (packageId: PackageId, paymentMethod: string): string => {
    const today = new Date();
    let businessDays = 0;
    
    // Definir prazo base em dias úteis conforme o pacote
    switch (packageId) {
      case 'premium':
        businessDays = 3;
        break;
      case 'profissional':
        businessDays = 5;
        break;
      case 'essencial':
      default:
        businessDays = 7;
        break;
    }
    
    // Adicionar dias extras para boleto
    if (paymentMethod === 'Boleto') {
      businessDays += 3; // Adiciona 3 dias úteis para compensação do boleto
    }
    
    // Calcular data de entrega (pulando finais de semana)
    let deliveryDate = new Date(today);
    let daysAdded = 0;
    
    while (daysAdded < businessDays) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      // Pular finais de semana (0 = Domingo, 6 = Sábado)
      if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
        daysAdded++;
      }
    }
    
    // Retornar data formatada
    return deliveryDate.toLocaleDateString('pt-BR');
  };

  return {
    isLoading,
    isPaymentSuccess,
    handlePaymentMethod
  };
}
