
import React from 'react';
import ExtraServiceCard from './ExtraServiceCard';
import { extraServicesData } from '@/data/extraServices';
import { extraServicePaymentLinks } from '@/lib/payment/paymentLinks';

interface ServiceExtrasGridProps {
  onExtraServiceClick: (service: string) => void;
}

const ServiceExtrasGrid: React.FC<ServiceExtrasGridProps> = ({ onExtraServiceClick }) => {
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
          onServiceClick={() => onExtraServiceClick(service.id)}
        />
      ))}
    </div>
  );
};

export default ServiceExtrasGrid;
