
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Search } from 'lucide-react';

interface OrderSearchProps {
  onSearch: (orderData: any) => void;
}

const OrderSearch: React.FC<OrderSearchProps> = ({ onSearch }) => {
  const [orderCode, setOrderCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    const cleanCode = orderCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    setIsLoading(true);
    
    // This is a mock implementation that simulates an API call
    setTimeout(() => {
      const foundOrder = MOCK_ORDERS[cleanCode];
      
      if (foundOrder) {
        onSearch(foundOrder);
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

  return (
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
  );
};

// Mock data (this would normally be fetched from an API)
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

import { FileText, Package, CreditCard, MessageSquare, Music, Headphones, FileCheck, Settings } from 'lucide-react';

export { MOCK_ORDERS };
export default OrderSearch;
