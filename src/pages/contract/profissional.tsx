import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield, FileText, Clock, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

const CONTRACT_PROFISSIONAL = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS - PACOTE PROFISSIONAL

CLÁUSULA PRIMEIRA - DO OBJETO
1.1. Prestação de serviços de composição musical assistida por inteligência artificial com intervenção humana, conforme especificações do Pacote Profissional.

CLÁUSULA SEGUNDA - DO ESCOPO DO SERVIÇO
2.1. O serviço inclui:
a) 3 (três) propostas de composição em estilos diferentes;
b) 2 (duas) revisões incluídas;
c) Masterização básica;
d) Stems básicos separados (voz + instrumentação);
e) Entrega em até 5 dias úteis;
f) Certificado digital de autoria com verificação via hash criptográfico.

CLÁUSULA TERCEIRA - DOS DIREITOS CONCEDIDOS
3.1. O CONTRATANTE recebe uma licença limitada para:
a) Uso em conteúdo digital próprio (canais pessoais de redes sociais, podcast, site);
b) Monetização em plataformas digitais onde o CONTRATANTE seja o titular da conta;
c) Execução em eventos particulares ou corporativos do CONTRATANTE.
3.2. É expressamente VEDADO:
a) Sublicenciar ou revender a OBRA MUSICAL;
b) Ceder a terceiros para uso em conteúdo não vinculado diretamente ao CONTRATANTE;
c) Sincronização comercial com produções audiovisuais para distribuição em cinema ou TV.

CLÁUSULA QUARTA - DA PROPRIEDADE INTELECTUAL
4.1. O CONTRATANTE detém direitos sobre o conteúdo fornecido para criação.
4.2. A CONTRATADA mantém direitos sobre melodia, harmonia e arranjos.
4.3. A OBRA MUSICAL é protegida por certificado digital de autoria com verificação hash.
4.4. Qualquer registro adicional da OBRA MUSICAL em órgãos como UBC, ECAD ou similares é de responsabilidade exclusiva do CONTRATANTE.`;

const ContractProfissional: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const [hasCoupon, setHasCoupon] = useState(false);
  const [clientData, setClientData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const briefingId = searchParams.get('briefing');

  useEffect(() => {
    const loadClientData = async () => {
      if (!briefingId) return;

      try {
        const { data, error } = await supabase
          .from('briefings')
          .select('*')
          .eq('id', briefingId)
          .single();

        if (error) throw error;
        setClientData(data);
      } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClientData();
  }, [briefingId]);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      await supabase
        .from('briefings')
        .update({
          contract_accepted: true,
          contract_accepted_at: new Date().toISOString(),
          payment_status: 'redirected_to_payment'
        })
        .eq('id', briefingId);

      // ✅ LINKS REAIS DO MERCADOPAGO - PROFISSIONAL
      const paymentUrl = hasCoupon 
        ? 'https://mpago.la/2E1tYaj'  // Com cupom PROFISSIONAL5
        : 'https://mpago.la/1fejmqL'; // Normal

      window.location.href = paymentUrl;

    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !clientData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-harmonia-green mx-auto mb-4"></div>
          <p>Carregando contrato...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="container mx-auto max-w-4xl">
          
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center gap-1 text-gray-400 hover:text-white"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>

          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <FileText className="w-6 h-6 text-harmonia-green" />
                    Termos de Serviço - Pacote Profissional
                    <Star className="w-5 h-5 text-yellow-500" />
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    Olá {clientData?.client_name}! Por favor, leia e aceite os termos abaixo para prosseguir.
                  </p>
                </div>
                <Badge className="bg-harmonia-green text-white text-lg px-4 py-2">
                  R$ 479,00
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              
              <div className="bg-gradient-to-r from-harmonia-green/10 to-blue-50 p-6 rounded-lg border border-harmonia-green/20">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-harmonia-green" />
                  Resumo do Pacote Profissional
                  <Badge className="bg-harmonia-green text-white text-xs">Mais Popular</Badge>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">O que está incluso:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>✅ 3 propostas em estilos diferentes</li>
                      <li>✅ 2 revisões incluídas</li>
                      <li>✅ Masterização básica</li>
                      <li>✅ Stems separados básicos</li>
                      <li>✅ Certificado digital com hash</li>
                      <li>✅ Uso comercial em plataformas digitais</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Prazo de entrega:
                    </h4>
                    <p className="text-sm text-harmonia-green font-semibold">
                      Até 5 dias úteis
                    </p>
                    <h4 className="font-medium mb-2 mt-3">Tipo de uso:</h4>
                    <p className="text-sm">
                      Comercial limitado + Pessoal
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Contrato de Prestação de Serviços</h3>
                <div className="bg-white border rounded-lg p-6 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                    {CONTRACT_PROFISSIONAL}
                  </pre>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="accept-terms"
                    checked={accepted}
                    onCheckedChange={setAccepted}
                    className="mt-1"
                  />
                  <label htmlFor="accept-terms" className="text-sm leading-relaxed cursor-pointer">
                    Li e aceito os termos de serviço acima, estou ciente dos direitos de uso comercial limitado 
                    e concordo com as condições de entrega e direitos do Pacote Profissional.
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  🎯 Cupom de Desconto Disponível!
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="has-coupon"
                      checked={hasCoupon}
                      onCheckedChange={setHasCoupon}
                      className="mt-1"
                    />
                    <div>
                      <label htmlFor="has-coupon" className="text-sm font-medium text-blue-800 cursor-pointer">
                        Tenho o cupom de desconto PROFISSIONAL5
                      </label>
                      <p className="text-xs text-blue-600 mt-1">
                        {hasCoupon 
                          ? '✅ Desconto será aplicado automaticamente no pagamento' 
                          : 'Se você possui o cupom PROFISSIONAL5, marque esta opção para aplicar o desconto'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Total a pagar:</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold text-harmonia-green">
                        R$ 479,00
                      </p>
                      {hasCoupon && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Com desconto aplicado
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Pagamento único via MercadoPago
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(-1)}
                    className="flex-1"
                  >
                    ← Voltar e Revisar
                  </Button>
                  <Button 
                    onClick={handlePayment}
                    disabled={!accepted || isLoading}
                    className="flex-1 bg-harmonia-green hover:bg-harmonia-green/90"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Redirecionando...
                      </div>
                    ) : (
                      '✅ Aceitar e Pagar via MercadoPago'
                    )}
                  </Button>
                </div>

                <div className="text-center mt-4">
                  <p className="text-xs text-gray-500">
                    🔒 Seus dados estão protegidos. Pagamento processado de forma segura pelo MercadoPago.
                  </p>
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

export default ContractProfissional;
