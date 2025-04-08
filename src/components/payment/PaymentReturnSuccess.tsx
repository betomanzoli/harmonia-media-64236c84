
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from 'lucide-react';

interface PaymentReturnSuccessProps {
  paymentData: any;
  orderId?: string;
}

const PaymentReturnSuccess: React.FC<PaymentReturnSuccessProps> = ({ paymentData, orderId }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-harmonia-green/20 flex items-center justify-center mb-4">
        <CheckCircle className="w-8 h-8 text-harmonia-green" />
      </div>

      <h2 className="text-2xl font-bold mb-2">Pagamento confirmado!</h2>
      <p className="mb-6 text-gray-400">
        Seu pagamento foi processado com sucesso. O próximo passo será preencher o briefing detalhado 
        para que possamos iniciar a produção da sua música personalizada.
      </p>

      {paymentData && (
        <div className="mb-8 w-full max-w-md">
          <div className="bg-background border border-border rounded-md p-4 text-left">
            <h3 className="font-medium mb-2 text-sm text-gray-500">Resumo do pedido:</h3>
            <p className="text-sm"><span className="font-medium">Pacote:</span> {paymentData.packageName || 'Pacote harmonIA'}</p>
            {paymentData.extras && paymentData.extras.length > 0 && (
              <p className="text-sm"><span className="font-medium">Extras:</span> {paymentData.extras.length} serviço(s) adicional(is)</p>
            )}
            <p className="text-sm"><span className="font-medium">Código do pedido:</span> {paymentData.orderId || orderId || 'Pedido registrado'}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center mb-6 bg-green-50 p-4 rounded-md border border-green-200">
        <CheckCircle className="w-5 h-5 text-harmonia-green mr-2" />
        <p className="text-green-700 text-sm">
          O próximo passo é preencher o briefing para iniciarmos seu projeto.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link to="/briefing" className="flex-1">
          <Button className="w-full bg-harmonia-green hover:bg-harmonia-green/90">
            Preencher briefing
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <Link to="/acompanhar-pedido" className="flex-1">
          <Button variant="outline" className="w-full">
            Acompanhar pedido
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentReturnSuccess;
