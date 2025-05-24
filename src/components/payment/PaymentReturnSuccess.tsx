
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PaymentReturnSuccessProps {
  orderId: string;
  packageName?: string;
}

const PaymentReturnSuccess: React.FC<PaymentReturnSuccessProps> = ({ 
  orderId, 
  packageName = 'Profissional'
}) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm max-w-md mx-auto text-center">
      <div className="flex justify-center mb-6">
        <div className="bg-green-100 p-4 rounded-full">
          <Check className="h-12 w-12 text-green-600" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-3">Pagamento confirmado!</h2>
      
      <p className="text-gray-600 mb-6">
        Recebemos seu pagamento. Seu número de pedido é:
      </p>
      
      <div className="bg-gray-100 py-3 px-4 rounded-md font-mono text-lg mb-8">
        {orderId}
      </div>
      
      <div className="space-y-4 mb-8">
        <h3 className="font-semibold text-lg">Pacote selecionado: {packageName}</h3>
        <p className="text-gray-600">
          Você receberá um e-mail com detalhes da sua compra em breve. 
          Agora podemos começar a criar sua música!
        </p>
      </div>
      
      <div className="space-y-3">
        <Button asChild className="w-full bg-harmonia-green hover:bg-harmonia-green/90 text-white">
          <Link to="/briefing">Preencher briefing</Link>
        </Button>
        
        <Button asChild variant="outline">
          <Link to="/">Voltar para página inicial</Link>
        </Button>
      </div>
    </div>
  );
};

export default PaymentReturnSuccess;
