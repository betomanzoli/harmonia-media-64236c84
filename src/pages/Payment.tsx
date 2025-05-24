
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, Smartphone, CheckCircle, Clock, Shield, Tag } from 'lucide-react';

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
  const [cupomCode, setCupomCode] = useState('');
  const [cupomApplicado, setCupomApplicado] = useState(false);

  const packageDetails = {
    essencial: {
      name: 'Essencial',
      price: 219,
      priceFormatted: 'R$ 219,00',
      description: 'Música personalizada para uso pessoal',
      features: [
        '1 música personalizada',
        '2 versões para escolha',
        'Certificado digital',
        'Entrega em 5 dias úteis',
        'Uso pessoal'
      ],
      color: 'bg-green-500',
      mercadoPagoLink: 'https://mpago.la/2C16Zhc',
      mercadoPagoLinkCupom: 'https://mpago.la/1cimFu6',
      cupomValido: 'ESSENCIAL5'
    },
    profissional: {
      name: 'Profissional',
      price: 479,
      priceFormatted: 'R$ 479,00',
      description: 'Música para uso comercial',
      features: [
        '1 música personalizada',
        '5 versões para escolha',
        'Uso comercial liberado',
        'Consulta de 15 minutos',
        'Entrega em 7 dias úteis',
        'Formatos MP3 + WAV'
      ],
      color: 'bg-blue-500',
      mercadoPagoLink: 'https://mpago.la/1fejmqL',
      mercadoPagoLinkCupom: 'https://mpago.la/2E1tYaj',
      cupomValido: 'PROFISSIONAL5'
    },
    premium: {
      name: 'Premium',
      price: 969,
      priceFormatted: 'R$ 969,00',
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
      color: 'bg-purple-500',
      mercadoPagoLink: 'https://mpago.li/1fDXjQp',
      mercadoPagoLinkCupom: 'https://mpago.li/28opNmP',
      cupomValido: 'PREMIUM5'
    }
  };

  useEffect(() => {
    if (briefingId && packageType) {
      loadBriefingData();
    } else {
      navigate('/briefing');
    }
  }, [briefingId, packageType, navigate]);

  const loadBriefingData = async () => {
    try {
      const { data, error } = await supabase
        .from('briefings')
        .select('*')
        .eq('id', briefingId)
        .single();

      if (error) throw error;
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

  const handleCupomApply = () => {
    if (!packageType || !(packageType in packageDetails)) return;
    
    const selectedPackage = packageDetails[packageType as keyof typeof packageDetails];
    
    if (cupomCode.toUpperCase() === selectedPackage.cupomValido) {
      setCupomApplicado(true);
      toast({
        title: 'Cupom aplicado!',
        description: 'Desconto de 5% aplicado com sucesso.',
      });
    } else {
      toast({
        title: 'Cupom inválido',
        description: 'Este cupom não é válido para este pacote.',
        variant: 'destructive'
      });
    }
  };

  const handlePayment = async (paymentMethod: 'pix' | 'card') => {
    if (!packageType || !(packageType in packageDetails)) return;
    
    try {
      console.log('[DEBUG] Iniciando pagamento:', { briefingId, packageType, paymentMethod, cupomApplicado });

      await supabase
        .from('briefings')
        .update({
          payment_method: paymentMethod,
          payment_status: 'pending',
          status: 'payment_pending',
          coupon_applied: cupomApplicado ? cupomCode : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', briefingId);

      const selectedPackage = packageDetails[packageType as keyof typeof packageDetails];
      const paymentUrl = cupomApplicado ? selectedPackage.mercadoPagoLinkCupom : selectedPackage.mercadoPagoLink;
      
      if (paymentUrl) {
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

  if (!briefingData || !packageType || !(packageType in packageDetails)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p>Dados de pagamento inválidos</p>
          <Button onClick={() => navigate('/briefing')} className="mt-4">
            Voltar ao Briefing
          </Button>
        </div>
      </div>
    );
  }

  const selectedPackage = packageDetails[packageType as keyof typeof packageDetails];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/briefing')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Briefing
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Cupom de Desconto</span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={cupomCode}
                      onChange={(e) => setCupomCode(e.target.value)}
                      placeholder={`Digite ${selectedPackage.cupomValido} para 5% de desconto`}
                      disabled={cupomApplicado}
                    />
                    <Button 
                      onClick={handleCupomApply}
                      variant="outline"
                      disabled={cupomApplicado || !cupomCode}
                    >
                      {cupomApplicado ? '✓ Aplicado' : 'Aplicar'}
                    </Button>
                  </div>
                  {cupomApplicado && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ Desconto de 5% aplicado com sucesso!
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-lg font-bold border-t pt-4">
                  <span>Total:</span>
                  <div className="text-right">
                    {cupomApplicado && (
                      <div className="text-sm text-gray-500 line-through">
                        {selectedPackage.priceFormatted}
                      </div>
                    )}
                    <span className="text-green-600">
                      {cupomApplicado 
                        ? `R$ ${Math.round(selectedPackage.price * 0.95)},00` 
                        : selectedPackage.priceFormatted
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

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

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  Pacote {selectedPackage.name}
                </CardTitle>
                <div className="text-center text-2xl font-bold text-green-600">
                  {cupomApplicado 
                    ? `R$ ${Math.round(selectedPackage.price * 0.95)},00` 
                    : selectedPackage.priceFormatted
                  }
                </div>
                {cupomApplicado && (
                  <div className="text-center text-sm text-gray-500 line-through">
                    De: {selectedPackage.priceFormatted}
                  </div>
                )}
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
