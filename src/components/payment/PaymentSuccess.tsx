
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const PaymentSuccess: React.FC = () => {
  const [paymentData, setPaymentData] = useState<any>(null);
  
  useEffect(() => {
    // Recuperar dados de pagamento do localStorage
    const paymentData = localStorage.getItem('paymentData');
    if (paymentData) {
      try {
        const parsedData = JSON.parse(paymentData);
        setPaymentData(parsedData);
      } catch (e) {
        console.error('Erro ao processar dados de pagamento:', e);
      }
    }
  }, []);

  return (
    <Card className="text-center p-8">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-harmonia-green/20 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-harmonia-green" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Pagamento em processamento!</h2>
        <p className="mb-6 text-gray-400">
          Você será redirecionado para o site de pagamento MercadoPago. Após a confirmação, você será 
          direcionado de volta para preencher o briefing detalhado para que possamos iniciar a produção da sua música personalizada.
        </p>
        
        <div className="flex items-center justify-center mb-6 bg-blue-50 p-4 rounded-md border border-blue-200">
          <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
          <p className="text-blue-700 text-sm">
            Aguarde o redirecionamento para o site de pagamento...
          </p>
        </div>
        
        {paymentData && (
          <div className="mb-8 w-full max-w-md">
            <div className="bg-background border border-border rounded-md p-4 text-left">
              <h3 className="font-medium mb-2 text-sm text-gray-500">Resumo do pedido:</h3>
              <p className="text-sm"><span className="font-medium">Pacote:</span> {paymentData.packageName}</p>
              {paymentData.extras.length > 0 && (
                <p className="text-sm"><span className="font-medium">Extras:</span> {paymentData.extras.length} serviço(s) adicional(is)</p>
              )}
              <p className="text-sm"><span className="font-medium">Valor total:</span> {paymentData.total}</p>
              <p className="text-sm"><span className="font-medium">Código do pedido:</span> {paymentData.orderId}</p>
            </div>
          </div>
        )}
        
        <div className="animate-pulse mt-4">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      </div>
    </Card>
  );
};

export default PaymentSuccess;
