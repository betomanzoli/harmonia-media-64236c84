
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, QrCode, Receipt, AlertCircle, Clock } from 'lucide-react';

interface PaymentMethodsProps {
  isLoading: boolean;
  onSelectMethod: (method: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ isLoading, onSelectMethod }) => {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Opções de Pagamento</CardTitle>
        <CardDescription>
          Escolha o método que melhor atende às suas necessidades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cartao" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="cartao">Cartão</TabsTrigger>
            <TabsTrigger value="pix">PIX</TabsTrigger>
            <TabsTrigger value="boleto">Boleto</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cartao" className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
              <div className="flex items-center justify-center mb-4">
                <CreditCard className="w-12 h-12 text-harmonia-green" />
              </div>
              <p className="mb-4">Pague com segurança usando seu cartão de crédito</p>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <div className="p-2 bg-white border border-gray-200 rounded">Visa</div>
                <div className="p-2 bg-white border border-gray-200 rounded">Mastercard</div>
                <div className="p-2 bg-white border border-gray-200 rounded">Amex</div>
                <div className="p-2 bg-white border border-gray-200 rounded">Elo</div>
              </div>
              <Button 
                onClick={() => onSelectMethod('Cartão de Crédito')}
                disabled={isLoading}
                className="bg-harmonia-green hover:bg-harmonia-green/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Pagar com Cartão"
                )}
              </Button>
              
              <div className="flex items-center gap-2 text-xs text-green-600 mt-3 justify-center">
                <Clock className="h-3 w-3" />
                <span>Processamento imediato, produção iniciada em até 24h</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="pix" className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
              <div className="flex items-center justify-center mb-4">
                <QrCode className="w-12 h-12 text-harmonia-green" />
              </div>
              <p className="mb-4">Pagamento instantâneo via PIX</p>
              <div className="p-4 border border-dashed border-gray-300 bg-white mb-4 mx-auto w-48 h-48 flex items-center justify-center">
                <span className="text-gray-400">QR Code do PIX</span>
              </div>
              <Button 
                onClick={() => onSelectMethod('PIX')}
                disabled={isLoading}
                className="bg-harmonia-green hover:bg-harmonia-green/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Confirmar Pagamento PIX"
                )}
              </Button>
              
              <div className="flex items-center gap-2 text-xs text-green-600 mt-3 justify-center">
                <Clock className="h-3 w-3" />
                <span>Confirmação na hora, produção iniciada em até 24h</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="boleto" className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
              <div className="flex items-center justify-center mb-4">
                <Receipt className="w-12 h-12 text-gray-600" />
              </div>
              <p className="mb-4">Pagamento via boleto bancário (compensação em 1-3 dias úteis)</p>
              <Button 
                onClick={() => onSelectMethod('Boleto')}
                disabled={isLoading}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Gerar Boleto Bancário"
                )}
              </Button>
              
              <div className="flex items-center gap-2 text-xs text-amber-600 mt-3 justify-center">
                <AlertCircle className="h-3 w-3" />
                <span>Nota: O prazo de entrega inicia apenas após a confirmação do pagamento do boleto (1-3 dias úteis)</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 p-3 bg-gray-100 rounded-md text-sm text-gray-600 border border-gray-200">
          <h4 className="font-medium flex items-center gap-1.5 mb-2">
            <Clock className="h-4 w-4" />
            Informações sobre processamento de pagamento
          </h4>
          <ul className="space-y-1.5 list-disc pl-5">
            <li>Cartão de Crédito e PIX: Confirmação imediata, projeto iniciado em até 24 horas.</li>
            <li>Boleto Bancário: O prazo de entrega só começa a contar após a confirmação do pagamento (1-3 dias úteis).</li>
            <li>Para maior agilidade na produção da sua música, recomendamos pagamentos via PIX ou cartão de crédito.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
