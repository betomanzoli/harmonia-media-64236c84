
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { briefingStorage } from '@/utils/briefingStorage';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [briefingData, setBriefingData] = useState(null);

  const briefingId = searchParams.get('briefing');
  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    if (!briefingId) {
      toast({
        title: "Erro",
        description: "ID do briefing não encontrado.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    // Carregar dados do briefing
    const data = briefingStorage.getBriefingData(briefingId);
    if (!data) {
      toast({
        title: "Dados não encontrados",
        description: "Dados do briefing não encontrados.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    // Atualizar status de pagamento
    briefingStorage.updateBriefingData(briefingId, {
      paymentStatus: 'paid',
      paymentId: paymentId || 'confirmed'
    });

    setBriefingData(data);
    setIsLoading(false);

    // Toast de sucesso
    toast({
      title: "Pagamento confirmado!",
      description: "Seu pagamento foi processado com sucesso. Agora vamos finalizar seu briefing.",
    });
  }, [briefingId, paymentId, navigate, toast]);

  const handleContinue = () => {
    if (!briefingData || !briefingId) return;

    // Redirecionar para a página de briefing detalhado correspondente
    navigate(`/briefing/${briefingData.packageType}?briefing=${briefingId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-harmonia-green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pagamento Confirmado!
            </h1>
            <p className="text-gray-600">
              Seu pagamento foi processado com sucesso
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Próximos Passos</CardTitle>
              <CardDescription>
                Agora vamos finalizar o briefing detalhado do seu projeto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Pagamento Confirmado</h3>
                  <p className="text-sm text-gray-600">
                    Recebemos seu pagamento para o Pacote {briefingData?.packageType?.charAt(0).toUpperCase() + briefingData?.packageType?.slice(1)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-harmonia-green flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Briefing Detalhado</h3>
                  <p className="text-sm text-gray-600">
                    Complete as informações específicas do seu projeto para que possamos criar sua música
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gray-500 text-xs font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Produção Musical</h3>
                  <p className="text-sm text-gray-600">
                    Nossa equipe começará a produzir sua música personalizada
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Pacote:</span>
                  <span className="font-semibold">
                    {briefingData?.packageType?.charAt(0).toUpperCase() + briefingData?.packageType?.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cliente:</span>
                  <span>{briefingData?.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span>{briefingData?.email}</span>
                </div>
                {paymentId && (
                  <div className="flex justify-between">
                    <span>ID do Pagamento:</span>
                    <span className="text-sm font-mono">{paymentId}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button 
              onClick={handleContinue}
              className="bg-harmonia-green hover:bg-harmonia-green/90 px-8"
              size="lg"
            >
              Continuar para Briefing Detalhado
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">
              Você receberá um email de confirmação em breve
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
