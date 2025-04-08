
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderSearch from '@/components/order-tracking/OrderSearch';
import OrderDetails from '@/components/order-tracking/OrderDetails';
import OrderNotification from '@/components/order-tracking/OrderNotification';
import OrderNotFound from '@/components/order-tracking/OrderNotFound';
import { OrderData } from '@/components/order-tracking/types';
import { siteConfig } from '@/config/site';

const OrderTracking: React.FC = () => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    if (orderData) {
      const currentStep = orderData.progress.find((step: any) => step.status === 'current');
      if (currentStep && (currentStep.step === 7 || currentStep.step === 8)) {
        setHasNotification(true);
      }
    }
  }, [orderData]);

  const handleOrderSearch = (foundOrder: OrderData) => {
    setOrderData(foundOrder);
  };

  const handleWhatsAppContact = () => {
    window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=Olá,%20preciso%20de%20ajuda%20para%20localizar%20meu%20pedido`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Acompanhar Pedido</h1>
          <p className="text-gray-400 mb-10">
            Insira o código do seu pedido para verificar seu status e progresso
          </p>
          
          <OrderSearch onSearch={handleOrderSearch} />
          
          {orderData ? (
            <>
              {hasNotification && (
                <OrderNotification 
                  orderId={orderData.orderId}
                  hasPreview={true}
                  previewLink={orderData.previewLink}
                  pendingAction={orderData.currentStep === 7 ? 'feedback' : null}
                />
              )}
              
              <OrderDetails order={orderData} />
            </>
          ) : (
            <OrderNotFound onChatAssistant={handleWhatsAppContact} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTracking;
