
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
import PaymentMethodsContainer from "@/components/payment/PaymentMethodsContainer";
import { getPackageDetails, PackageId } from '@/lib/payment/packageData';

const Payment: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [packageDetails, setPackageDetails] = useState<ReturnType<typeof getPackageDetails> | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    // Verificar se o pacote existe
    if (packageId && (packageId === 'essencial' || packageId === 'premium' || packageId === 'profissional')) {
      setPackageDetails(getPackageDetails(packageId as PackageId));
    } else {
      // Pacote não encontrado, redirecionar
      toast({
        title: "Pacote não encontrado",
        description: "O pacote selecionado não está disponível.",
        variant: "destructive"
      });
      navigate('/pacotes');
    }
  }, [packageId, navigate, toast]);

  const handleAcceptTerms = async () => {
    // Simulate API call to record terms acceptance
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setTermsAccepted(true);
    setIsProcessing(false);
    return true;
  };

  const handleSelectPaymentMethod = (method: string, useDiscount: boolean = false) => {
    // Prepare order ID
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    
    // Navigate to payment processing page
    navigate(`/pagamento-processando?packageId=${packageId}&orderId=${orderId}&discount=${useDiscount}&returnUrl=${encodeURIComponent(window.location.origin)}`);
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
            <PaymentMethodsContainer 
              isLoading={isProcessing}
              onSelectMethod={handleSelectPaymentMethod}
              packageId={packageId as PackageId}
              hasAcceptedTerms={termsAccepted}
              onAcceptTerms={handleAcceptTerms}
            />
            
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
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
