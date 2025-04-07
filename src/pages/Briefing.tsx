
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BriefingForm from '@/components/BriefingForm';
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Briefing: React.FC = () => {
  const navigate = useNavigate();
  const [hasPurchased, setHasPurchased] = useState(false);
  const [purchaseData, setPurchaseData] = useState<any>(null);

  useEffect(() => {
    // Check if user has purchased a package
    const paymentData = localStorage.getItem('paymentData');
    if (paymentData) {
      try {
        const data = JSON.parse(paymentData);
        setHasPurchased(true);
        setPurchaseData(data);
      } catch (e) {
        console.error('Error parsing payment data:', e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center gap-1 text-gray-400 hover:text-white"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para a página inicial
            </Button>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Transforme sua história em música</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {hasPurchased 
                ? "Preencha o formulário abaixo para iniciarmos a criação de sua composição musical personalizada."
                : "Este formulário é exclusivo para clientes que já adquiriram um de nossos pacotes."}
            </p>
          </div>

          {!hasPurchased ? (
            <div className="max-w-2xl mx-auto">
              <Alert variant="destructive" className="mb-8">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Acesso restrito</AlertTitle>
                <AlertDescription>
                  Este formulário de briefing detalhado está disponível apenas para clientes que já adquiriram um de nossos pacotes.
                </AlertDescription>
              </Alert>
              
              <div className="text-center space-y-6">
                <p className="text-gray-300">
                  Para acessar este formulário, você precisa primeiro adquirir um de nossos pacotes de música personalizada.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link to="/pacotes" className="w-full">
                    <Button variant="outline" className="w-full">
                      Ver pacotes disponíveis
                    </Button>
                  </Link>
                  
                  <Link to="/qualification" className="w-full">
                    <Button className="w-full bg-harmonia-green hover:bg-harmonia-green/90">
                      Iniciar o processo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-6">
                <Alert className="bg-card border border-border">
                  <CheckCircle2 className="h-4 w-4 text-harmonia-green" />
                  <AlertTitle>Pagamento confirmado</AlertTitle>
                  <AlertDescription>
                    {purchaseData && (
                      <p className="text-sm text-gray-400">
                        Você adquiriu o {purchaseData.packageName} em {new Date(purchaseData.date).toLocaleDateString()}.
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
                
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Como funciona?</h3>
                  <p className="text-gray-400 text-sm">
                    Após o envio do formulário, nossa equipe irá iniciar o processo de composição.
                    Você receberá atualizações por e-mail e poderá acompanhar o progresso do seu projeto.
                  </p>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Exemplos de músicas</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Escute exemplos das músicas que criamos para nossos clientes.
                  </p>
                  <Link to="/portfolio">
                    <Button 
                      variant="outline" 
                      className="w-full"
                    >
                      Ver portfólio
                    </Button>
                  </Link>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Suporte</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Tem alguma dúvida sobre o preenchimento do formulário?
                  </p>
                  <Link to="#" onClick={(e) => {
                    e.preventDefault();
                    window.open('https://wa.me/5511999999999', '_blank');
                  }}>
                    <Button 
                      variant="outline" 
                      className="w-full"
                    >
                      Falar com suporte
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <BriefingForm />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Briefing;
