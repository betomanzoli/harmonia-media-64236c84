
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface PaymentReturnErrorProps {
  message?: string;
}

const PaymentReturnError: React.FC<PaymentReturnErrorProps> = ({ 
  message = "Houve um problema ao processar seu pagamento."
}) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm max-w-md mx-auto text-center">
      <div className="flex justify-center mb-6">
        <div className="bg-red-100 p-4 rounded-full">
          <AlertTriangle className="h-12 w-12 text-red-600" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-3">Pagamento não concluído</h2>
      
      <p className="text-gray-600 mb-8">
        {message}
      </p>
      
      <div className="space-y-3">
        <Button asChild className="w-full bg-harmonia-green hover:bg-harmonia-green/90 text-white">
          <Link to="/pagamento">Tentar novamente</Link>
        </Button>
        
        <Button asChild variant="outline">
          <Link to="/contato">Falar com suporte</Link>
        </Button>
      </div>
    </div>
  );
};

export default PaymentReturnError;
