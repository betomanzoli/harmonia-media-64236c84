
import React from 'react';
import { Loader2 } from 'lucide-react';

const PaymentReturnLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <Loader2 className="w-12 h-12 text-harmonia-green animate-spin mb-4" />
      <h2 className="text-2xl font-bold mb-2">Processando seu pagamento</h2>
      <p className="mb-6 text-gray-400">
        Estamos verificando o status do seu pagamento, aguarde um momento...
      </p>
    </div>
  );
};

export default PaymentReturnLoading;
