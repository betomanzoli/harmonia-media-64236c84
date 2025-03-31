
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  price, 
  description, 
  features, 
  recommended = false 
}) => {
  return (
    <div className={`
      rounded-lg p-6 border transition-all duration-300
      ${recommended 
        ? 'border-harmonia-green bg-gradient-to-b from-harmonia-green/10 to-transparent shadow-lg' 
        : 'border-border hover:border-harmonia-green/50 bg-card hover:bg-card/80'}
    `}>
      {recommended && (
        <div className="bg-harmonia-green text-black text-xs font-semibold uppercase tracking-wide py-1 px-3 rounded-full inline-block mb-4">
          Mais Popular
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="flex items-baseline mb-4">
        <span className="text-3xl font-bold">{price}</span>
      </div>
      <p className="text-gray-400 mb-6">{description}</p>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="w-5 h-5 text-harmonia-green shrink-0 mt-0.5" />
            <span className="text-sm text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <Button className={`w-full ${recommended ? 'bg-harmonia-green hover:bg-harmonia-green/90' : 'bg-secondary hover:bg-secondary/90'}`}>
        Escolher Pacote
      </Button>
    </div>
  );
};

export default ServiceCard;
