
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface PaymentReturnSuccessProps {
  packageName: string;
  orderNumber: string;
}

const PaymentReturnSuccess: React.FC<PaymentReturnSuccessProps> = ({
  packageName,
  orderNumber
}) => {
  return (
    <div className="text-center max-w-lg mx-auto">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      
      <h1 className="text-3xl font-bold mb-4">Pagamento Confirmado!</h1>
      
      <p className="text-lg mb-6">
        Obrigado por adquirir o pacote <strong>{packageName}</strong>. 
        Seu pedido <strong>#{orderNumber}</strong> foi processado com sucesso.
      </p>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="font-semibold mb-4">Próximos passos:</h2>
        <ol className="text-left space-y-3">
          <li className="flex">
            <span className="bg-harmonia-green text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">1</span>
            <span>Complete o briefing para nos contar sua história</span>
          </li>
          <li className="flex">
            <span className="bg-harmonia-green text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">2</span>
            <span>Nossa equipe entrará em contato em até 1 dia útil</span>
          </li>
          <li className="flex">
            <span className="bg-harmonia-green text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">3</span>
            <span>Acompanhe o progresso pelo painel do cliente</span>
          </li>
        </ol>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          className="bg-harmonia-green hover:bg-harmonia-green/90 text-white"
          asChild
        >
          <Link to="/briefing">Preencher Briefing</Link>
        </Button>
        
        <Button
          variant="outline"
          asChild
        >
          <Link to="/acompanhar-pedido">Acompanhar Pedido</Link>
        </Button>
      </div>
    </div>
  );
};

export default PaymentReturnSuccess;
