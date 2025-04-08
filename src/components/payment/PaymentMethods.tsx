
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from 'lucide-react';

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
          <div className="border border-border rounded-lg p-4 hover:border-blue-500/50 transition cursor-pointer bg-gradient-to-r from-blue-50/10 to-blue-100/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24">
                    <path fill="#0095de" d="M46.746,24c0-12.8-10.354-21-22.773-21C11.557,3,1,11.2,1,24c0,12.8,10.557,21,22.973,21S46.746,36.8,46.746,24"/>
                    <path fill="#ffcf00" d="M13.992,29h2.638a.515.515,0,0,0,.527-.422l.17-.646a.515.515,0,0,0-.526-.423H14.162a.515.515,0,0,1-.526-.422l-.171-.648a.517.517,0,0,1,.527-.424h2.637a.515.515,0,0,0,.527-.422l.171-.646a.515.515,0,0,0-.527-.422H14.339a.514.514,0,0,1-.527-.421l-.171-.648a.516.516,0,0,1,.527-.423h2.637a.517.517,0,0,0,.527-.424l.171-.646a.515.515,0,0,0-.527-.422H12.852c-.242,0-.4-.1-.367-.3l.273-1.025a.516.516,0,0,1,.526-.422h7.179a.5.5,0,0,1,.515.312l.539,2.031c.011.216-.12.343-.4.343H18.583a.515.515,0,0,0-.527.422l-.17.646a.516.516,0,0,0,.527.424h2.329a.5.5,0,0,1,.516.312l.538,2.031c.11.216-.12.343-.4.343H18.412a.515.515,0,0,0-.527.422l-.17.646a.516.516,0,0,0,.527.424H20.9a.5.5,0,0,1,.515.312l.539,2.031c.11.216-.121.343-.4.343H15.334a.5.5,0,0,1-.515-.312l-1.348-5.09C13.46,27.125,13.591,27,13.874,27Z"/>
                    <path fill="#fff" d="M27,20.693a.516.516,0,0,1,.526-.439h4.064a.5.5,0,0,1,.526.438l.193.975a.5.5,0,0,1-.526.439H27.719a.516.516,0,0,0-.526.439l-.227,1.161a.516.516,0,0,0,.526.439h3A.5.5,0,0,1,31,25.107l-.186.94a.515.515,0,0,1-.53.439h-2.99a.518.518,0,0,0-.527.44L26.56,28.09a.515.515,0,0,0,.527.438h3.12a.5.5,0,0,1,.515.439l-.191.966a.5.5,0,0,1-.515.437H25.952a.5.5,0,0,1-.526-.437l1.539-7.8c.011-.216.122-.342.405-.342H33.4a.5.5,0,0,1,.527.436l.193.975a.5.5,0,0,1-.527.439H27.719a.515.515,0,0,0-.526.438Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">MercadoPago</h3>
                  <p className="text-sm text-gray-400">Cartão, Pix e mais opções</p>
                </div>
              </div>
              <Button 
                disabled={isLoading} 
                onClick={() => onSelectMethod('MercadoPago')}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isLoading ? 'Processando...' : 'Pagar com MercadoPago'}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center text-xs text-blue-600 mt-2 bg-blue-50 p-2 rounded">
              <ExternalLink className="w-3 h-3 mr-1" />
              <span>Você será redirecionado para o site de pagamento seguro</span>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="text-sm text-gray-400">
          <p className="mb-2">Informações importantes:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Todos os pagamentos são processados em Reais (BRL)</li>
            <li>Pagamentos são processados com segurança pelo MercadoPago</li>
            <li>Você pode escolher entre cartão de crédito, Pix e outros métodos na página de pagamento</li>
            <li>O prazo de entrega é contado a partir da confirmação do pagamento</li>
            <li>Seus dados de pagamento são protegidos por criptografia</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default PaymentMethods;
