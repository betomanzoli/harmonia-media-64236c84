
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { mockOrderData } from './mockOrderData';
import { OrderData, OrderProgressStatus } from './types';

interface OrderSearchProps {
  onSearch: (order: OrderData) => void;
}

const OrderSearch: React.FC<OrderSearchProps> = ({ onSearch }) => {
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!orderId.trim()) {
      setError('Por favor, digite o número do seu pedido');
      return;
    }
    
    // Procurar no localStorage primeiro
    const localOrderData = localStorage.getItem('orderData');
    if (localOrderData) {
      try {
        const parsedData = JSON.parse(localOrderData);
        if (parsedData.orderId === orderId.trim()) {
          // Converter dados locais para o formato OrderData
          const today = new Date().toLocaleDateString('pt-BR');
          const formattedOrder: OrderData = {
            orderId: parsedData.orderId,
            clientName: parsedData.clientName,
            packageType: parsedData.packageType,
            status: 'Em Análise',
            currentStep: 1,
            orderDate: today,
            expectedDelivery: getExpectedDeliveryDate(),
            previewLink: null,
            progress: generateProgressSteps(),
            hasPreview: false,
            pendingAction: null
          };
          onSearch(formattedOrder);
          return;
        }
      } catch (e) {
        console.error('Erro ao processar dados do pedido local:', e);
      }
    }
    
    // Se não encontrar localmente, procurar nos dados de exemplo
    const foundOrder = mockOrderData.find(order => order.orderId === orderId.trim());
    
    if (foundOrder) {
      onSearch(foundOrder);
    } else {
      setError('Pedido não encontrado. Verifique o número e tente novamente.');
    }
  };
  
  // Função auxiliar para gerar data de entrega esperada (2 semanas a partir de hoje)
  const getExpectedDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toLocaleDateString('pt-BR');
  };
  
  // Função auxiliar para gerar etapas de progresso para um pedido novo
  const generateProgressSteps = () => {
    const today = new Date().toLocaleDateString('pt-BR');
    return [
      {
        step: 1,
        title: "Briefing Recebido",
        description: "Seu briefing foi recebido e está sendo analisado pela nossa equipe.",
        date: today,
        status: "completed" as OrderProgressStatus,
        icon: "FileText"
      },
      {
        step: 2,
        title: "Análise Inicial",
        description: "Nossa equipe está analisando seu briefing e definindo a abordagem criativa.",
        date: null,
        status: "current" as OrderProgressStatus,
        icon: "Package"
      },
      {
        step: 3,
        title: "Composição",
        description: "Nossos compositores estão trabalhando na sua música personalizada.",
        date: null,
        status: "pending" as OrderProgressStatus,
        icon: "Music"
      },
      {
        step: 4,
        title: "Produção",
        description: "Fase de arranjo e produção musical da sua composição.",
        date: null,
        status: "pending" as OrderProgressStatus,
        icon: "Settings"
      },
      {
        step: 5,
        title: "Apresentação",
        description: "Prévias da sua música estão prontas para sua avaliação.",
        date: null,
        status: "pending" as OrderProgressStatus,
        icon: "Headphones"
      }
    ];
  };

  return (
    <Card className="p-6 mb-8">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <Input
              placeholder="Digite o número do seu pedido (ex: HAR-2025-1234)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full"
            />
          </div>
          <Button 
            type="submit" 
            className="bg-harmonia-green hover:bg-harmonia-green/90"
          >
            <Search className="w-4 h-4 mr-2" />
            Buscar Pedido
          </Button>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </form>
    </Card>
  );
};

export default OrderSearch;
