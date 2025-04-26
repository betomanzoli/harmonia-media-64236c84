
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CreditCard, ListChecks, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ContractTermsDialog from "@/components/payment/ContractTermsDialog";

const Payment: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [packageDetails, setPackageDetails] = useState<{
    id: string;
    name: string;
    price: number;
    description: string;
  } | null>(null);
  
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    // Verificar se o pacote existe
    if (packageId) {
      // Buscar detalhes do pacote com base no ID
      if (packageId === 'essencial') {
        setPackageDetails({
          id: 'essencial',
          name: 'Pacote Essencial',
          price: 499,
          description: 'Composição personalizada básica com 1 versão e ajustes'
        });
      } else if (packageId === 'premium') {
        setPackageDetails({
          id: 'premium',
          name: 'Pacote Premium',
          price: 799,
          description: 'Composição personalizada com até 3 versões e mixagem profissional'
        });
      } else if (packageId === 'profissional') {
        setPackageDetails({
          id: 'profissional',
          name: 'Pacote Profissional',
          price: 1299,
          description: 'Composição personalizada com músicos profissionais e direitos comerciais'
        });
      } else {
        // Pacote não encontrado, redirecionar
        toast({
          title: "Pacote não encontrado",
          description: "O pacote selecionado não está disponível.",
          variant: "destructive"
        });
        navigate('/pacotes');
      }
    }
  }, [packageId, navigate, toast]);

  const handleShowTerms = () => {
    setShowTerms(true);
  };

  const handleContinuePayment = () => {
    if (!termsAccepted) {
      toast({
        title: "Termos não aceitos",
        description: "Você precisa aceitar os termos do contrato para continuar.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulação de processamento de pagamento
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/pagamento-retorno');
    }, 2000);
  };

  if (!packageDetails) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20 px-6 md:px-10 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-harmonia-green"></div>
            <p className="mt-4 text-gray-500">Carregando detalhes do pacote...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center text-gray-500" 
            onClick={() => navigate('/pacotes')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para pacotes
          </Button>
          
          <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Formas de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="card">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="card" className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Cartão de Crédito
                      </TabsTrigger>
                      <TabsTrigger value="pix" className="flex items-center">
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.5 8.5L17.5 19.5M16 6.5L6 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M19.5 6.5L17.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M6.5 19.5L8.5 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        PIX
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="card" className="pt-6">
                      <div className="space-y-4">
                        <Alert className="bg-amber-50 border-amber-200">
                          <AlertCircle className="h-4 w-4 text-amber-700" />
                          <AlertTitle className="text-amber-700">Ambiente de demonstração</AlertTitle>
                          <AlertDescription className="text-amber-700">
                            Este é um ambiente de demonstração. Nenhuma transação real será processada.
                          </AlertDescription>
                        </Alert>
                        
                        <div className="text-center mt-6">
                          <Button onClick={handleShowTerms} className="w-full max-w-md mx-auto">
                            <ListChecks className="h-4 w-4 mr-2" />
                            Ver Contrato e Termos de Serviço
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="pix" className="pt-6">
                      <div className="space-y-4">
                        <Alert className="bg-amber-50 border-amber-200">
                          <AlertCircle className="h-4 w-4 text-amber-700" />
                          <AlertTitle className="text-amber-700">Ambiente de demonstração</AlertTitle>
                          <AlertDescription className="text-amber-700">
                            Este é um ambiente de demonstração. Nenhuma transação real será processada.
                          </AlertDescription>
                        </Alert>
                        
                        <div className="text-center mt-6">
                          <Button onClick={handleShowTerms} className="w-full max-w-md mx-auto">
                            <ListChecks className="h-4 w-4 mr-2" />
                            Ver Contrato e Termos de Serviço
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">{packageDetails.name}</h3>
                      <p className="text-sm text-gray-500">{packageDetails.description}</p>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>R$ {packageDetails.price.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>R$ {packageDetails.price.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleContinuePayment} 
                      disabled={!termsAccepted || isProcessing}
                      className="w-full mt-4 bg-harmonia-green hover:bg-harmonia-green/90"
                    >
                      {isProcessing ? "Processando..." : "Finalizar Pedido"}
                    </Button>
                    
                    {!termsAccepted && (
                      <p className="text-xs text-center text-gray-500 mt-2">
                        Você precisa aceitar os termos do contrato para continuar.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      <ContractTermsDialog 
        open={showTerms}
        onOpenChange={setShowTerms}
        packageId={packageId as any}
        accepted={termsAccepted}
        onAcceptedChange={setTermsAccepted}
        onConfirm={handleContinuePayment}
        isLoading={isProcessing}
      />
    </div>
  );
};

export default Payment;
