import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, Smartphone, CheckCircle, Clock, Shield } from 'lucide-react';

interface BriefingData {
  id: string;
  client_name: string;
  client_email: string;
  selected_package: string;
  contract_accepted: boolean;
}

const Payment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const briefingId = searchParams.get('briefing');
  const packageType = searchParams.get('package');
  const [briefingData, setBriefingData] = useState<BriefingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ LINKS MERCADOPAGO REAIS (substitua pelos seus)
  const mercadoPagoLinks = {
    essencial: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=1308986966-essencial-219-harmonia-2024',
    profissional: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=1308986966-profissional-479-harmonia-2024',
    premium: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=1308986966-premium-969-harmonia-2024'
  };

  const packageDetails = {
    essencial: {
      name: 'Essencial',
      price: 'R$ 219,00',
      description: 'Música personalizada para uso pessoal',
      features: [
        '1 música personalizada',
        '2 versões para escolha',
        'Certificado digital',
        'Entrega em 5 dias úteis',
        'Uso pessoal'
      ],
      color: 'bg-green-500'
    },
    profissional: {
      name: 'Profissional',
      price: 'R$ 479,00',
      description: 'Música para uso comercial',
      features: [
        '1 música personalizada',
        '5 versões para escolha',
        'Uso comercial liberado',
        'Consulta de 15 minutos',
        'Entrega em 7 dias úteis',
        'Formatos MP3 + WAV'
      ],
      color: 'bg-blue-500'
    },
    premium: {
      name: 'Premium',
      price: 'R$ 969,00',
      description: 'Registro legal + propriedade total',
      features: [
        '1 música personalizada',
        '8 versões + 3 extras',
        'Registro na Biblioteca Nacional',
        'Propriedade 100% sua',
        'Consulta de 30 minutos',
        'Entrega em 10 dias úteis',
        'Todos os formatos'
      ],
      color: 'bg-purple-500'
    }
  };

  useEffect(() => {
    if (briefingId && packageType) {
      loadBriefingData();
    } else {
      navigate('/briefing');
    }
  }, [briefingId, packageType]);

  const loadBriefingData = async () => {
    try {
      const { data, error } = await supabase
        .from('briefings')
        .select('*')
        .eq('id', briefingId)
        .single();

      if (error) throw error;

      // Verificar se contrato foi aceito
      if (!data.contract_accepted) {
        toast({
          title: 'Contrato não aceito',
          description: 'Você precisa aceitar o contrato antes do pagamento.',
          variant: 'destructive'
        });
        navigate(`/contract/${packageType}?briefing=${briefingId}`);
        return;
      }

      setBriefingData(data);
    } catch (error) {
      console.error('Erro ao carregar briefing:', error);
      toast({
        title: 'Erro',
        description: 'Briefing não encontrado.',
        variant: 'destructive'
      });
      navigate('/briefing');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (paymentMethod: 'pix' | 'card') => {
    try {
      console.log('[DEBUG] Iniciando pagamento:', { briefingId, packageType, paymentMethod });

      // Atualizar status para pagamento iniciado
      await supabase
        .from('briefings')
        .update({
          payment_method: paymentMethod,
          payment_status: 'pending',
          status: 'payment_pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', briefingId);

      // Redirecionar para MercadoPago
      const paymentUrl = mercadoPagoLinks[packageType as keyof typeof mercadoPagoLinks];
      
      if (paymentUrl) {
        // Adicionar parâmetros de retorno
        const returnUrl = `${window.location.origin}/payment/success?briefing=${briefingId}&package=${packageType}`;
        const cancelUrl = `${window.location.origin}/payment/cancel?briefing=${briefingId}&package=${packageType}`;
        
        window.location.href = `${paymentUrl}&success_url=${encodeURIComponent(returnUrl)}&failure_url=${encodeURIComponent(cancelUrl)}`;
      } else {
        throw new Error('Link de pagamento não encontrado');
      }

    } catch (error) {
      console.error('[ERROR] Erro no pagamento:', error);
      toast({
        title: 'Erro no Pagamento',
        description: 'Não foi possível processar o pagamento. Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Carregando dados do pagamento...</p>
        </div>
      </div>
    );
  }

  if (!briefingData) {
    return null;
  }

  const selectedPackage = packageDetails[packageType as keyof typeof packageDetails];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/contract/${packageType}?briefing=${briefingId}`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Contrato
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resumo do Pedido */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Resumo do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Cliente:</span>
                  <span>{briefingData.client_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{briefingData.client_email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Pacote:</span>
                  <Badge className={selectedPackage.color}>
                    {selectedPackage.name}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">{selectedPackage.price}</span>
                </div>
              </CardContent>
            </Card>

            {/* Métodos de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle>Escolha a Forma de Pagamento</CardTitle>
                <p className="text-gray-600">Pagamento 100% seguro via MercadoPago</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => handlePayment('pix')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white p-4 h-auto"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-semibold">PIX - Pagamento Instantâneo</div>
                      <div className="text-sm opacity-90">Aprovação imediata</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handlePayment('card')}
                  variant="outline"
                  className="w-full p-4 h-auto border-2"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-semibold">Cartão de Crédito</div>
                      <div className="text-sm text-gray-600">Parcele em até 12x sem juros</div>
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Segurança */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-green-600">
                  <Shield className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Pagamento 100% Seguro</div>
                    <div className="text-sm text-gray-600">
                      Processado pelo MercadoPago com criptografia SSL
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detalhes do Pacote */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  Pacote {selectedPackage.name}
                </CardTitle>
                <div className="text-center text-2xl font-bold text-green-600">
                  {selectedPackage.price}
                </div>
                <p className="text-center text-gray-600">
                  {selectedPackage.description}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedPackage.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Próximos Passos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>Efetue o pagamento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>Complete o briefing detalhado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span>Aguarde sua música personalizada</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
