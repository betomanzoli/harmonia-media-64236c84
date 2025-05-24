
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { briefingStorage } from '@/utils/briefingStorage';
import { useToast } from '@/hooks/use-toast';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [briefingData, setBriefingData] = useState(null);

  const briefingId = searchParams.get('briefing');

  useEffect(() => {
    if (!briefingId) {
      navigate('/');
      return;
    }

    // Carregar dados do briefing
    const data = briefingStorage.getBriefingData(briefingId);
    if (data) {
      setBriefingData(data);
    }

    // Toast informativo
    toast({
      title: "Pagamento cancelado",
      description: "Seu pagamento foi cancelado. Você pode tentar novamente quando quiser.",
      variant: "destructive"
    });
  }, [briefingId, navigate, toast]);

  const handleTryAgain = () => {
    if (!briefingData || !briefingId) return;

    // Redirecionar de volta para o pagamento
    navigate(`/pagamento/${briefingData.packageType}?briefing=${briefingId}`);
  };

  const handleBackToBriefing = () => {
    navigate('/briefing');
  };

  const handleContactSupport = () => {
    const whatsappUrl = "https://wa.me/5511920585072?text=Olá!%20Tive%20um%20problema%20com%20meu%20pagamento%20na%20harmonIA.";
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pagamento Cancelado
            </h1>
            <p className="text-gray-600">
              Seu pagamento foi cancelado. Não se preocupe, você pode tentar novamente.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>O que aconteceu?</CardTitle>
              <CardDescription>
                Possíveis motivos para o cancelamento do pagamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p>• Você cancelou o pagamento na página do MercadoPago</p>
                <p>• Houve um problema temporário com o processamento</p>
                <p>• A sessão de pagamento expirou</p>
                <p>• Problema de conectividade durante o processo</p>
              </div>
            </CardContent>
          </Card>

          {briefingData && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Seus dados estão salvos</CardTitle>
                <CardDescription>
                  Não se preocupe, todas as informações do seu briefing foram preservadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Pacote:</span>
                    <span className="font-semibold">
                      {briefingData.packageType?.charAt(0).toUpperCase() + briefingData.packageType?.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cliente:</span>
                    <span>{briefingData.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span>{briefingData.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                onClick={handleTryAgain}
                className="bg-harmonia-green hover:bg-harmonia-green/90"
                disabled={!briefingData}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar Pagamento Novamente
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleBackToBriefing}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Briefing
              </Button>
            </div>

            <div className="text-center">
              <Button 
                variant="link"
                onClick={handleContactSupport}
                className="text-harmonia-green"
              >
                Precisa de ajuda? Fale conosco no WhatsApp
              </Button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Dicas para um pagamento bem-sucedido:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Verifique se seu cartão tem limite disponível</li>
              <li>• Certifique-se de ter uma conexão estável</li>
              <li>• Evite fechar a janela durante o processo</li>
              <li>• Use um navegador atualizado</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentCancel;
