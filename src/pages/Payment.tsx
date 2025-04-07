
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, QrCode, Info, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mocked package data until we implement real data
const packageData = {
  'standard': {
    name: 'Pacote Padrão',
    price: 'R$ 499,00',
    priceUSD: 'US$ 99.00',
    features: [
      'Composição musical personalizada',
      'Uma revisão gratuita',
      'Entrega em até 7 dias úteis',
      'Licença para uso comercial'
    ]
  },
  'professional': {
    name: 'Pacote Profissional',
    price: 'R$ 899,00',
    priceUSD: 'US$ 179.00',
    features: [
      'Composição musical personalizada premium',
      'Até três revisões gratuitas',
      'Mixagem e masterização profissionais',
      'Entrega em até 5 dias úteis',
      'Licença para uso comercial amplo'
    ]
  },
  'premium': {
    name: 'Pacote Premium',
    price: 'R$ 1499,00',
    priceUSD: 'US$ 299.00',
    features: [
      'Composição musical personalizada de alto nível',
      'Revisões ilimitadas',
      'Mixagem e masterização avançadas',
      'Versões alternativas da música',
      'Entrega expressa em até 3 dias úteis',
      'Licença para uso comercial global'
    ]
  }
};

const Payment: React.FC = () => {
  const { packageId = 'standard' } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [qualificationData, setQualificationData] = useState<any>(null);
  
  useEffect(() => {
    // Get the package data based on the ID
    const packageInfo = packageData[packageId as keyof typeof packageData] || packageData.standard;
    setSelectedPackage(packageInfo);
    
    // Retrieve qualification data from localStorage
    const storedData = localStorage.getItem('qualificationData');
    if (storedData) {
      setQualificationData(JSON.parse(storedData));
    }
  }, [packageId]);
  
  const handlePaymentMethod = (method: string) => {
    setIsLoading(true);
    
    // Simulate payment process
    setTimeout(() => {
      setIsLoading(false);
      
      // Show success toast
      toast({
        title: "Pagamento simulado!",
        description: `Método de pagamento: ${method}. Em um ambiente real, você seria redirecionado para finalizar o pagamento.`,
      });
      
      // After successful "payment", redirect to thank you page
      setTimeout(() => {
        navigate('/agradecimento');
      }, 2000);
    }, 1500);
  };
  
  if (!selectedPackage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-harmonia-green" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Finalizar Pagamento</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Escolha seu método de pagamento preferido para prosseguir com seu projeto musical personalizado.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Opções de Pagamento</CardTitle>
                <CardDescription>
                  Escolha o método que melhor atende às suas necessidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="cartao" className="w-full">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="cartao">Cartão</TabsTrigger>
                    <TabsTrigger value="pix">PIX</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                    <TabsTrigger value="mercadopago">MercadoPago</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="cartao" className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <CreditCard className="w-12 h-12 text-harmonia-green" />
                      </div>
                      <p className="mb-4">Em um ambiente real, aqui seria exibido um formulário seguro para pagamento com cartão de crédito, integrado com Stripe ou outra plataforma.</p>
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        <div className="p-2 bg-white border border-gray-200 rounded">Visa</div>
                        <div className="p-2 bg-white border border-gray-200 rounded">Mastercard</div>
                        <div className="p-2 bg-white border border-gray-200 rounded">Amex</div>
                        <div className="p-2 bg-white border border-gray-200 rounded">Elo</div>
                      </div>
                      <Button 
                        onClick={() => handlePaymentMethod('Cartão de Crédito')}
                        disabled={isLoading}
                        className="bg-harmonia-green hover:bg-harmonia-green/90"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          "Pagar com Cartão"
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pix" className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <QrCode className="w-12 h-12 text-harmonia-green" />
                      </div>
                      <p className="mb-4">Em um ambiente real, aqui seria exibido um QR Code Pix para pagamento instantâneo.</p>
                      <div className="p-4 border border-dashed border-gray-300 bg-white mb-4 mx-auto w-48 h-48 flex items-center justify-center">
                        <span className="text-gray-400">QR Code Pix</span>
                      </div>
                      <Button 
                        onClick={() => handlePaymentMethod('PIX')}
                        disabled={isLoading}
                        className="bg-harmonia-green hover:bg-harmonia-green/90"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          "Confirmar Pagamento Pix"
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="paypal" className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <DollarSign className="w-12 h-12 text-blue-500" />
                      </div>
                      <p className="mb-4">Em um ambiente real, aqui seria exibido o botão de pagamento do PayPal para prosseguir com a transação internacional.</p>
                      <Button 
                        onClick={() => handlePaymentMethod('PayPal')}
                        disabled={isLoading}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          "Pagar com PayPal"
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="mercadopago" className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <DollarSign className="w-12 h-12 text-blue-600" />
                      </div>
                      <p className="mb-4">Em um ambiente real, aqui seria exibido o formulário do MercadoPago para pagamento, incluindo opções de parcelamento.</p>
                      <div className="mb-4 bg-white p-3 rounded border border-gray-200">
                        <p className="text-sm text-gray-500">Parcelamento disponível em até 12x</p>
                      </div>
                      <Button 
                        onClick={() => handlePaymentMethod('MercadoPago')}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          "Pagar com MercadoPago"
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
                <CardDescription>
                  {selectedPackage.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <p className="text-2xl font-bold">{selectedPackage.price}</p>
                    <p className="text-sm text-gray-500">ou {selectedPackage.priceUSD} (internacional)</p>
                  </div>
                  
                  <ul className="space-y-2">
                    {selectedPackage.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-harmonia-green">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex flex-col items-start">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Info className="w-4 h-4 mr-1" />
                  <span>Pagamento 100% seguro</span>
                </div>
                <p className="text-xs text-gray-400">
                  Escolha a opção de pagamento que melhor atende suas necessidades. Todos os métodos são seguros e protegidos.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
