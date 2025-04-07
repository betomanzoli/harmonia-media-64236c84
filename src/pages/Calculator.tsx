
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from "@/components/ui/use-toast";

// Import our newly created components
import CalculatorHeader from '@/components/calculator/CalculatorHeader';
import PackageSelector from '@/components/calculator/PackageSelector';
import ExtraServices from '@/components/calculator/ExtraServices';
import CouponSection from '@/components/calculator/CouponSection';
import OrderSummary from '@/components/calculator/OrderSummary';
import CalculatorGuide from '@/components/calculator/CalculatorGuide';

const Calculator: React.FC = () => {
  const { toast } = useToast();
  
  // Valores base dos pacotes
  const PACKAGE_PRICES = {
    essential: 219,
    professional: 479,
    premium: 969
  };
  
  // Valores dos extras
  const EXTRA_PRICES = {
    revision: 79,
    bnRegistration: 99,
    ubcRegistration: 249,
    masteringPremium: 149,
    stems: 129,
    expressDelivery: 149,
    musicXml: 149,
    storage: 49,
    humanCompositionLyrics: 499,
    humanCompositionMelody: 1499,
    humanCompositionComplete: 0
  };
  
  const [selectedPackage, setSelectedPackage] = useState('essential');
  const [extras, setExtras] = useState({
    revision: false,
    bnRegistration: false,
    ubcRegistration: false,
    masteringPremium: false,
    stems: false,
    expressDelivery: false,
    musicXml: false,
    storage: false,
    humanCompositionLyrics: false,
    humanCompositionMelody: false,
    humanCompositionComplete: false
  });
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [basePrice, setBasePrice] = useState(PACKAGE_PRICES.essential);
  const [extrasPrice, setExtrasPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(PACKAGE_PRICES.essential);
  
  const isExtraIncluded = (extra: string): boolean => {
    if (extra === 'stems' && selectedPackage !== 'essential') return true;
    if (extra === 'masteringPremium' && selectedPackage === 'premium') return true;
    if (extra === 'bnRegistration' && selectedPackage === 'premium') return true;
    if (extra === 'musicXml' && selectedPackage === 'premium') return true;
    return false;
  };
  
  useEffect(() => {
    const packagePrice = PACKAGE_PRICES[selectedPackage as keyof typeof PACKAGE_PRICES];
    setBasePrice(packagePrice);
    
    let extrasTotal = 0;
    Object.entries(extras).forEach(([key, isSelected]) => {
      if (isSelected && !isExtraIncluded(key)) {
        extrasTotal += EXTRA_PRICES[key as keyof typeof EXTRA_PRICES];
      }
    });
    setExtrasPrice(extrasTotal);
    
    const total = packagePrice + extrasTotal;
    const discountAmount = (total * discount) / 100;
    setFinalPrice(total - discountAmount);
  }, [selectedPackage, extras, discount]);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-32 pb-20 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <CalculatorHeader />
          <CalculatorGuide />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <PackageSelector 
              selectedPackage={selectedPackage}
              setSelectedPackage={setSelectedPackage}
              packagePrices={PACKAGE_PRICES}
            />
            
            <ExtraServices 
              extras={extras}
              setExtras={setExtras}
              extraPrices={EXTRA_PRICES}
              selectedPackage={selectedPackage}
            />
            
            <CouponSection 
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              discount={discount}
              setDiscount={setDiscount}
            />
          </div>
          
          <OrderSummary 
            basePrice={basePrice}
            extrasPrice={extrasPrice}
            finalPrice={finalPrice}
            discount={discount}
            selectedPackage={selectedPackage}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calculator;
