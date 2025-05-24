
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check, CreditCard } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ContractTermsDialog from "@/components/payment/ContractTermsDialog";
import { packageData } from '@/lib/payment/packageData';
import { packagePaymentLinks } from '@/lib/payment/paymentLinks';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState('profissional');
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  const handlePaymentClick = () => {
    if (acceptedTerms) {
      proceedToPayment();
    } else {
      setIsTermsDialogOpen(true);
    }
  };

  const handleAcceptTerms = async () => {
    setAcceptedTerms(true);
    setIsTermsDialogOpen(false);
    proceedToPayment();
  };

  const proceedToPayment = () => {
    const paymentLink = packagePaymentLinks[selectedPackage as keyof typeof packagePaymentLinks]?.standard.url;
    if (paymentLink) {
      window.location.href = paymentLink;
    } else {
      toast({
        title: "Erro no pagamento",
        description: "Link de pagamento não encontrado. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  const selectedPackageData = packageData[selectedPackage as keyof typeof packageData];

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
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Escolha seu Pacote</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedPackage} onValueChange={handleSelectPackage}>
                    {Object.entries(packageData).map(([key, pkg]) => (
                      <div key={key} className={`flex items-start space-x-4 p-4 rounded-lg ${selectedPackage === key ? 'bg-muted' : ''}`}>
                        <RadioGroupItem value={key} id={`package-${key}`} />
                        <div className="flex-1">
                          <Label htmlFor={`package-${key}`} className="text-lg font-semibold">
                            {pkg.name} - R$ {pkg.price}
                          </Label>
                          <p className="text-gray-500 mt-1">{pkg.description}</p>
                          <ul className="mt-3 space-y-2">
                            {pkg.features.map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <Check className="h-4 w-4 text-green-500 mr-2" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Método de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-3" />
                      <div>
                        <p className="font-medium">Cartão de Crédito / PIX</p>
                        <p className="text-sm text-gray-500">Processado por Gateway Seguro</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src="/visa.svg" alt="Visa" className="h-6" />
                      <img src="/mastercard.svg" alt="Mastercard" className="h-6" />
                      <img src="/pix.svg" alt="PIX" className="h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Pacote:</span>
                      <span className="font-medium">{selectedPackageData.name}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>R$ {selectedPackageData.price}</span>
                    </div>
                    
                    <hr className="my-4" />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>R$ {selectedPackageData.price}</span>
                    </div>
                    
                    <Button
                      className="w-full mt-4 bg-harmonia-green hover:bg-harmonia-green/90"
                      onClick={handlePaymentClick}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processando..." : "Finalizar Compra"}
                    </Button>
                    
                    <p className="text-xs text-center text-gray-500 mt-4">
                      Ao finalizar a compra, você concorda com nossos{" "}
                      <a href="/termos" className="text-harmonia-green">
                        termos de serviço
                      </a>
                      .
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      <ContractTermsDialog
        open={isTermsDialogOpen}
        onOpenChange={setIsTermsDialogOpen}
        onAccept={handleAcceptTerms}
      />
    </div>
  );
};

export default Payment;
