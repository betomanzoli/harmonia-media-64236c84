
import React from 'react';
import ExtraServiceCard from './ExtraServiceCard';
import { extraServicesData } from '@/data/extraServices';
import { extraServicePaymentLinks } from '@/lib/payment/paymentLinks';

interface ServiceExtrasGridProps {
  onExtraServiceClick: (service: string) => void;
}

const ServiceExtrasGrid: React.FC<ServiceExtrasGridProps> = ({ onExtraServiceClick }) => {
  const handleServiceClick = (serviceId: string) => {
    // Obter a URL de pagamento do serviceId
    const paymentInfo = extraServicePaymentLinks[serviceId];
    if (paymentInfo && paymentInfo.url) {
      // Abrir URL de pagamento em nova aba
      window.open(paymentInfo.url, '_blank');
    } else {
      // Fallback para o handler do componente pai
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
