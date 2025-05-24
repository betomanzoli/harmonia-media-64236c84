
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentCancel: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const briefingId = searchParams.get('briefing');
  const packageType = searchParams.get('package');

  useEffect(() => {
    if (briefingId) {
      updateBriefingStatus();
    }
  }, [briefingId]);

  const updateBriefingStatus = async () => {
    try {
      await supabase
        .from('briefings')
        .update({
          payment_status: 'cancelled',
          status: 'payment_cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', briefingId);

      console.log('[INFO] Briefing status updated to cancelled');
    } catch (error) {
      console.error('[ERROR] Failed to update briefing status:', error);
    }
  };

  const handleRetryPayment = () => {
    if (briefingId && packageType) {
      navigate(`/payment?briefing=${briefingId}&package=${packageType}`);
    } else {
      navigate('/briefing');
    }
  };

  const handleBackToBriefing = () => {
    navigate('/briefing');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-red-600">
              Pagamento Cancelado
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Sua transação foi cancelada. Não se preocupe, você pode tentar novamente.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800">
                    O que aconteceu?
                  </h3>
                  <p className="text-sm text-yellow-700">
                    O pagamento foi cancelado antes da conclusão. Isso pode acontecer por diversos motivos.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Possíveis causas:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Cancelamento voluntário durante o processo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Problema temporário com o método de pagamento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Timeout da sessão de pagamento</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleRetryPayment}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                size="lg"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Tentar Pagamento Novamente
              </Button>

              <Button 
                onClick={handleBackToBriefing}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar ao Briefing
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Precisa de Ajuda?</h4>
              <p className="text-sm text-gray-600 mb-2">
                Nossa equipe está sempre disponível para te ajudar:
              </p>
              <ul className="text-sm space-y-1">
                <li>📧 contato@harmonia.media</li>
                <li>📱 WhatsApp: (11) 99999-9999</li>
                <li>🕐 Atendimento: Segunda a Sexta, 9h às 18h</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentCancel;
