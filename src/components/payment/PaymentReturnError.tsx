
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { XCircle } from 'lucide-react';

const PaymentReturnError: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
        <XCircle className="w-8 h-8 text-red-500" />
      </div>

      <h2 className="text-2xl font-bold mb-2">Pagamento não confirmado</h2>
      <p className="mb-6 text-gray-400">
        Houve um problema ao processar seu pagamento. Isso pode ocorrer por diversos motivos, 
        como problemas com o cartão ou com o processador de pagamento.
      </p>
      
      <div className="flex items-center justify-center mb-6 bg-red-50 p-4 rounded-md border border-red-200">
        <XCircle className="w-5 h-5 text-red-500 mr-2" />
        <p className="text-red-700 text-sm">
          Você pode tentar novamente ou entrar em contato com nosso suporte para resolver o problema.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link to="/pagamento" className="flex-1">
          <Button className="w-full bg-harmonia-green hover:bg-harmonia-green/90">
            Tentar novamente
          </Button>
        </Link>
        <a href="https://wa.me/5511920585072?text=Olá!%20Tive%20um%20problema%20com%20meu%20pagamento%20na%20harmonIA." 
           target="_blank" 
           rel="noopener noreferrer" 
           className="flex-1">
          <Button variant="outline" className="w-full">
            Contatar suporte
          </Button>
        </a>
      </div>
    </div>
  );
};

export default PaymentReturnError;
