
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search } from 'lucide-react';
import { OrderSearchProps } from './types';
import { MOCK_ORDERS } from './mockOrderData';

const OrderSearch: React.FC<OrderSearchProps> = ({ onSearch }) => {
  const [orderCode, setOrderCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

export default OrderSearch;
