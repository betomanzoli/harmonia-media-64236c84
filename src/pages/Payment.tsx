
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check, CreditCard } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ContractTermsDialog from "@/components/payment/ContractTermsDialog";
import { PackageId, packageData } from '@/lib/payment/packageData';
import { packagePaymentLinks } from '@/lib/payment/paymentLinks';
import PaymentMethodsContainer from '@/components/payment/PaymentMethods';
import { usePaymentHandler } from '@/hooks/payment/usePaymentHandler';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { packageId } = useParams<{ packageId?: string }>();
  const { toast } = useToast();
  
  const [selectedPackage, setSelectedPackage] = useState<PackageId>((packageId as PackageId) || 'profissional');
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  
  // Get the selected package details
  const packageDetails = packageData[selectedPackage] || packageData.profissional;
  
  // Use the payment handler hook
  const { 
    isLoading, 
    handlePaymentMethod, 
    hasAcceptedTerms, 
    logContractAcceptance 
  } = usePaymentHandler(selectedPackage, packageDetails, null);
  
  // Effect to set initial package from URL parameter
  useEffect(() => {
    if (packageId && packageData[packageId as PackageId]) {
      setSelectedPackage(packageId as PackageId);
    }
  }, [packageId]);
  
  const handleSelectPackage = (packageId: PackageId) => {
    setSelectedPackage(packageId);
  };

  return (
    <PublicLayout>
      <div className="pt-24 pb-20 px-6 md:px-10">
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
            <div className="md:col-span-1">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Pacote selecionado</p>
                      <p className="font-medium">{packageDetails.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valor</p>
                      <p className="font-medium text-xl">R$ {packageDetails.price},00</p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-bold text-xl">R$ {packageDetails.price},00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Precisa de ajuda?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Se tiver dúvidas sobre os pacotes ou o processo de pagamento, entre em contato conosco:
                  </p>
                  <div className="flex flex-col space-y-2">
                    <a 
                      href="https://wa.me/5511966710347" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-harmonia-green hover:underline"
                    >
                      WhatsApp
                    </a>
                    <a 
                      href="mailto:contato@harmonia.media"
                      className="text-sm text-harmonia-green hover:underline"
                    >
                      contato@harmonia.media
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

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
                          <Label htmlFor={id} className="font-medium text-lg block mb-1">{pkg.name} - R$ {pkg.price},00</Label>
                          <p className="text-sm text-gray-500 mb-2">{pkg.description}</p>
                          <ul className="space-y-1">
                            {pkg.features.slice(0, 4).map((feature, index) => (
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
              
              <PaymentMethodsContainer 
                isLoading={isLoading}
                onSelectMethod={handlePaymentMethod}
                packageId={selectedPackage}
                hasAcceptedTerms={hasAcceptedTerms}
                onAcceptTerms={logContractAcceptance}
              />
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Payment;
