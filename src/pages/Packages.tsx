
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Info, AlertCircle } from 'lucide-react';

const Packages: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectPackage = (packageId: string) => {
    navigate(`/pagamento`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Pacotes de Músicas Personalizadas</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Escolha o pacote que melhor se adapta à sua necessidade e transforme sua história em uma música inesquecível.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Pacote Essencial */}
            <Card className="border-2 hover:border-harmonia-green/70 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl">Pacote Essencial</CardTitle>
                <CardDescription>Ideal para ocasiões especiais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-6">R$ 219</div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Composição personalizada</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>1 versão + ajustes</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Entrega em até 10 dias</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Arquivo digital em alta qualidade</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleSelectPackage('essencial')}
                >
                  Selecionar
                </Button>
              </CardFooter>
            </Card>
            
            {/* Pacote Premium */}
            <Card className="border-2 border-harmonia-green relative transform scale-105 shadow-lg">
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <div className="bg-harmonia-green text-white px-4 py-1 rounded-full text-sm font-medium">
                  Mais Popular
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Pacote Premium</CardTitle>
                <CardDescription>Perfeito para momentos especiais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-6">R$ 969</div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Tudo do pacote Essencial</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Até 3 versões da música</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Entrega em até 7 dias</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Mixagem e masterização profissional</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  className="w-full bg-harmonia-green hover:bg-harmonia-green/90" 
                  onClick={() => handleSelectPackage('premium')}
                >
                  Selecionar
                </Button>
              </CardFooter>
            </Card>
            
            {/* Pacote Profissional */}
            <Card className="border-2 hover:border-harmonia-green/70 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl">Pacote Profissional</CardTitle>
                <CardDescription>Para projetos exclusivos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-6">R$ 479</div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Tudo do pacote Premium</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Arranjo com músicos profissionais</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Acompanhamento prioritário</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Direitos comerciais da música</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleSelectPackage('profissional')}
                >
                  Selecionar
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-1" />
              <div>
                <h3 className="font-medium mb-2">Informações importantes</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-orange-500 mr-2 mt-0.5" />
                    <span>Os prazos começam a contar após a aprovação do briefing.</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-orange-500 mr-2 mt-0.5" />
                    <span>Alterações adicionais podem ter custo extra, dependendo da complexidade.</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-orange-500 mr-2 mt-0.5" />
                    <span>Para projetos com necessidades específicas, entre em contato para um orçamento personalizado.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Packages;
