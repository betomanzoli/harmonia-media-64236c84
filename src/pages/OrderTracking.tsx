
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderSearch from '@/components/order-tracking/OrderSearch';
import OrderDetails from '@/components/order-tracking/OrderDetails';
import OrderNotFound from '@/components/order-tracking/OrderNotFound';
import OrderNotification from '@/components/order-tracking/OrderNotification';
import { openChatAssistant } from '@/components/order-tracking/ChatbotHelper';
import { OrderData } from '@/components/order-tracking/types';

const OrderTracking: React.FC = () => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  
  // Handle search functionality
  const handleSearch = (order: OrderData) => {
    setOrderData(order);
    
    // Show notification for orders with pending feedback
    if (order.pendingAction === 'feedback') {
      setShowNotification(true);
    }
  };
  
  // Reset the order data to start a new search
  const resetSearch = () => {
    setOrderData(null);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Acompanhar Pedido</h1>
          
          {!orderData ? (
            <>
              <OrderSearch onSearch={handleSearch} />
              <OrderNotFound onChatAssistant={openChatAssistant} />
            </>
          ) : (
            <>
              {showNotification && (
                <OrderNotification 
                  orderId={orderData.orderId}
                  previewLink={orderData.previewLink}
                  pendingAction={orderData.pendingAction}
                  onClose={() => setShowNotification(false)}
                />
              )}
              <OrderDetails order={orderData} />
              <div className="mt-8 text-center">
                <button 
                  onClick={resetSearch}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Buscar outro pedido
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTracking;
