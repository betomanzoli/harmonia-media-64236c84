
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import PaymentMethods from '@/components/payment/PaymentMethods';
import PackageDetails from '@/components/payment/PackageDetails';
import PaymentSuccess from '@/components/payment/PaymentSuccess';
import { packageData, PackageId } from '@/lib/payment/packageData';
import { usePaymentHandler } from '@/hooks/payment/usePaymentHandler';
import { Card } from "@/components/ui/card";
import PackageSwitch from '@/components/payment/PackageSwitch';
import ContractAcceptanceInfo from '@/components/payment/ContractAcceptanceInfo';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { packageId = 'essencial' } = useParams<{ packageId: string }>();
  const [selectedPackageId, setSelectedPackageId] = useState<PackageId>(packageId as PackageId);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [qualificationData, setQualificationData] = useState<any>(null);
  // We won't allow selection of extras in this version
  const selectedExtras: string[] = [];
  
  // Update the package when the ID changes
  useEffect(() => {
    // Get the package data based on the ID
    const packageInfo = packageData[selectedPackageId] || packageData.essencial;
    setSelectedPackage(packageInfo);
    
    // Retrieve qualification data from localStorage
    const storedData = localStorage.getItem('qualificationData');
    if (storedData) {
      setQualificationData(JSON.parse(storedData));
    }
  }, [selectedPackageId]);
  
  // Handle package change
  const handlePackageChange = (newPackageId: PackageId) => {
    setSelectedPackageId(newPackageId);
    // Update the URL without reloading the page
    navigate(`/pagamento/${newPackageId}`, { replace: true });
  };
  
  const {
    isLoading,
    isPaymentSuccess,
    handlePaymentMethod,
    hasAcceptedTerms,
    logContractAcceptance
  } = usePaymentHandler(
    selectedPackageId,
    selectedPackage,
    qualificationData,
    selectedExtras
  );
  
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
      <main className="flex-1 pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Finalizar Pagamento</h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm">
              Revise seu pacote e prossiga para o pagamento.
            </p>
          </div>
          
          {isPaymentSuccess ? (
            <PaymentSuccess />
          ) : (
            <>
              <Card className="p-4 mb-4">
                <PackageSwitch 
                  currentPackageId={selectedPackageId} 
                  onPackageChange={handlePackageChange} 
                />
              </Card>
              
              <div className="mb-4">
                <ContractAcceptanceInfo hasAcceptedTerms={hasAcceptedTerms} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PaymentMethods 
                  isLoading={isLoading}
                  onSelectMethod={handlePaymentMethod}
                  packageId={selectedPackageId}
                  hasAcceptedTerms={hasAcceptedTerms}
                  onAcceptTerms={logContractAcceptance}
                />
                
                <PackageDetails 
                  selectedPackage={selectedPackage}
                  selectedExtras={selectedExtras}
                />
              </div>
            </>
          )}
          
          <Card className="p-4 mt-4 text-sm">
            <h2 className="text-lg font-semibold mb-2">Informação sobre Serviços</h2>
            <p className="text-gray-500 mb-2">
              A página de calculadora de preço é apenas informativa para serviços extras. 
              Os cupons de desconto para pacotes funcionam normalmente e você pode calcular quanto gastará no total,
              mas lembre-se que cada pagamento será realizado individualmente.
            </p>
            <p className="text-gray-500">
              Após a conclusão do pagamento, você será redirecionado de volta para preencher o briefing
              e iniciar seu projeto musical personalizado.
            </p>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
