
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, FileCheck } from 'lucide-react';

interface ContractAcceptanceInfoProps {
  hasAcceptedTerms: boolean;
}

const ContractAcceptanceInfo: React.FC<ContractAcceptanceInfoProps> = ({ 
  hasAcceptedTerms 
}) => {
  if (hasAcceptedTerms) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4 flex items-start">
          <FileCheck className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-green-700 font-medium text-sm">Contrato Aceito</h3>
            <p className="text-green-700 text-xs mt-1">
              Você já aceitou os termos do contrato para este pacote. Você pode prosseguir com o pagamento.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardContent className="p-4 flex items-start">
        <AlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-amber-700 font-medium text-sm">Aceitação de Contrato Necessária</h3>
          <p className="text-amber-700 text-xs mt-1">
            Para prosseguir com o pagamento, você precisará aceitar os termos do contrato de prestação de serviços. 
            Isso será solicitado ao selecionar um método de pagamento.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractAcceptanceInfo;
