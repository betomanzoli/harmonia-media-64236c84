
import React, { useState, useEffect } from 'react';
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
import { PackageId, packageData } from '@/lib/payment/packageData';
import { packagePaymentLinks } from '@/lib/payment/paymentLinks';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedPackage, setSelectedPackage] = useState<PackageId>('express');
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSelectPackage = (packageId: PackageId) => {
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
    const paymentLink = packagePaymentLinks[selectedPackage]?.standard.url;
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
                  <RadioGroup value={selectedPackage} onValueChange={(value) => handleSelectPackage(value as PackageId)} className="space-y-4">
                    {Object.entries(packageData).map(([id, pkg]) => (
                      <div key={id} className={`flex items-start space-x-2 border p-4 rounded-lg ${selectedPackage === id ? 'border-harmonia-green bg-harmonia-green/10' : 'border-gray-200'}`}>
                        <RadioGroupItem value={id} id={id} />
                        <div className="flex-grow">
                          <Label htmlFor={id} className="font-medium text-lg block mb-1">{pkg.name} - {pkg.price}</Label>
                          <p className="text-sm text-gray-500 mb-2">{pkg.description}</p>
                          <ul className="space-y-1">
                            {pkg.features.map((feature, index) => (
                              <li key={index} className="flex items-start text-sm">
                                <Check className="h-4 w-4 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
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
                  <CardTitle>Finalizar Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handlePaymentClick}
                    className="w-full bg-harmonia-green hover:bg-harmonia-green/90 flex items-center justify-center gap-2"
                    disabled={isProcessing}
                  >
                    <CreditCard className="h-4 w-4" />
                    {isProcessing ? "Processando..." : "Pagar agora"}
                  </Button>
                  
                  <p className="text-sm text-gray-500 text-center mt-4">
                    Ao clicar em "Pagar agora", você será redirecionado para o MercadoPago para finalizar sua compra com segurança.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPackage && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">{packageData[selectedPackage].name}</h3>
                        <p className="text-sm text-gray-500">{packageData[selectedPackage].description}</p>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span>{packageData[selectedPackage].price}</span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>{packageData[selectedPackage].price}</span>
                        </div>
                      </div>
                    </div>
                  )}
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
        packageId={selectedPackage}
        accepted={acceptedTerms}
        onAcceptedChange={setAcceptedTerms}
        onConfirm={handleAcceptTerms}
        isLoading={isProcessing}
      />
    </div>
  );
};

export default Payment;
