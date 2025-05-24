
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QualificacaoPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-20 px-6 md:px-10">
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Qualificação de Projetos</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Avalie se seu projeto é adequado para nossos serviços de composição musical personalizada
            respondendo algumas perguntas simples.
          </p>
        </div>

        <div className="bg-gradient-to-r from-background to-gray-900 p-8 rounded-lg border border-gray-800 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Avaliação Rápida</h2>
          
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="p-4 border border-gray-800 rounded-lg bg-black/50">
              <h3 className="font-bold mb-3">Qual é o propósito da sua música personalizada?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start hover:bg-harmonia-green/10 hover:text-harmonia-green">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Presente para alguém especial
                </Button>
                <Button variant="outline" className="justify-start hover:bg-harmonia-green/10 hover:text-harmonia-green">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Evento (casamento, aniversário)
                </Button>
                <Button variant="outline" className="justify-start hover:bg-harmonia-green/10 hover:text-harmonia-green">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Projeto pessoal ou hobby
                </Button>
                <Button variant="outline" className="justify-start hover:bg-harmonia-green/10 hover:text-harmonia-green">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Uso comercial ou empresarial
                </Button>
              </div>
            </div>
            
            <div className="p-4 border border-gray-800 rounded-lg bg-black/50">
              <h3 className="font-bold mb-3">Você tem alguma preferência de estilo musical?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button variant="outline" className="justify-start hover:bg-harmonia-green/10 hover:text-harmonia-green">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Pop/Rock
                </Button>
                <Button variant="outline" className="justify-start hover:bg-harmonia-green/10 hover:text-harmonia-green">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Clássico/Orquestrado
                </Button>
                <Button variant="outline" className="justify-start hover:bg-harmonia-green/10 hover:text-harmonia-green">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Jazz/Blues
                </Button>
                <Button variant="outline" className="justify-start hover:bg-harmonia-green/10 hover:text-harmonia-green">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Eletrônico
                </Button>
                <Button variant="outline" className="justify-start hover:bg-harmonia-green/10 hover:text-harmonia-green">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Country/Folk
                </Button>
                <Button variant="outline" className="justify-start hover:bg-harmonia-green/10 hover:text-harmonia-green">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Outros/Não sei ainda
                </Button>
              </div>
            </div>
            
            <div className="p-4 border border-gray-800 rounded-lg bg-black/50">
              <h3 className="font-bold mb-3">Qual é o seu prazo?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start hover:bg-harmonia-green/10 hover:text-harmonia-green">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Menos de 5 dias
                </Button>
                <Button variant="outline" className="justify-start hover:bg-harmonia-green/10 hover:text-harmonia-green">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Entre 5 e 10 dias
                </Button>
                <Button variant="outline" className="justify-start hover:bg-harmonia-green/10 hover:text-harmonia-green">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Entre 10 e 20 dias
                </Button>
                <Button variant="outline" className="justify-start hover:bg-harmonia-green/10 hover:text-harmonia-green">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Flexível/Sem pressa
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => navigate('/calculadora')}
              className="bg-harmonia-green hover:bg-harmonia-green/90"
            >
              Continuar para Calculadora de Preço
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualificacaoPage;
