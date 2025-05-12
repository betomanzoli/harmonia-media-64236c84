
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Services from '@/components/Services';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Packages: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
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
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Nossos Pacotes</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Escolha o pacote que melhor atende às suas necessidades. Temos opções para todos os tipos de projetos e orçamentos.
            </p>
          </div>

          <Services />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Packages;
