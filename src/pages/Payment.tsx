
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
import PackageSwitch from '@/components/payment/PackageSwitch';
import PaymentExtras from '@/components/payment/PaymentExtras';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { packageId = 'essencial' } = useParams<{ packageId: string }>();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [qualificationData, setQualificationData] = useState<any>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("payment");
  
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
  
  const handlePackageChange = (newPackageId: PackageId) => {
    navigate(`/pagamento/${newPackageId}`);
  };
  
  const handleExtraToggle = (extraId: string) => {
    setSelectedExtras(prev => 
      prev.includes(extraId) 
        ? prev.filter(id => id !== extraId) 
        : [...prev, extraId]
    );
  };
  
  const {
    isLoading,
    isPaymentSuccess,
    handlePaymentMethod
  } = usePaymentHandler(
    packageId as PackageId,
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
      <main className="flex-1 pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Finalizar Pagamento</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Revise seu pacote, adicione serviços extras se desejar, e escolha seu método de pagamento preferido.
            </p>
          </div>
          
          {isPaymentSuccess ? (
            <PaymentSuccess />
          ) : (
            <>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="package" onClick={() => setActiveTab("package")}>
                    Revisar Pacote
                  </TabsTrigger>
                  <TabsTrigger value="extras" onClick={() => setActiveTab("extras")}>
                    Serviços Extras
                  </TabsTrigger>
                  <TabsTrigger value="payment" onClick={() => setActiveTab("payment")}>
                    Pagamento
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="package">
                  <Card className="p-6">
                    <PackageSwitch 
                      currentPackageId={packageId as PackageId} 
                      onPackageChange={handlePackageChange} 
                    />
                  </Card>
                </TabsContent>
                
                <TabsContent value="extras">
                  <Card className="p-6">
                    <PaymentExtras 
                      packageId={packageId as PackageId}
                      selectedExtras={selectedExtras}
                      onExtraToggle={handleExtraToggle}
                    />
                  </Card>
                </TabsContent>
                
                <TabsContent value="payment">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PaymentMethods 
                      isLoading={isLoading}
                      onSelectMethod={handlePaymentMethod}
                    />
                    
                    <PackageDetails 
                      selectedPackage={selectedPackage}
                      selectedExtras={selectedExtras}
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              {activeTab !== "payment" && (
                <div className="flex justify-end mt-6">
                  <button 
                    onClick={() => setActiveTab(activeTab === "package" ? "extras" : "payment")}
                    className="bg-harmonia-green hover:bg-harmonia-green/90 text-white py-2 px-4 rounded"
                  >
                    {activeTab === "package" ? "Avançar para Extras" : "Avançar para Pagamento"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
