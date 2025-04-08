
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { CheckCircle, Loader2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const PaymentSuccess: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  
  useEffect(() => {
    // Recuperar método de pagamento do localStorage
    const paymentData = localStorage.getItem('paymentData');
    if (paymentData) {
      try {
        const parsedData = JSON.parse(paymentData);
        setPaymentMethod(parsedData.method);
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
          {paymentMethod === 'Pix' ? (
            <Clock className="w-8 h-8 text-amber-500" />
          ) : (
            <CheckCircle className="w-8 h-8 text-harmonia-green" />
          )}
        </div>
        
        {paymentMethod === 'Pix' ? (
          <>
            <h2 className="text-2xl font-bold mb-2">Pix gerado com sucesso!</h2>
            <p className="mb-6 text-gray-400">
              O próximo passo será preencher o briefing após a confirmação do pagamento. O prazo para entrega 
              será contado a partir do preenchimento completo do briefing.
            </p>
            <div className="flex items-center justify-center mb-6 bg-amber-50 p-4 rounded-md border border-amber-200">
              <Clock className="w-5 h-5 text-amber-500 mr-2" />
              <p className="text-amber-700 text-sm">
                Você será redirecionado para o briefing assim que o pagamento for confirmado.
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">Pagamento confirmado!</h2>
            <p className="mb-6 text-gray-400">
              Seu pagamento foi processado com sucesso. O próximo passo será preencher o briefing detalhado 
              para que possamos iniciar a produção da sua música personalizada.
            </p>
            <div className="flex items-center justify-center mb-6 bg-green-50 p-4 rounded-md border border-green-200">
              <CheckCircle className="w-5 h-5 text-harmonia-green mr-2" />
              <p className="text-green-700 text-sm">
                Você será redirecionado para o formulário de briefing em instantes.
              </p>
            </div>
          </>
        )}
        
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
        
        <p className="mb-6">
          Você será redirecionado para o formulário de briefing em instantes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link to="/briefing" className="flex-1">
            <Button variant="outline" className="w-full">
              Ir para o briefing
            </Button>
          </Link>
          <Link to="/" className="flex-1">
            <Button className="w-full bg-harmonia-green hover:bg-harmonia-green/90">
              Página inicial
            </Button>
          </Link>
        </div>
        <div className="animate-pulse mt-4">
          <Loader2 className="w-6 h-6 text-harmonia-green animate-spin" />
        </div>
      </div>
    </Card>
  );
};

export default PaymentSuccess;
