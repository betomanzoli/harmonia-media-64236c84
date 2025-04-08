
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CreditRefundRequest from '@/components/support/CreditRefundRequest';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreditRefundRequestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-harmonia-green hover:text-harmonia-green/80 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a página inicial
          </Link>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Assistente de Reembolso de Créditos</h1>
            <p className="text-gray-500">
              Use este assistente para gerar uma solicitação de reembolso de créditos devido a problemas técnicos
              com a integração do Supabase ou outras funcionalidades que não puderam ser implementadas corretamente.
            </p>
          </div>
          
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-md flex items-start">
            <HelpCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Como usar este assistente:</p>
              <ol className="list-decimal ml-5 space-y-1">
                <li>Preencha todos os campos do formulário com os detalhes do problema enfrentado</li>
                <li>Certifique-se de incluir um número realista de tentativas e o período em que ocorreram</li>
                <li>Clique em "Copiar solicitação" ou "Baixar" para obter o texto formatado</li>
                <li>Envie o texto para o suporte da Lovable através do canal oficial de suporte</li>
              </ol>
              <p className="mt-2">
                <strong>Nota:</strong> Esta ferramenta apenas gera um texto de solicitação. A aprovação do reembolso depende da análise da equipe de suporte.
              </p>
            </div>
          </div>
          
          <CreditRefundRequest />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreditRefundRequestPage;
