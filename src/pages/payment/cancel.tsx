
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RotateCcw, Home, HelpCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

const PaymentCancel: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [clientData, setClientData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const briefingId = searchParams.get('briefing');
  const packageType = searchParams.get('package');

  // Mapear informações dos pacotes
  const PACKAGE_INFO = {
    essencial: { name: 'Essencial', price: 'R$ 219' },
    profissional: { name: 'Profissional', price: 'R$ 479' },
    premium: { name: 'Premium', price: 'R$ 969' }
  };

  const currentPackage = packageType ? PACKAGE_INFO[packageType as keyof typeof PACKAGE_INFO] : null;

  useEffect(() => {
    const processPaymentCancel = async () => {
      if (!briefingId) {
        setIsLoading(false);
        return;
      }

      try {
        // Atualizar status do briefing para cancelado
        const { error: updateError } = await supabase
          .from('briefings')
          .update({
            payment_status: 'cancelled',
            payment_cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', briefingId);

        if (updateError) {
          console.error('Erro ao atualizar status:', updateError);
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

        console.log('❌ Pagamento cancelado para briefing:', briefingId);

      } catch (error) {
        console.error('Erro ao processar cancelamento:', error);
      } finally {
        setIsLoading(false);
      }
    };

    processPaymentCancel();
  }, [briefingId]);

  // Tentar novamente o pagamento
  const handleRetryPayment = () => {
    if (briefingId && packageType) {
      navigate(`/contract/${packageType}?briefing=${briefingId}`);
    }
  };

  // Fazer novo briefing
  const handleNewBriefing = () => {
    navigate('/briefing');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-harmonia-green mx-auto mb-4"></div>
          <p className="text-gray-600">Processando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="container mx-auto max-w-3xl">
          
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-4 bg-red-500 rounded-full w-fit">
                <XCircle className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-3xl text-red-800 mb-2">
                Pagamento Cancelado
              </CardTitle>
              <p className="text-red-700 text-lg">
                {clientData?.client_name ? `${clientData.client_name}, ` : ''}
                seu pagamento foi cancelado ou não foi concluído.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-8">
              
              {/* Detalhes do que foi cancelado */}
              {currentPackage && (
                <div className="bg-white rounded-lg p-6 border border-red-200">
                  <h3 className="font-semibold text-lg mb-4 text-red-800">
                    Detalhes do Pacote
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Pacote Selecionado:</p>
                      <p className="font-semibold text-lg">
                        {currentPackage.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Valor:</p>
                      <p className="font-semibold text-lg text-red-600">
                        {currentPackage.price}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Motivos possíveis */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 text-yellow-800 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Por que isso pode ter acontecido?
                </h3>
                <ul className="space-y-2 text-sm text-yellow-700">
                  <li>• Você clicou em "Voltar" durante o processo de pagamento</li>
                  <li>• Houve um problema com seu cartão ou método de pagamento</li>
                  <li>• A conexão com a internet foi interrompida</li>
                  <li>• Você decidiu não finalizar a compra neste momento</li>
                </ul>
              </div>

              {/* Não se preocupe */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-blue-800">
                  Não se preocupe! 😊
                </h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  Seus dados do briefing foram salvos com segurança. Você pode tentar fazer o pagamento novamente 
                  a qualquer momento ou fazer um novo briefing se desejar alterar alguma informação.
                </p>
              </div>

              {/* Opções de ação */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-center">
                  O que você gostaria de fazer?
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tentar novamente */}
                  <Button 
                    onClick={handleRetryPayment}
                    className="w-full bg-harmonia-green hover:bg-harmonia-green/90 py-3"
                    disabled={!briefingId || !packageType}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Tentar Pagamento Novamente
                  </Button>

                  {/* Novo briefing */}
                  <Button 
                    onClick={handleNewBriefing}
                    variant="outline"
                    className="w-full py-3"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Fazer Novo Briefing
                  </Button>
                </div>

                {/* Outras opções */}
                <div className="flex gap-4 mt-6">
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
                    onClick={() => navigate('/contato')}
                    className="flex-1"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Preciso de Ajuda
                  </Button>
                </div>
              </div>

              {/* Suporte */}
              <div className="bg-gray-50 border rounded-lg p-6 text-center">
                <h3 className="font-semibold mb-3">Precisa de ajuda?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Nossa equipe está pronta para te ajudar com qualquer dúvida sobre pagamentos ou nossos serviços.
                </p>
                <div className="text-sm text-gray-700">
                  <p>📧 contato@harmonia.media</p>
                  <p>📱 WhatsApp: (11) 99999-9999</p>
                  <p>🕒 Atendimento: Segunda a Sexta, 9h às 18h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentCancel;
