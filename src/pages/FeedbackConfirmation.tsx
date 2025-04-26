
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, BarChart } from 'lucide-react';

const FeedbackConfirmation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-lg w-full text-center">
          <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Feedback Recebido!</h1>
          
          <p className="text-gray-600 mb-8">
            Obrigado por compartilhar sua opinião sobre a música. Nossa equipe já foi notificada e está trabalhando 
            para garantir que sua música personalizada fique exatamente como você deseja.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="font-medium text-lg mb-3">Próximos Passos</h2>
            <ul className="text-left text-gray-600 space-y-3">
              <li className="flex items-start">
                <div className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-sm font-medium">1</span>
                </div>
                <p>Nossa equipe irá analisar seu feedback e fazer os ajustes necessários.</p>
              </li>
              <li className="flex items-start">
                <div className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-sm font-medium">2</span>
                </div>
                <p>Você receberá um email quando as novas versões estiverem disponíveis.</p>
              </li>
              <li className="flex items-start">
                <div className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-sm font-medium">3</span>
                </div>
                <p>Você poderá avaliar novamente e aprovar quando estiver satisfeito.</p>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/')} variant="outline" className="flex-1">
              <Home className="h-4 w-4 mr-2" />
              Página Inicial
            </Button>
            <Button onClick={() => navigate('/acompanhar-pedido')} className="flex-1 bg-harmonia-green hover:bg-harmonia-green/90">
              <BarChart className="h-4 w-4 mr-2" />
              Acompanhar Pedido
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FeedbackConfirmation;
