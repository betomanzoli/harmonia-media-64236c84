
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  
  useEffect(() => {
    // Recuperar método de pagamento do localStorage
    const paymentData = localStorage.getItem('paymentData');
    if (paymentData) {
      try {
        const parsedData = JSON.parse(paymentData);
        setPaymentMethod(parsedData.method);
      } catch (e) {
        console.error('Erro ao processar dados de pagamento:', e);
      }
    }
  }, []);

  return (
    <Card className="text-center p-8">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-harmonia-green/20 flex items-center justify-center mb-4">
          {paymentMethod === 'Boleto' ? (
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          ) : (
            <CheckCircle className="w-8 h-8 text-harmonia-green" />
          )}
        </div>
        
        {paymentMethod === 'Boleto' ? (
          <>
            <h2 className="text-2xl font-bold mb-2">Boleto gerado com sucesso!</h2>
            <p className="mb-6 text-gray-400">
              O prazo para o início do seu projeto será contado após a confirmação do pagamento do boleto, 
              que pode levar até 3 dias úteis.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">Pagamento confirmado!</h2>
            <p className="mb-6 text-gray-400">
              Seu pagamento foi processado com sucesso. O projeto será iniciado imediatamente.
            </p>
          </>
        )}
        
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
