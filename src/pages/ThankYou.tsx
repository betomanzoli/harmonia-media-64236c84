
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Music, Calendar, MessageSquare } from 'lucide-react';

const ThankYou: React.FC = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('orderData');
    if (data) {
      setOrderData(JSON.parse(data));
    } else {
      // Redirecionar para a página inicial se não houver dados de pedido
      setTimeout(() => navigate('/'), 3000);
    }
  }, [navigate]);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Redirecionando para a página inicial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-harmonia-green/20 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-harmonia-green" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Agradecemos por confiar em nós!</h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Seu briefing foi enviado com sucesso. Nossa equipe está ansiosa para transformar sua visão em uma experiência musical única.
            </p>
          </div>

          <Card className="p-8 border border-border mb-8">
            <h2 className="text-xl font-semibold mb-4">Detalhes do seu pedido</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-400">Número do pedido</p>
                <p className="font-medium">{orderData.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Pacote</p>
                <p className="font-medium">{orderData.packageType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Data de envio</p>
                <p className="font-medium">{new Date(orderData.dateSubmitted).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <p className="font-medium">{orderData.status}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Próximos passos:</h3>
              <div className="border border-border p-4 rounded-md flex items-start gap-3">
                <div className="bg-harmonia-green/20 p-2 rounded-full">
                  <Music className="w-4 h-4 text-harmonia-green" />
                </div>
                <div>
                  <p className="font-medium">Análise inicial</p>
                  <p className="text-sm text-gray-400">Nossa equipe está analisando seu briefing e iniciará o processo criativo em breve.</p>
                </div>
              </div>

              <div className="border border-border p-4 rounded-md flex items-start gap-3">
                <div className="bg-harmonia-green/20 p-2 rounded-full">
                  <Calendar className="w-4 h-4 text-harmonia-green" />
                </div>
                <div>
                  <p className="font-medium">Acompanhamento</p>
                  <p className="text-sm text-gray-400">Você receberá atualizações por e-mail e poderá acompanhar o status do seu projeto a qualquer momento.</p>
                </div>
              </div>

              <div className="border border-border p-4 rounded-md flex items-start gap-3">
                <div className="bg-harmonia-green/20 p-2 rounded-full">
                  <MessageSquare className="w-4 h-4 text-harmonia-green" />
                </div>
                <div>
                  <p className="font-medium">Suporte</p>
                  <p className="text-sm text-gray-400">Se tiver dúvidas ou precisar adicionar mais informações ao seu briefing, nossa equipe de suporte está à disposição.</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/acompanhar-pedido" className="w-full">
              <Button className="w-full bg-harmonia-green hover:bg-harmonia-green/90 flex items-center justify-center gap-2">
                Acompanhar meu pedido
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            
            <Link to="/" className="w-full">
              <Button variant="outline" className="w-full">
                Voltar para a página inicial
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThankYou;
