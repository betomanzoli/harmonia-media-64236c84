
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, Search, MessageSquare } from 'lucide-react';
import OrderDetails from '@/components/order-tracking/OrderDetails';
import OrderNotification from '@/components/order-tracking/OrderNotification'; 
import { siteConfig } from '@/config/site';

const MOCK_ORDERS = {
  'HAR2025001': {
    orderId: 'HAR-2025-0001',
    clientName: 'João Silva',
    packageType: 'Profissional',
    orderDate: '05/04/2025',
    currentStep: 5,
    status: 'Aguardando Aprovação',
    expectedDelivery: '20/04/2025',
    previewLink: '/previews/preview123',
    progress: [
      {
        step: 1,
        status: 'completed' as const,
        title: 'Qualificação Inicial',
        description: 'Formulário preenchido e necessidades identificadas',
        icon: <FileText />,
        date: '05/04/2025'
      },
      {
        step: 2,
        status: 'completed' as const,
        title: 'Escolha do Pacote',
        description: 'Pacote Profissional selecionado',
        icon: <Package />,
        date: '05/04/2025'
      },
      {
        step: 3,
        status: 'completed' as const,
        title: 'Pagamento',
        description: 'Pagamento aprovado',
        icon: <CreditCard />,
        date: '05/04/2025'
      },
      {
        step: 4,
        status: 'completed' as const,
        title: 'Briefing Detalhado',
        description: 'Detalhes do projeto fornecidos',
        icon: <MessageSquare />,
        date: '06/04/2025'
      },
      {
        step: 5,
        status: 'completed' as const,
        title: 'Criação com IA',
        description: 'Versões iniciais geradas',
        icon: <Music />,
        date: '08/04/2025'
      },
      {
        step: 6,
        status: 'current' as const,
        title: 'Refinamento Humano',
        description: 'Músicos aprimorando a composição',
        icon: <Headphones />,
        date: '10/04/2025'
      },
      {
        step: 7,
        status: 'pending' as const,
        title: 'Apresentação',
        description: 'Prévias enviadas para avaliação',
        icon: <FileCheck />
      },
      {
        step: 8,
        status: 'pending' as const,
        title: 'Revisões',
        description: 'Ajustes conforme seu feedback',
        icon: <Settings />
      },
      {
        step: 9,
        status: 'pending' as const,
        title: 'Entrega Final',
        description: 'Música finalizada com documentação',
        icon: <Music />
      }
    ]
  },
  'HAR2025002': {
    orderId: 'HAR-2025-0002',
    clientName: 'Maria Oliveira',
    packageType: 'Premium',
    orderDate: '03/04/2025',
    currentStep: 7,
    status: 'Esperando Feedback',
    expectedDelivery: '18/04/2025',
    previewLink: '/previews/preview456',
    progress: [
      {
        step: 1,
        status: 'completed' as const,
        title: 'Qualificação Inicial',
        description: 'Formulário preenchido e necessidades identificadas',
        icon: <FileText />,
        date: '03/04/2025'
      },
      {
        step: 2,
        status: 'completed' as const,
        title: 'Escolha do Pacote',
        description: 'Pacote Premium selecionado',
        icon: <Package />,
        date: '03/04/2025'
      },
      {
        step: 3,
        status: 'completed' as const,
        title: 'Pagamento',
        description: 'Pagamento aprovado',
        icon: <CreditCard />,
        date: '03/04/2025'
      },
      {
        step: 4,
        status: 'completed' as const,
        title: 'Briefing Detalhado',
        description: 'Detalhes do projeto fornecidos',
        icon: <MessageSquare />,
        date: '04/04/2025'
      },
      {
        step: 5,
        status: 'completed' as const,
        title: 'Criação com IA',
        description: 'Versões iniciais geradas',
        icon: <Music />,
        date: '05/04/2025'
      },
      {
        step: 6,
        status: 'completed' as const,
        title: 'Refinamento Humano',
        description: 'Músicos aprimoraram a composição',
        icon: <Headphones />,
        date: '07/04/2025'
      },
      {
        step: 7,
        status: 'current' as const,
        title: 'Apresentação',
        description: 'Prévias enviadas para avaliação',
        icon: <FileCheck />,
        date: '08/04/2025'
      },
      {
        step: 8,
        status: 'pending' as const,
        title: 'Revisões',
        description: 'Ajustes conforme seu feedback',
        icon: <Settings />
      },
      {
        step: 9,
        status: 'pending' as const,
        title: 'Entrega Final',
        description: 'Música finalizada com documentação',
        icon: <Music />
      }
    ]
  }
};

const OrderTracking: React.FC = () => {
  const [orderCode, setOrderCode] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    if (orderData) {
      const currentStep = orderData.progress.find((step: any) => step.status === 'current');
      if (currentStep && (currentStep.step === 7 || currentStep.step === 8)) {
        setHasNotification(true);
      }
    }
  }, [orderData]);

  const handleSearch = () => {
    const cleanCode = orderCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    setIsLoading(true);
    
    setTimeout(() => {
      const foundOrder = MOCK_ORDERS[cleanCode];
      
      if (foundOrder) {
        setOrderData(foundOrder);
      } else {
        toast({
          title: "Pedido não encontrado",
          description: "Verifique o código e tente novamente ou entre em contato conosco.",
          variant: "destructive"
        });
      }
      
      setIsLoading(false);
    }, 800);
  };

  const openChatAssistant = () => {
    if (window.harmonIAChatbot) {
      if (typeof window.harmonIAChatbot.toggleChat === 'function') {
        window.harmonIAChatbot.toggleChat();
        
        setTimeout(() => {
          if (typeof window.harmonIAChatbot.addUserMessage === 'function' && 
              typeof window.harmonIAChatbot.addBotMessage === 'function') {
            window.harmonIAChatbot.addUserMessage("Preciso de ajuda para localizar meu pedido");
            
            setTimeout(() => {
              window.harmonIAChatbot.addBotMessage(
                "Posso ajudar você a localizar seu pedido. Você tem o código do pedido?",
                ["Sim, tenho o código", "Não tenho o código", "Preciso de outro tipo de ajuda"]
              );
            }, 500);
          }
        }, 300);
      }
    } else {
      window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=Olá,%20preciso%20de%20ajuda%20para%20localizar%20meu%20pedido`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Acompanhar Pedido</h1>
          <p className="text-gray-400 mb-10">
            Insira o código do seu pedido para verificar seu status e progresso
          </p>
          
          <Card className="p-6 mb-10">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Digite o código do pedido (Ex: HAR-2025-001)"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={isLoading || !orderCode.trim()}
                className="bg-harmonia-green hover:bg-harmonia-green/90"
              >
                {isLoading ? 'Buscando...' : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar Pedido
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Você recebeu o código do pedido por email após a confirmação do pagamento.
              Se não encontrar, verifique sua caixa de spam ou entre em contato conosco.
            </p>
          </Card>
          
          {orderData ? (
            <>
              {hasNotification && (
                <OrderNotification 
                  orderId={orderData.orderId}
                  hasPreview={true}
                  previewLink={orderData.previewLink}
                  pendingAction={orderData.currentStep === 7 ? 'feedback' : null}
                />
              )}
              
              <OrderDetails {...orderData} />
            </>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-xl font-semibold mb-4">Não encontrou seu pedido?</h3>
              <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                Se você está tendo dificuldades para localizar seu pedido ou precisa de assistência adicional,
                entre em contato com nossa equipe de suporte.
              </p>
              <Button 
                className="bg-harmonia-green hover:bg-harmonia-green/90 flex items-center"
                onClick={openChatAssistant}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Falar com o Assistente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTracking;
