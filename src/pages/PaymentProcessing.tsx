
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ShoppingCart, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { packagePaymentLinks } from '@/lib/payment/paymentLinks';
import { Script } from '@/components/ui/script';
import { packageData } from '@/lib/payment/packageData';

const PaymentProcessing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  
  // Extract parameters from URL
  const packageId = searchParams.get('packageId') || 'essencial';
  const orderId = searchParams.get('orderId') || '';
  const returnUrl = searchParams.get('returnUrl') || '';
  const discountApplied = searchParams.get('discount') === 'true';
  const paymentUrl = searchParams.get('paymentUrl') || '';
  
  // Get package details
  const packageInfo = packageData[packageId as keyof typeof packageData];
  
  // Get preference ID based on package and discount
  useEffect(() => {
    const paymentLinkData = packagePaymentLinks[packageId];
    
    if (paymentLinkData) {
      const preferenceData = discountApplied && paymentLinkData.discount 
        ? paymentLinkData.discount.preferenceId
        : paymentLinkData.standard.preferenceId;
      
      setPreferenceId(preferenceData);
    }
    
    setIsLoading(false);
  }, [packageId, discountApplied]);
  
  // Construct the iframe URL
  const iframeUrl = paymentUrl || `https://biolivre.com.br/harmoniam?package=${packageId}&returnUrl=${encodeURIComponent(returnUrl)}&embed=true`;
  
  useEffect(() => {
    // Listen for messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      // Check if the message is from biolivre.com.br
      if (event.origin !== 'https://biolivre.com.br') return;
      
      try {
        const data = JSON.parse(event.data);
        
        if (data.status === 'success' || data.status === 'approved') {
          // Payment successful, redirect to return page
          navigate(`/pagamento-retorno?status=approved&packageId=${packageId}&orderId=${orderId}`);
        } else if (data.status === 'error' || data.status === 'rejected') {
          // Payment failed
          navigate(`/pagamento-retorno?status=rejected&packageId=${packageId}&orderId=${orderId}`);
        }
      } catch (error) {
        console.error('Error processing message from iframe:', error);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate, packageId, orderId]);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6">
            <div className="mb-4 flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/pagamento/${packageId}`)}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <h2 className="text-xl font-semibold">Processando Pagamento</h2>
            </div>
            
            {packageInfo && (
              <div className="mb-6 p-4 border border-border rounded-lg bg-background/50">
                <h3 className="font-medium mb-2">Detalhes da compra:</h3>
                <div className="flex items-center mb-2">
                  <ShoppingCart className="h-4 w-4 text-harmonia-green mr-2" />
                  <span className="font-semibold">{packageInfo.name}</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  {discountApplied ? 'Preço com desconto aplicado' : 'Preço normal'}
                </p>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-semibold">{packageInfo.price}</span>
                  {discountApplied && (
                    <span className="ml-2 text-green-500 text-sm">
                      (Cupom de desconto aplicado)
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Pedido: #{orderId}
                </p>
              </div>
            )}
            
            <div className="rounded-lg border border-border p-4 mb-4">
              {preferenceId ? (
                <div className="flex flex-col items-center justify-center min-h-[600px]">
                  <div className="w-full max-w-md mx-auto">
                    <div className="text-center mb-6">
                      <h3 className="font-medium text-lg mb-2">
                        Escolha uma forma de pagamento abaixo
                      </h3>
                      <p className="text-sm text-gray-400">
                        O pagamento será processado pelo MercadoPago, uma plataforma segura
                      </p>
                    </div>
                    
                    <Script
                      src="https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js"
                      data-preference-id={preferenceId}
                      data-source="button"
                    />
                    <p className="text-center mt-6 text-sm text-muted-foreground">
                      Ou, se preferir, acesse diretamente:
                    </p>
                    <div className="flex justify-center mt-2">
                      <Button 
                        variant="outline"
                        className="text-sm"
                        onClick={() => window.open(paymentUrl, '_blank')}
                      >
                        Abrir página de pagamento
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-[-135deg]" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <iframe 
                  src={iframeUrl}
                  width="100%" 
                  height="700" 
                  frameBorder="0"
                  title="MercadoPago Checkout"
                  className="w-full rounded-md"
                />
              )}
            </div>
            
            <div className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg">
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              <p className="text-sm">Aguarde enquanto processamos o seu pagamento...</p>
            </div>
            
            <div className="mt-6 text-sm text-gray-400">
              <p className="font-medium text-gray-500 mb-2">Informações do pagamento:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Pagamento processado com segurança pelo MercadoPago</li>
                <li>Você receberá a confirmação por e-mail</li>
                <li>Após o pagamento, você poderá preencher o briefing</li>
                <li>A contagem do prazo de entrega começa após a confirmação</li>
                <li>Em caso de dúvidas, entre em contato pelo WhatsApp</li>
              </ul>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentProcessing;
