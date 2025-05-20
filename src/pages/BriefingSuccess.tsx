
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Home, MessageSquareText } from 'lucide-react';

const BriefingSuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-harmonia-green/20 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-harmonia-green" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Pagamento Confirmado!</h1>
          
          <p className="text-gray-400 mb-8">
            Obrigado por compartilhar sua visão musical conosco. Nossa equipe começará a trabalhar na sua composição personalizada em breve.
          </p>
          
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-3">Próximos Passos</h3>
              <ol className="space-y-3 text-left">
                <li className="flex items-start">
                  <div className="bg-harmonia-green/20 text-harmonia-green h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</div>
                  <p className="text-gray-300">Em breve, você receberá um email para continuar o processo de briefing mais detalhado.</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-harmonia-green/20 text-harmonia-green h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</div>
                  <p className="text-gray-300">Nosso assistente virtual irá guiá-lo através de perguntas adicionais específicas para o seu pacote.</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-harmonia-green/20 text-harmonia-green h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</div>
                  <p className="text-gray-300">Assim que completar o briefing detalhado, nossa equipe criativa começará o processo de composição.</p>
                </li>
              </ol>
            </div>
            
            <div className="bg-harmonia-green/10 border border-harmonia-green/20 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <MessageSquareText className="text-harmonia-green h-5 w-5 mr-2" />
                <h3 className="font-semibold">Estamos processando suas informações</h3>
              </div>
              <p className="text-gray-300 text-left">
                Com base nas suas respostas iniciais, nosso sistema está preparando a próxima etapa do briefing. 
                Você receberá em breve um convite por email para continuar a conversa e aprofundar os detalhes da sua música personalizada.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/acompanhar-pedido">
                <Button className="w-full sm:w-auto">
                  Acompanhar meu pedido
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
              <Link to="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Home className="mr-2 h-4 w-4" />
                  Voltar à página inicial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BriefingSuccess;
