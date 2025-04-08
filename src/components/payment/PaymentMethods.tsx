
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Clock, CheckCircle, ExternalLink } from 'lucide-react';

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
                  <svg className="w-5 h-5 text-harmonia-green" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M242.2 96.6l-48.5-19.8c-13-5.3-27.9 1.7-32.4 15.1l-5.9 17.5c-1.6 4.8-.4 9.8 3.1 13.1l24.2 22.8-12.9 82.1c-1.9 12.1 4.4 23.9 15.5 28.8l83.8 36.7c2.5 1.1 5.3.8 7.6-.8l62.8-45.7c11.1-8.1 14.8-23.2 8.6-35.6l-11.5-23.1 25.1-41.9c2.7-4.5 2.6-10.3-.4-14.7l-15-22.9c-7.9-12-24.1-15.1-36.1-7l-48.5 33.1c-7.1 4.8-16.2 6.5-24.7 4.5l-5-1.3c-5.9-1.6-9.5-7.7-8.1-13.7 1.2-5.1 5.8-8.6 11-8.6h32c13.2 0 24-10.8 24-24s-10.8-24-24-24h-88.8c-10.9 0-21.1 5.6-26.9 14.8l-9.6 15.2c-4.8 7.6-3 17.6 4.3 22.8l12.3 8.8z"/>
                    <path d="M320 256c0 6.2-2 11.9-5.2 16.6l-53.3 40c-11.1 8.3-25.6 9.4-37.8 2.8l-88.8-38.9c-5.8-2.5-9.9-7.3-11.4-13.1-1.4-5.2-.7-10.6 2-15.1l7.9-13.2c12-20 11.6-45-1.2-64.5l-7.6-11.7c-5.4-8.3-5-19.1.9-27l20.9-27.8c1.7-2.3 4.4-3.5 7.2-3.5h19.8c4.5 0 8.6 2.6 10.5 6.6 1 2 1.5 4.3 1.5 6.5v.8c0 7.7-4.1 14.8-10.8 18.6l-7.1 4c-4.4 2.5-5.9 8-3.5 12.4 2.5 4.4 8 5.9 12.4 3.5l7.1-4c14.8-8.3 24-24 24-41.1v-.8c0-6.1-1.4-12.1-4-17.5-5.8-11.9-17.8-19.5-31-19.5h-19.8c-8.5 0-16.6 3.9-22 10.5l-20.9 27.8c-14.5 19.3-15.6 45.9-2.7 66.5l7.6 11.7c6.9 10.6 7.2 24.1.6 35l-7.9 13.2c-6.4 10.8-8.1 23.8-4.7 36 3.6 13.9 13.1 25.5 26 32l88.8 38.9c21.8 9.5 47.5 7.1 67-6.5l53.3-40c7-5.2 11.1-13.4 11.1-22.2 0-15.2-12.4-27.6-27.6-27.6h-8c-6.8 0-12.8 4.5-14.7 11-2.9 10-13.5 15.8-23.5 12.9-10-2.9-15.8-13.5-12.9-23.5 6.1-21 25.6-35.5 47.9-35.5h8c26.7.2 48.4 22 48.4 48.7z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Pix</h3>
                  <p className="text-sm text-gray-400">Pagamento instantâneo</p>
                </div>
              </div>
              <Button 
                disabled={isLoading} 
                onClick={() => onSelectMethod('Pix')}
                className="bg-harmonia-green hover:bg-harmonia-green/90"
              >
                {isLoading ? 'Processando...' : 'Gerar QR Code'}
              </Button>
            </div>
            <div className="flex items-center text-xs text-green-600 mt-2 bg-green-50 p-2 rounded">
              <CheckCircle className="w-3 h-3 mr-1" />
              <span>Início do projeto: imediato após a confirmação</span>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition cursor-pointer bg-gradient-to-r from-blue-50/10 to-blue-100/10">
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
            <li>Pagamentos via cartão de crédito são confirmados imediatamente</li>
            <li>Pagamentos via Pix são confirmados em poucos minutos</li>
            <li>O prazo de entrega é contado a partir da confirmação do pagamento</li>
            <li>Seus dados de pagamento são protegidos por criptografia</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default PaymentMethods;
