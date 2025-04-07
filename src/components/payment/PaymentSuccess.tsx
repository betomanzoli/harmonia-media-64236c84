
import React from 'react';
import { Card } from "@/components/ui/card";
import { CheckCircle, Loader2 } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  return (
    <Card className="text-center p-8">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-harmonia-green/20 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-harmonia-green" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Pagamento confirmado!</h2>
        <p className="mb-6">
          Você será redirecionado para a página de confirmação em instantes.
        </p>
        <div className="animate-pulse">
          <Loader2 className="w-6 h-6 text-harmonia-green animate-spin" />
        </div>
      </div>
    </Card>
  );
};

export default PaymentSuccess;
