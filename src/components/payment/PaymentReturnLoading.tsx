
import React from 'react';
import { Loader2 } from 'lucide-react';

const PaymentReturnLoading: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm max-w-md mx-auto text-center">
      <div className="flex justify-center mb-6">
        <Loader2 className="h-12 w-12 text-harmonia-green animate-spin" />
      </div>
      
      <h2 className="text-2xl font-bold mb-3">Processando pagamento</h2>
      
      <p className="text-gray-600">
        Por favor, aguarde enquanto confirmamos seu pagamento...
      </p>
    </div>
  );
};

export default PaymentReturnLoading;
