
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Landmark, Clock, AlertCircle } from 'lucide-react';

interface PaymentMethodsProps {
  isLoading: boolean;
  onSelectMethod: (method: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ isLoading, onSelectMethod }) => {
  return (
    <div className="md:col-span-2">
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Forma de Pagamento</h2>
        <p className="text-gray-400 mb-6">Escolha uma forma de pagamento para continuar</p>
        
        <div className="space-y-4">
          <div className="border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-harmonia-green/20 flex items-center justify-center mr-3">
                  <CreditCard className="w-5 h-5 text-harmonia-green" />
                </div>
                <div>
                  <h3 className="font-medium">Cartão de Crédito</h3>
                  <p className="text-sm text-gray-400">Pagamento processado imediatamente</p>
                </div>
              </div>
              <Button 
                disabled={isLoading} 
                onClick={() => onSelectMethod('Cartão de Crédito')}
                className="bg-harmonia-green hover:bg-harmonia-green/90"
              >
                {isLoading ? 'Processando...' : 'Pagar'}
              </Button>
            </div>
            <div className="flex items-center text-xs text-green-600 mt-2 bg-green-50 p-2 rounded">
              <Clock className="w-3 h-3 mr-1" />
              <span>Início do projeto: imediato após a confirmação</span>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-harmonia-green/20 flex items-center justify-center mr-3">
                  <Landmark className="w-5 h-5 text-harmonia-green" />
                </div>
                <div>
                  <h3 className="font-medium">Boleto Bancário</h3>
                  <p className="text-sm text-gray-400">Prazo de até 3 dias úteis para compensação</p>
                </div>
              </div>
              <Button 
                disabled={isLoading} 
                onClick={() => onSelectMethod('Boleto')}
                className="bg-harmonia-green hover:bg-harmonia-green/90"
              >
                {isLoading ? 'Processando...' : 'Gerar Boleto'}
              </Button>
            </div>
            <div className="flex items-center text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded">
              <AlertCircle className="w-3 h-3 mr-1" />
              <span>Importante: O projeto será iniciado apenas após a confirmação do pagamento (1-3 dias úteis)</span>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="text-sm text-gray-400">
          <p className="mb-2">Informações importantes:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Todos os pagamentos são processados em Reais (BRL)</li>
            <li>Pagamentos via cartão de crédito são confirmados imediatamente</li>
            <li>Pagamentos via boleto podem levar até 3 dias úteis para compensação</li>
            <li>O prazo de entrega é contado a partir da confirmação do pagamento</li>
            <li>Seus dados de pagamento são protegidos por criptografia</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default PaymentMethods;
