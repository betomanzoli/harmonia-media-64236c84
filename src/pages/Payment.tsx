
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import PaymentMethods from '@/components/payment/PaymentMethods';
import PackageDetails from '@/components/payment/PackageDetails';
import PaymentSuccess from '@/components/payment/PaymentSuccess';
import { packageData, PackageId } from '@/lib/payment/packageData';
import { usePaymentHandler } from '@/hooks/payment/usePaymentHandler';

const Payment: React.FC = () => {
  const { packageId = 'essencial' } = useParams<{ packageId: string }>();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [qualificationData, setQualificationData] = useState<any>(null);
  
  useEffect(() => {
    // Get the package data based on the ID
    const packageInfo = packageData[packageId as PackageId] || packageData.essencial;
    setSelectedPackage(packageInfo);
    
    // Retrieve qualification data from localStorage
    const storedData = localStorage.getItem('qualificationData');
    if (storedData) {
      setQualificationData(JSON.parse(storedData));
    }
  }, [packageId]);
  
  const {
    isLoading,
    isPaymentSuccess,
    handlePaymentMethod
  } = usePaymentHandler(
    packageId as PackageId,
    selectedPackage,
    qualificationData
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
      <main className="flex-1 pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Finalizar Pagamento</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Escolha seu método de pagamento preferido para prosseguir com seu projeto musical personalizado.
            </p>
          </div>
          
          {isPaymentSuccess ? (
            <PaymentSuccess />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <PaymentMethods 
                isLoading={isLoading}
                onSelectMethod={handlePaymentMethod}
              />
              
              <PackageDetails selectedPackage={selectedPackage} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
