
import React from 'react';
import { Button } from "@/components/ui/button";
import { LucideIcon } from 'lucide-react';

interface ExtraServiceCardProps {
  title: string;
  price: string | number;
  description: string;
  features: string[];
  icon: LucideIcon;
  serviceId: string;
  onServiceClick: () => void;
}

const ExtraServiceCard: React.FC<ExtraServiceCardProps> = ({
  title,
  price,
  description,
  features,
  icon: Icon,
  serviceId,
  onServiceClick,
}) => {
  return (
    <div className="bg-card border border-border hover:border-harmonia-green/50 rounded-lg p-6 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Icon className="text-harmonia-green w-5 h-5" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <div className="flex flex-col items-end">
          <span className={`font-bold ${typeof price === 'string' && price.includes('Consultar') ? 'text-amber-400' : 'text-harmonia-green'}`}>
            {typeof price === 'number' ? `R$${price}` : price}
          </span>
          <span className="text-xs text-amber-400 font-medium">Promocional</span>
        </div>
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
        onClick={onServiceClick}
        className="w-full bg-secondary hover:bg-secondary/90"
      >
        {price.toString().includes('Consultar') ? 'Solicitar Orçamento Personalizado' : `Adicionar ${title}`}
      </Button>
    </div>
  );
};

export default ExtraServiceCard;
