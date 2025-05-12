
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BriefingForm from '@/components/BriefingForm';
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, AlertTriangle, CheckCircle2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Briefing: React.FC = () => {
  const navigate = useNavigate();
  const [hasPurchased, setHasPurchased] = useState(false);
  const [purchaseData, setPurchaseData] = useState<any>(null);
  const [selectedPackage, setSelectedPackage] = useState<'essencial' | 'profissional' | 'premium'>('essencial');

  useEffect(() => {
    // Check if user has purchased a package
    const paymentData = localStorage.getItem('paymentData');
    if (paymentData) {
      try {
        const data = JSON.parse(paymentData);
        setHasPurchased(true);
        setPurchaseData(data);
        
        // Set the selected package based on the purchased package
        if (data.packageId) {
          setSelectedPackage(data.packageId as 'essencial' | 'profissional' | 'premium');
        }
      } catch (e) {
        console.error('Error parsing payment data:', e);
      }
    }
  }, []);

  // Handle package selection change
  const handlePackageChange = (value: string) => {
    setSelectedPackage(value as 'essencial' | 'profissional' | 'premium');
  };

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
                : "Para preencher o briefing, você precisa primeiro adquirir um de nossos pacotes."}
            </p>
          </div>

          {!hasPurchased ? (
            <div className="max-w-2xl mx-auto">
              <Alert variant="destructive" className="mb-8">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Pagamento necessário</AlertTitle>
                <AlertDescription>
                  Para preencher o briefing e iniciar sua composição personalizada, é necessário primeiro realizar o pagamento de um de nossos pacotes.
                </AlertDescription>
              </Alert>
              
              <div className="text-center space-y-6">
                <p className="text-gray-300">
                  Escolha um de nossos pacotes abaixo para prosseguir com o pagamento:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="border border-border hover:border-harmonia-green/50 cursor-pointer transition-colors">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">Pacote Essencial</h3>
                      <p className="text-sm text-gray-500 mb-4">Ideal para presentes emocionais rápidos.</p>
                      <Link to="/pagamento/essencial">
                        <Button className="w-full">Escolher</Button>
                      </Link>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-harmonia-green bg-gradient-to-b from-harmonia-green/10 to-transparent shadow-lg cursor-pointer">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">Pacote Profissional</h3>
                      <p className="text-sm text-gray-500 mb-4">Perfeito para criadores de conteúdo.</p>
                      <Link to="/pagamento/profissional">
                        <Button className="w-full bg-harmonia-green hover:bg-harmonia-green/90">Escolher</Button>
                      </Link>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-border hover:border-harmonia-green/50 cursor-pointer transition-colors">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">Pacote Premium</h3>
                      <p className="text-sm text-gray-500 mb-4">Melhor opção para empresas.</p>
                      <Link to="/pagamento/premium">
                        <Button className="w-full">Escolher</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="pt-4">
                  <Link to="/services">
                    <Button variant="outline">
                      <Package className="w-4 h-4 mr-2" />
                      Ver detalhes dos pacotes
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <Alert className="bg-card border border-border">
                  <CheckCircle2 className="h-4 w-4 text-harmonia-green" />
                  <AlertTitle>Pagamento confirmado</AlertTitle>
                  <AlertDescription>
                    {purchaseData && (
                      <p className="text-sm text-gray-400">
                        Você adquiriu o pacote {purchaseData.packageName} em {new Date(purchaseData.date).toLocaleDateString()}.
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            
              <div className="mb-6">
                {/* Package selection dropdown */}
                <div className="mb-6">
                  <label htmlFor="package-select" className="block text-sm font-medium mb-2">
                    Selecione o pacote para preencher o briefing:
                  </label>
                  <Select value={selectedPackage} onValueChange={handlePackageChange}>
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue placeholder="Selecione um pacote" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="essencial">Pacote Essencial</SelectItem>
                      <SelectItem value="profissional">Pacote Profissional</SelectItem>
                      <SelectItem value="premium">Pacote Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 space-y-6">
                    <Card className="p-6 border border-border">
                      <h3 className="font-semibold mb-2">
                        {selectedPackage === 'essencial' && "Pacote Essencial"}
                        {selectedPackage === 'profissional' && "Pacote Profissional"}
                        {selectedPackage === 'premium' && "Pacote Premium"}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {selectedPackage === 'essencial' && "Ideal para presentes emocionais rápidos. Inclui uma composição única com direito a uma revisão."}
                        {selectedPackage === 'profissional' && "Perfeito para criadores de conteúdo. Inclui três versões para escolha e até três revisões."}
                        {selectedPackage === 'premium' && "Melhor opção para empresas. Inclui registro na Biblioteca Nacional e revisões ilimitadas."}
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate('/services')}
                      >
                        Ver detalhes do pacote
                      </Button>
                    </Card>
                    <SidebarContent />
                  </div>
                  
                  <div className="md:col-span-2">
                    <BriefingForm packageType={selectedPackage} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Helper component for sidebar content
const SidebarContent = () => (
  <>
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
      <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
        <Button 
          variant="outline" 
          className="w-full"
        >
          Falar com suporte
        </Button>
      </a>
    </div>
  </>
);

export default Briefing;
