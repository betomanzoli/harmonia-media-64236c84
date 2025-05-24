
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { briefingStorage } from '@/utils/briefingStorage';
import { Loader2, CreditCard, Smartphone } from 'lucide-react';

const Payment: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [briefingData, setBriefingData] = useState(null);

  const briefingId = searchParams.get('briefing');

  useEffect(() => {
    if (!packageId) {
      navigate('/pacotes');
      return;
    }

    // Se há um briefingId, carregar os dados
    if (briefingId) {
      const data = briefingStorage.getBriefingData(briefingId);
      if (!data) {
        toast({
          title: "Dados não encontrados",
          description: "Dados do briefing não encontrados. Redirecionando...",
          variant: "destructive"
        });
        navigate('/briefing');
        return;
      }

      // Verificar se contrato foi aceito
      if (!data.contractAccepted) {
        toast({
          title: "Contrato não aceito",
          description: "Você precisa aceitar o contrato antes de prosseguir.",
          variant: "destructive"
        });
        navigate(`/contract/${packageId}?briefing=${briefingId}`);
        return;
      }

      setBriefingData(data);
    }
  }, [packageId, briefingId, navigate, toast]);

  const getPackageInfo = () => {
    switch (packageId) {
      case 'essencial':
        return {
          name: 'Pacote Essencial',
          price: 'R$ 297,00',
          features: [
            '1 música personalizada (até 3 min)',
            '2 revisões incluídas',
            'Entrega em MP3 e WAV',
            'Prazo: 7-10 dias úteis',
            'Licença para uso pessoal'
          ]
        };
      case 'profissional':
        return {
          name: 'Pacote Profissional',
          price: 'R$ 497,00',
          features: [
            '1 música personalizada (até 5 min)',
            '3 revisões incluídas',
            'Entrega em MP3, WAV e STEMS',
            'Prazo: 5-7 dias úteis',
            'Licença para uso comercial',
            'Consultoria musical incluída'
          ]
        };
      case 'premium':
        return {
          name: 'Pacote Premium',
          price: 'R$ 997,00',
          features: [
            '1 música personalizada (duração ilimitada)',
            'Revisões ilimitadas',
            'Entrega completa: MP3, WAV, STEMS e MIDI',
            'Prazo: 3-5 dias úteis',
            'Licença comercial completa',
            'Consultoria musical dedicada',
            'Produção exclusiva com compositor'
          ]
        };
      default:
        return null;
    }
  };

  const handlePayment = async (method: string) => {
    setIsLoading(true);

    try {
      // Simular integração com MercadoPago
      // Aqui você implementaria a integração real
      const paymentData = {
        package: packageId,
        briefingId: briefingId,
        method: method,
        successUrl: `${window.location.origin}/payment/success?briefing=${briefingId}`,
        cancelUrl: `${window.location.origin}/payment/cancel?briefing=${briefingId}`
      };

      // Para demonstração, vamos simular um redirecionamento para sucesso
      // Em produção, você redirecionaria para o MercadoPago
      toast({
        title: "Redirecionando para pagamento",
        description: "Você será redirecionado para finalizar o pagamento...",
      });

      // Simular redirecionamento após 2 segundos
      setTimeout(() => {
        navigate(`/payment/success?briefing=${briefingId}&payment_id=demo_${Date.now()}`);
      }, 2000);

    } catch (error) {
      console.error('Erro no pagamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar pagamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const packageInfo = getPackageInfo();

  if (!packageInfo) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-24 pb-20 px-6 md:px-10">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Pacote não encontrado</h1>
            <Button onClick={() => navigate('/pacotes')}>
              Ver Pacotes Disponíveis
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Finalizar Pagamento
            </h1>
            <p className="text-gray-600">
              Complete sua compra de forma segura
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Resumo do Pedido */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
                <CardDescription>
                  Confira os detalhes da sua compra
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{packageInfo.name}</h3>
                      <p className="text-sm text-gray-600">HarmonIA - Música Personalizada</p>
                    </div>
                    <span className="font-bold text-lg">{packageInfo.price}</span>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Incluído no pacote:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {packageInfo.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-harmonia-green mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {briefingData && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Informações do Cliente:</h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Nome:</strong> {briefingData.clientName}</p>
                        <p><strong>Email:</strong> {briefingData.email}</p>
                        {briefingData.company && (
                          <p><strong>Empresa:</strong> {briefingData.company}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{packageInfo.price}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Métodos de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle>Escolha o Método de Pagamento</CardTitle>
                <CardDescription>
                  Pagamento seguro processado pelo MercadoPago
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => handlePayment('card')}
                  disabled={isLoading}
                  className="w-full h-16 text-left justify-start bg-white border-2 border-gray-200 hover:border-harmonia-green hover:bg-gray-50 text-gray-900"
                >
                  <CreditCard className="mr-3 h-6 w-6 text-harmonia-green" />
                  <div>
                    <div className="font-semibold">Cartão de Crédito</div>
                    <div className="text-sm text-gray-600">Visa, Mastercard, Elo</div>
                  </div>
                </Button>

                <Button
                  onClick={() => handlePayment('pix')}
                  disabled={isLoading}
                  className="w-full h-16 text-left justify-start bg-white border-2 border-gray-200 hover:border-harmonia-green hover:bg-gray-50 text-gray-900"
                >
                  <Smartphone className="mr-3 h-6 w-6 text-harmonia-green" />
                  <div>
                    <div className="font-semibold">PIX</div>
                    <div className="text-sm text-gray-600">Pagamento instantâneo</div>
                  </div>
                </Button>

                {isLoading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-harmonia-green mr-2" />
                    <span className="text-sm text-gray-600">Processando pagamento...</span>
                  </div>
                )}

                <div className="text-xs text-gray-500 text-center mt-4">
                  <p>🔒 Pagamento 100% seguro</p>
                  <p>Seus dados são protegidos com criptografia SSL</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {briefingId && (
            <div className="mt-8 text-center">
              <Button 
                variant="outline"
                onClick={() => navigate(`/contract/${packageId}?briefing=${briefingId}`)}
              >
                Voltar ao Contrato
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
