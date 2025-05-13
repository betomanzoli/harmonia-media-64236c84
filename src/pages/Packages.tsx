
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
    navigate(`/pagamento/${packageId}`);
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
                <CardDescription>Ideal para presentes emocionais rápidos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-6">R$ 219,00</div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Composição musical única</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Uma revisão gratuita</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Uso exclusivamente pessoal</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Entrega digital em até 7 dias</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Suporte por e-mail</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Arquivo digital em alta qualidade (MP3/WAV)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Certificado digital de autoria</span>
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
            
            {/* Pacote Profissional */}
            <Card className="border-2 border-harmonia-green relative transform scale-105 shadow-lg">
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <div className="bg-harmonia-green text-white px-4 py-1 rounded-full text-sm font-medium">
                  MAIS POPULAR
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Pacote Profissional</CardTitle>
                <CardDescription>Perfeito para criadores de conteúdo e pequenos negócios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-6">R$ 479,00</div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Composição musical personalizada</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Até três revisões gratuitas</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Licença para uso em conteúdo digital próprio</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Três versões para escolha</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Entrega em até 5 dias</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Suporte prioritário</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Masterização básica IA</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Stems separados (vocais + instrumentação)</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  className="w-full bg-harmonia-green hover:bg-harmonia-green/90" 
                  onClick={() => handleSelectPackage('profissional')}
                >
                  Selecionar
                </Button>
              </CardFooter>
            </Card>
            
            {/* Pacote Premium */}
            <Card className="border-2 hover:border-harmonia-green/70 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl">Pacote Premium</CardTitle>
                <CardDescription>Melhor opção para empresas e projetos corporativos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-6">R$ 969,00</div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Composição totalmente personalizada</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Revisões ilimitadas (até aprovação)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Cessão total dos direitos autorais</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Cinco versões para escolha</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Registro na Biblioteca Nacional</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Certificado blockchain</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Consultoria de 30 minutos</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Entrega prioritária</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Suporte VIP por WhatsApp</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Partitura em formato MusicXML</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleSelectPackage('premium')}
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
