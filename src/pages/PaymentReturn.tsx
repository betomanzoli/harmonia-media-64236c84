
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import emailService from '@/services/emailService';
import { createOrderData } from '@/lib/payment/orderUtils';

const PaymentReturn: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  
  // Extract parameters from URL
  const status = searchParams.get('status');
  const packageId = searchParams.get('packageId');
  const orderId = searchParams.get('orderId');
  const externalReference = searchParams.get('external_reference');
  
  useEffect(() => {
    const processPaymentReturn = async () => {
      // Wait a moment to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get stored payment data
      const storedPaymentData = localStorage.getItem('paymentData');
      let parsedData;
      
      if (storedPaymentData) {
        try {
          parsedData = JSON.parse(storedPaymentData);
          setPaymentData(parsedData);
        } catch (e) {
          console.error('Error parsing stored payment data:', e);
        }
      }
      
      // Validate the payment return
      if (status === 'approved' || status === 'success') {
        // Successful payment
        setSuccess(true);
        
        // Get qualification data
        const qualificationData = localStorage.getItem('qualificationData');
        let parsedQualificationData = null;
        
        if (qualificationData) {
          try {
            parsedQualificationData = JSON.parse(qualificationData);
          } catch (e) {
            console.error('Error parsing qualification data:', e);
          }
        }
        
        // If we have payment data from localStorage or from URL params, create order data
        if (parsedData || (packageId && orderId)) {
          const paymentInfo = parsedData || {
            packageId: packageId || 'essencial',
            orderId: orderId || `HAR-${Date.now()}`,
            method: 'MercadoPago',
            extras: []
          };
          
          // Create order data
          const orderData = createOrderData(
            paymentInfo,
            parsedQualificationData?.name || 'Cliente',
            'MercadoPago',
            paymentInfo.packageId
          );
          
          // Store order data
          localStorage.setItem('orderData', JSON.stringify(orderData));
          
          // Send email confirmation if we have the email
          if (parsedQualificationData?.email) {
            try {
              await emailService.sendPaymentConfirmation(
                parsedQualificationData.email,
                parsedQualificationData.name || 'Cliente',
                paymentInfo.packageName || 'Pacote harmonIA'
              );
            } catch (e) {
              console.error('Error sending confirmation email:', e);
            }
          }
          
          // Success toast
          toast({
            title: "Pagamento confirmado!",
            description: "Seu pedido foi registrado com sucesso. Por favor, preencha o briefing para iniciarmos o projeto.",
          });
        }
      } else {
        // Failed payment
        setSuccess(false);
        
        toast({
          title: "Pagamento não confirmado",
          description: "Houve um problema com seu pagamento. Por favor, tente novamente ou entre em contato com nosso suporte.",
          variant: "destructive",
        });
      }
      
      setLoading(false);
    };
    
    processPaymentReturn();
  }, [status, packageId, orderId, externalReference, toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-6 md:px-10">
          <div className="max-w-4xl mx-auto">
            <Card className="text-center p-8">
              <div className="flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-harmonia-green animate-spin mb-4" />
                <h2 className="text-2xl font-bold mb-2">Processando seu pagamento</h2>
                <p className="mb-6 text-gray-400">
                  Estamos verificando o status do seu pagamento, aguarde um momento...
                </p>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center p-8">
            <div className="flex flex-col items-center">
              {success ? (
                <div className="w-16 h-16 rounded-full bg-harmonia-green/20 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-harmonia-green" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              )}

              {success ? (
                <>
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
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentReturn;
