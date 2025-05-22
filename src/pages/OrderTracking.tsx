
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderDetails from '@/components/order-tracking/OrderDetails';
import OrderNotFound from '@/components/order-tracking/OrderNotFound';
import OrderSearch from '@/components/order-tracking/OrderSearch';
import ChatbotHelper from '@/components/order-tracking/ChatbotHelper';
import OrderNotification from '@/components/order-tracking/OrderNotification';
import { mockOrderData } from '@/components/order-tracking/mockOrderData';
import { OrderData } from '@/components/order-tracking/types';
import { openChatAssistant } from '@/components/order-tracking/ChatbotHelperFunctions';

const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData | undefined>(undefined);

  useEffect(() => {
    if (orderId) {
      // Simulate fetching order data
      const fetchedOrder = mockOrderData.find(o => o.orderId === orderId);
      setOrder(fetchedOrder);
    }
  }, [orderId]);

  const handleSearch = (searchId: string) => {
    navigate(`/order-tracking/${searchId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-harmonia-blue to-harmonia-purple shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative bg-white shadow-lg sm:rounded-3xl p-8">
          <OrderSearch onSearch={handleSearch} />
          {order ? (
            <>
              <OrderDetails order={order} />
              <OrderNotification 
                orderId={order.orderId}
                hasPreview={order.hasPreview}
                previewLink={order.previewLink}
                pendingAction={order.pendingAction || null}
              />
              <ChatbotHelper />
            </>
          ) : orderId ? (
            <OrderNotFound onChatAssistant={openChatAssistant} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
