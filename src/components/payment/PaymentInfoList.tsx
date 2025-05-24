
import React from 'react';
import { Separator } from "@/components/ui/separator";

const PaymentInfoList: React.FC = () => {
  return (
    <>
      <Separator className="my-3" />
      
      <div className="text-xs text-gray-400">
        <p className="mb-1">Informações importantes:</p>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>Todos os pagamentos são processados em Reais (BRL)</li>
          <li>Pagamentos são processados com segurança pelo MercadoPago</li>
          <li>O prazo de entrega é contado a partir da confirmação do pagamento</li>
          <li>Após o pagamento, você será redirecionado de volta para preencher o briefing</li>
        </ul>
      </div>
    </>
  );
};

export default PaymentInfoList;
