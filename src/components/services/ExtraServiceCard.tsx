import React from 'react';
import { Button } from "@/components/ui/button";
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { extraServicePaymentLinks } from '@/lib/payment/paymentLinks';

interface ExtraServiceCardProps {
  title: string;
  price: string | number;
  description: string;
  features: string[];
  icon: LucideIcon;
  onServiceClick: (service: string) => void;
  serviceId: string;
}

const ExtraServiceCard: React.FC<ExtraServiceCardProps> = ({
  title,
  price,
  description,
  features,
  icon: Icon,
  onServiceClick,
  serviceId,
}) => {
  // Get payment link for this service
  const paymentLink = extraServicePaymentLinks[serviceId]?.url;
  
  const handleClick = () => {
    if (paymentLink) {
      // If we have a payment link, open it
      window.open(paymentLink, '_blank');
    } else {
      // Otherwise use the original handler
      onServiceClick(serviceId);
    }
  };
  
  return (
    <div className="bg-card border border-border hover:border-harmonia-green/50 rounded-lg p-6 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Icon className="text-harmonia-green w-5 h-5" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <span className={`font-bold ${typeof price === 'string' && price.includes('Consultar') ? 'text-amber-400' : 'text-harmonia-green'}`}>
          {typeof price === 'number' ? `R$${price}` : price}
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-4">
        {description}
      </p>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="text-sm text-gray-300">{feature}</li>
        ))}
      </ul>
      <Button 
        onClick={handleClick}
        className="w-full bg-secondary hover:bg-secondary/90"
      >
        {price.toString().includes('Consultar') ? 'Solicitar Orçamento Personalizado' : `Adicionar ${title}`}
      </Button>
    </div>
  );
};

export default ExtraServiceCard;
