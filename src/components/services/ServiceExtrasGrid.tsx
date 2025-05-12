
import React from 'react';
import ExtraServiceCard from './ExtraServiceCard';
import { extraServicesData } from '@/data/extraServices';
import { extraServicePaymentLinks } from '@/lib/payment/paymentLinks';

interface ServiceExtrasGridProps {
  onExtraServiceClick: (service: string) => void;
}

const ServiceExtrasGrid: React.FC<ServiceExtrasGridProps> = ({ onExtraServiceClick }) => {
  const handleServiceClick = (serviceId: string) => {
    // Get payment URL from the serviceId
    const paymentInfo = extraServicePaymentLinks[serviceId];
    if (paymentInfo && paymentInfo.url) {
      // Open payment URL in a new tab
      window.open(paymentInfo.url, '_blank');
    } else {
      // Fallback to the parent component handler
      onExtraServiceClick(serviceId);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {extraServicesData.map((service) => (
        <ExtraServiceCard
          key={service.id}
          title={service.title}
          price={service.price}
          description={service.description}
          features={service.features}
          icon={service.icon}
          serviceId={service.id}
          onServiceClick={() => handleServiceClick(service.id)}
        />
      ))}
    </div>
  );
};

export default ServiceExtrasGrid;
