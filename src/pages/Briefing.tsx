
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BriefingForm from '@/components/BriefingForm';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Briefing: React.FC = () => {
  const navigate = useNavigate();

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
              Preencha o formulário abaixo e nossa equipe especializada irá criar uma composição musical única baseada na sua história.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Como funciona?</h3>
                <p className="text-gray-400 text-sm">
                  Após o envio do formulário, você receberá um contato em até 24 horas para confirmar detalhes e realizar o pagamento.
                  A produção começa imediatamente após a confirmação.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Exemplos de músicas</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Escute exemplos das músicas que criamos para nossos clientes.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/#portfolio')}
                >
                  Ver portfólio
                </Button>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Pacotes disponíveis</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Conheça nossos pacotes e escolha o que melhor atende suas necessidades.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/#servicos')}
                >
                  Ver pacotes
                </Button>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <BriefingForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Briefing;
