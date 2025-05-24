
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export interface PaymentReturnSuccessProps {
  orderId?: string;
  paymentData?: any;
}

const PaymentReturnSuccess: React.FC<PaymentReturnSuccessProps> = ({ 
  orderId,
  paymentData 
}) => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle className="h-16 w-16 text-harmonia-green" />
      </div>
      
      <h2 className="text-2xl font-bold mb-3">Pagamento Confirmado!</h2>
      
      <p className="text-gray-600 mb-6">
        Seu pedido foi registrado com sucesso. Você receberá um email com os detalhes da compra.
      </p>
      
      {orderId && (
        <p className="text-sm text-gray-500 mb-6">
          Código do pedido: <span className="font-medium">{orderId}</span>
        </p>
      )}
      
      <div className="flex flex-col space-y-4 items-center">
        <Button asChild>
          <Link to="/briefing">
            Preencher Briefing
          </Link>
        </Button>
        
        <Button variant="outline" asChild>
          <Link to="/">
            Voltar para a Página Inicial
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PaymentReturnSuccess;
