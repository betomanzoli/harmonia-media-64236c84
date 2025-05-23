import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield, FileText, Clock, Crown, Award } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

const CONTRACT_PREMIUM = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS - PACOTE PREMIUM

CLÁUSULA PRIMEIRA - DO OBJETO
1.1. Prestação de serviços de composição musical assistida por inteligência artificial com intervenção humana, conforme especificações do Pacote Premium.

CLÁUSULA SEGUNDA - DO ESCOPO DO SERVIÇO
2.1. O serviço inclui:
a) 5 (cinco) propostas de conceito/estilo;
b) 3 (três) revisões completas;
c) Registro da letra na Biblioteca Nacional;
d) Masterização profissional com ajustes manuais;
e) Stems completos separados;
f) Entrega em até 7 dias úteis;
g) Certificado digital de autoria com registro em blockchain e documentação completa.

CLÁUSULA TERCEIRA - DA CESSÃO DE DIREITOS AUTORAIS
3.1. A CONTRATADA transfere ao CONTRATANTE a titularidade dos direitos patrimoniais sobre a OBRA MUSICAL, nos termos do Termo de Cessão de Direitos Autorais anexo a este contrato.

CLÁUSULA QUARTA - DOS REGISTROS LEGAIS
4.1. A CONTRATADA providenciará o registro da LETRA da OBRA MUSICAL na Biblioteca Nacional em nome do CONTRATANTE.
4.2. A CONTRATADA realizará registro em blockchain como evidência de precedência temporal, não substituindo registros oficiais completos.
4.3. Quaisquer registros adicionais de melodia, arranjo ou fonograma em órgãos como UBC, ECAD ou similares são de responsabilidade exclusiva do CONTRATANTE.

CLÁUSULA QUINTA - DA TRANSFERÊNCIA DE TITULARIDADE
5.1. Com o pagamento integral, todos os direitos patrimoniais sobre a OBRA MUSICAL são transferidos ao CONTRATANTE.
5.2. O CONTRATANTE torna-se titular exclusivo para fins de exploração comercial, distribuição e modificação da OBRA MUSICAL.`;

const ContractPremium: React.FC = () => {
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

      // ✅ LINKS REAIS DO MERCADOPAGO - PREMIUM
      const paymentUrl = hasCoupon 
        ? 'https://mpago.li/28opNmP'  // Com cupom PREMIUM5
        : 'https://mpago.li/1fDXjQp'; // Normal

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
                    Termos de Serviço - Pacote Premium
                    <Crown className="w-5 h-5 text-yellow-500" />
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    Olá {clientData?.client_name}! Por favor, leia e aceite os termos abaixo para prosseguir.
                  </p>
                </div>
                <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-lg px-4 py-2">
                  R$ 969,00
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-600" />
                  Resumo do Pacote Premium
                  <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs">
                    <Crown className="w-3 h-3 mr-1" />
                    Direitos Completos
                  </Badge>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">O que está incluso:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>✅ 5 propostas de conceito/estilo</li>
                      <li>✅ 3 revisões completas</li>
                      <li>✅ Registro na Biblioteca Nacional</li>
                      <li>✅ Masterização profissional</li>
                      <li>✅ Stems completos separados</li>
                      <li>✅ Registro em blockchain</li>
                      <li>✅ Cessão total de direitos autorais</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Prazo de entrega:
                    </h4>
                    <p className="text-sm text-yellow-600 font-semibold">
                      Até 7 dias úteis
                    </p>
                    <h4 className="font-medium mb-2 mt-3 flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      Tipo de uso:
                    </h4>
                    <p className="text-sm">
                      Direitos totais transferidos
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Contrato de Prestação de Serviços</h3>
                <div className="bg-white border rounded-lg p-6 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                    {CONTRACT_PREMIUM}
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
                    Li e aceito os termos de serviço acima, estou ciente da cessão total de direitos autorais 
                    e concordo com as condições de entrega e registros legais do Pacote Premium.
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
                        Tenho o cupom de desconto PREMIUM5
                      </label>
                      <p className="text-xs text-blue-600 mt-1">
                        {hasCoupon 
                          ? '✅ Desconto será aplicado automaticamente no pagamento' 
                          : 'Se você possui o cupom PREMIUM5, marque esta opção para aplicar o desconto'
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
                      <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                        R$ 969,00
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
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
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

export default ContractPremium;
