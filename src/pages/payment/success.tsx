import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Mail, ArrowRight, Home } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [clientData, setClientData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const briefingId = searchParams.get('briefing');
  const packageType = searchParams.get('package');
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  // Mapear informações dos pacotes
  const PACKAGE_INFO = {
    essencial: {
      name: 'Essencial',
      price: 'R$ 219',
      deliveryTime: '72 horas úteis',
      nextStep: 'Briefing Detalhado'
    },
    profissional: {
      name: 'Profissional', 
      price: 'R$ 479',
      deliveryTime: '5 dias úteis',
      nextStep: 'Briefing Detalhado + Agendamento'
    },
    premium: {
      name: 'Premium',
      price: 'R$ 969', 
      deliveryTime: '7 dias úteis',
      nextStep: 'Briefing Detalhado + Consultoria'
    }
  };

  const currentPackage = packageType ? PACKAGE_INFO[packageType as keyof typeof PACKAGE_INFO] : null;

  useEffect(() => {
    const processPaymentSuccess = async () => {
      if (!briefingId || !packageType) {
        setIsLoading(false);
        return;
      }

      try {
        // Atualizar status do briefing para confirmado
        const { error: updateError } = await supabase
          .from('briefings')
          .update({
            payment_status: 'confirmed',
            payment_id: paymentId,
            payment_confirmed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', briefingId);

        if (updateError) {
          console.error('Erro ao atualizar briefing:', updateError);
        }

        // Carregar dados do cliente
        const { data: briefingData, error: fetchError } = await supabase
          .from('briefings')
          .select('*')
          .eq('id', briefingId)
          .single();

        if (fetchError) {
          console.error('Erro ao carregar dados:', fetchError);
        } else {
          setClientData(briefingData);
        }

        console.log('✅ Pagamento confirmado para briefing:', briefingId);

      } catch (error) {
        console.error('Erro ao processar confirmação de pagamento:', error);
      } finally {
        setIsLoading(false);
      }
    };

    processPaymentSuccess();
  }, [briefingId, packageType, paymentId]);

  // Redirecionar para briefing específico após delay
  const handleRedirectToBriefing = () => {
    setIsRedirecting(true);
    // Redirecionar para briefing específico do pacote
    setTimeout(() => {
      navigate(`/briefing/${packageType}?briefing=${briefingId}`);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-harmonia-green mx-auto mb-4"></div>
          <p className="text-gray-600">Confirmando seu pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="container mx-auto max-w-4xl">
          
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-4 bg-green-500 rounded-full w-fit">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-3xl text-green-800 mb-2">
                Pagamento Confirmado! 🎉
              </CardTitle>
              <p className="text-green-700 text-lg">
                Obrigado, {clientData?.client_name || 'Cliente'}! Seu pagamento foi processado com sucesso.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-8">
              
              {/* Detalhes do Pagamento */}
              <div className="bg-white rounded-lg p-6 border border-green-200">
                <h3 className="font-semibold text-lg mb-4 text-green-800">
                  Detalhes da Compra
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Pacote Adquirido:</p>
                    <p className="font-semibold text-lg flex items-center gap-2">
                      {currentPackage?.name}
                      <Badge className="bg-harmonia-green text-white">
                        {currentPackage?.price}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Prazo de Entrega:</p>
                    <p className="font-semibold text-lg flex items-center gap-1">
                      <Clock className="w-4 h-4 text-harmonia-green" />
                      {currentPackage?.deliveryTime}
                    </p>
                  </div>
                  {paymentId && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">ID do Pagamento:</p>
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                        {paymentId}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Próximos Passos */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 text-blue-800 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5" />
                  Próximos Passos
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">Complete seu briefing detalhado</p>
                      <p className="text-sm text-blue-600">
                        Agora você precisa fornecer mais detalhes sobre sua música para que possamos criar exatamente o que você imagina.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">Receba sua música personalizada</p>
                      <p className="text-sm text-blue-600">
                        Em até {currentPackage?.deliveryTime}, você receberá sua música pronta por email.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">Aprove ou solicite ajustes</p>
                      <p className="text-sm text-blue-600">
                        Você poderá revisar sua música e solicitar ajustes conforme incluído em seu pacote.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirmação por Email */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-yellow-800 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Confirmação por Email
                </h3>
                <p className="text-yellow-700 text-sm">
                  Um email de confirmação foi enviado para <strong>{clientData?.client_email}</strong> com todos os detalhes da sua compra e próximos passos.
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-4">
                <Button 
                  onClick={handleRedirectToBriefing}
                  disabled={isRedirecting}
                  className="w-full bg-harmonia-green hover:bg-harmonia-green/90 text-lg py-3"
                >
                  {isRedirecting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Redirecionando...
                    </div>
                  ) : (
                    <>
                      Continuar com {currentPackage?.nextStep}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
                
                <div className="flex gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="flex-1"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Voltar ao Início
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/acompanhar-pedido')}
                    className="flex-1"
                  >
                    Acompanhar Pedido
                  </Button>
                </div>
              </div>

              {/* Informações de Suporte */}
              <div className="text-center text-sm text-gray-600">
                <p>Dúvidas? Entre em contato conosco:</p>
                <p>
                  📧 contato@harmonia.media | 
                  📱 WhatsApp: (11) 99999-9999
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
