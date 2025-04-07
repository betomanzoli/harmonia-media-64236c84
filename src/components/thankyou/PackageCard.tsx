
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PackageCardProps {
  title: string;
  subtitle: string;
  price: string;
  features: string[];
  isRecommended: boolean;
  isHighlighted: boolean;
  packageType: string;
  packageUrl: string;
}

const PackageCard: React.FC<PackageCardProps> = ({
  title,
  subtitle,
  price,
  features,
  isRecommended,
  isHighlighted,
  packageType,
  packageUrl
}) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className={`p-6 relative overflow-hidden border ${
        isRecommended ? 'border-harmonia-green' : 'border-border'
      } ${isHighlighted ? 'ring-2 ring-harmonia-green/50' : ''}`}
    >
      {isRecommended && (
        <div className="absolute top-0 right-0 bg-harmonia-green text-black text-xs font-bold px-3 py-1">
          Recomendado
        </div>
      )}
      
      <div className="mb-4">
        <Package className="w-8 h-8 text-harmonia-green mb-2" />
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
      
      <div className="text-xl font-bold mb-4">{price}</div>
      
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-harmonia-green mr-2">✓</span>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        className={`w-full ${
          isRecommended 
            ? 'bg-harmonia-green hover:bg-harmonia-green/90' 
            : 'bg-card hover:bg-card/90 border border-border'
        }`}
        onClick={() => navigate(packageUrl)}
      >
        Ver detalhes
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </Card>
  );
};

export default PackageCard;
