
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { QualificationData } from '@/types/qualification';
import { getRecommendedPackage } from '@/utils/packageRecommendation';
import PackageRecommendations from '@/components/thankyou/PackageRecommendations';

const ThankYou: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<QualificationData | null>(null);
  const [recommendedPackage, setRecommendedPackage] = useState<'essencial' | 'profissional' | 'premium'>('essencial');
  const [isPurchased, setIsPurchased] = useState(false);
  
  useEffect(() => {
    // Verificar se há dados de pagamento confirmado
    const paymentData = localStorage.getItem('paymentData');
    if (paymentData) {
      setIsPurchased(true);
    }
    
    // Retrieve form data from localStorage
    const savedData = localStorage.getItem('qualificationData');
    if (savedData) {
      const parsedData = JSON.parse(savedData) as QualificationData;
      setUserData(parsedData);
      setRecommendedPackage(getRecommendedPackage(parsedData));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-harmonia-green/20 mb-6">
            <CheckCircle2 className="w-8 h-8 text-harmonia-green" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Obrigado, {userData?.name?.split(' ')[0] || 'amigo(a)'}!</h1>
          <p className="text-xl text-gray-300 mb-2">Recebemos sua solicitação com sucesso.</p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {isPurchased ? 
              "Seu pagamento foi confirmado e estamos preparando tudo para você. Confira abaixo os próximos passos." :
              "Nossa equipe entrará em contato com você em breve para discutir os próximos passos. Enquanto isso, confira abaixo nossa recomendação personalizada para você."
            }
          </p>
        </div>
        
        {isPurchased ? (
          <div className="space-y-8 max-w-2xl mx-auto">
            <Alert className="bg-harmonia-green/10 border-harmonia-green/30">
              <CheckCircle2 className="h-5 w-5 text-harmonia-green" />
              <AlertTitle className="text-harmonia-green">Pedido Confirmado</AlertTitle>
              <AlertDescription>
                Seu pagamento foi processado com sucesso. O comprovante foi enviado para seu e-mail.
              </AlertDescription>
            </Alert>
            
            <Card className="p-6 border-harmonia-green/20">
              <h2 className="text-xl font-bold mb-4">Próximos Passos</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-harmonia-green/10 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-harmonia-green font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Preencher o Briefing</h3>
                    <p className="text-gray-400 text-sm">
                      Agora você pode preencher o briefing detalhado para sua música personalizada.
                      Quanto mais detalhes você fornecer, melhor será o resultado.
                    </p>
                    <Button 
                      className="mt-2 bg-harmonia-green hover:bg-harmonia-green/90"
                      onClick={() => navigate('/briefing')}
                    >
                      Preencher Briefing Agora
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-gray-600 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-300 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Acompanhar o Processo</h3>
                    <p className="text-gray-400 text-sm">
                      Após o preenchimento do briefing, você poderá acompanhar o progresso da criação
                      da sua música através da nossa página de acompanhamento de pedidos.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-gray-600 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-300 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Avaliar as Prévias</h3>
                    <p className="text-gray-400 text-sm">
                      Assim que tivermos as primeiras versões, você receberá um link para ouvir e avaliar
                      as prévias da sua música, podendo solicitar ajustes conforme seu pacote.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-gray-600 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-300 font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Receber a Versão Final</h3>
                    <p className="text-gray-400 text-sm">
                      Após a aprovação das prévias, você receberá a versão final da sua música em alta qualidade,
                      pronta para uso conforme os termos do seu pacote.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Alert className="bg-amber-500/10 border-amber-500/30">
              <Info className="h-5 w-5 text-amber-500" />
              <AlertTitle className="text-amber-500">Nota Fiscal</AlertTitle>
              <AlertDescription>
                A nota fiscal referente ao seu pedido será emitida em até 3 dias úteis e enviada para o email cadastrado.
              </AlertDescription>
            </Alert>
            
            <div className="text-center">
              <p className="text-gray-400 mb-4">
                Dúvidas sobre seu pedido ou processo de criação?
              </p>
              <Button 
                variant="outline"
                onClick={() => window.open(`https://wa.me/${siteConfig.contact.whatsapp}`, '_blank')}
              >
                Falar com um consultor
              </Button>
            </div>
          </div>
        ) : (
          <>
            <PackageRecommendations 
              userData={userData} 
              recommendedPackage={recommendedPackage} 
            />
            
            <div className="text-center">
              <p className="text-gray-400 mb-6">
                Quer conhecer mais sobre nossos pacotes e como podemos atender sua necessidade específica?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(siteConfig.urls.packages)}
                >
                  Ver todos os pacotes
                </Button>
                <Button 
                  className="bg-harmonia-green hover:bg-harmonia-green/90"
                  onClick={() => navigate(`/pagamento/${recommendedPackage}`)}
                >
                  Prosseguir para pagamento
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ThankYou;
