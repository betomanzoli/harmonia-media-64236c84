import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, ArrowRight, Music, Clock } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const briefingId = searchParams.get('briefing');
  const packageType = searchParams.get('package');
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (briefingId && packageType) {
      processPaymentSuccess();
    }
  }, [briefingId, packageType]);

  const processPaymentSuccess = async () => {
    try {
      console.log('[DEBUG] Processando sucesso do pagamento:', { briefingId, packageType });

      // Atualizar status do briefing para pago
      const { error: updateError } = await supabase
        .from('briefings')
        .update({
          payment_status: 'completed',
          status: 'paid',
          payment_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', briefingId);

      if (updateError) throw updateError;

      console.log('[SUCCESS] Status do briefing atualizado para pago');

      toast({
        title: 'Pagamento Confirmado!',
        description: 'Agora você pode preencher o briefing detalhado.',
      });

      setIsProcessing(false);

    } catch (error) {
      console.error('[ERROR] Erro ao processar pagamento:', error);
      toast({
        title: 'Erro',
        description: 'Houve um problema ao confirmar seu pagamento. Entre em contato conosco.',
        variant: 'destructive'
      });
    }
  };

  const handleContinue = () => {
    // Redirecionar para briefing detalhado específico do pacote
    navigate(`/briefing/${packageType}?briefing=${briefingId}&paid=true`);
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Confirmando Pagamento</h2>
            <p className="text-gray-600">
              Aguarde enquanto processamos sua transação...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-600">
              Pagamento Confirmado! 🎉
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Obrigado pela sua confiança! Agora vamos criar sua música personalizada.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Status */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">
                    Pagamento Processado com Sucesso
                  </h3>
                  <p className="text-sm text-green-700">
                    Seu pedido foi confirmado e já está em nossa fila de produção.
                  </p>
                </div>
              </div>
            </div>

            {/* Próximos Passos */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Próximos Passos
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">
                      Complete o Briefing Detalhado
                    </h4>
                    <p className="text-sm text-blue-700">
                      Agora você precisa preencher informações mais específicas sobre sua música.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Nossa Equipe Criará sua Música
                    </h4>
                    <p className="text-sm text-gray-700">
                      Nossos especialistas trabalharão na sua música personalizada.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Receba sua Música
                    </h4>
                    <p className="text-sm text-gray-700">
                      Você receberá um link para ouvir e aprovar sua música.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações de Contato */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Precisando de Ajuda?</h4>
              <p className="text-sm text-gray-600 mb-2">
                Nossa equipe está sempre disponível para te ajudar:
              </p>
              <ul className="text-sm space-y-1">
                <li>📧 contato@harmonia.media</li>
                <li>📱 WhatsApp: (11) 99999-9999</li>
                <li>🕐 Atendimento: Segunda a Sexta, 9h às 18h</li>
              </ul>
            </div>

            {/* Botão de Continuar */}
            <Button 
              onClick={handleContinue}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
              size="lg"
            >
              <Music className="h-5 w-5 mr-2" />
              Continuar para Briefing Detalhado
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>

            <p className="text-center text-xs text-gray-500">
              Você receberá um email de confirmação em breve com todos os detalhes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
