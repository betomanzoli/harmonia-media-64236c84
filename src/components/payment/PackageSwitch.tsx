
import React from 'react';
import { PackageId, packageData } from '@/lib/payment/packageData';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from 'lucide-react';

interface PackageSwitchProps {
  currentPackageId: PackageId;
  onPackageChange: (packageId: PackageId) => void;
}

const PackageSwitch: React.FC<PackageSwitchProps> = ({ currentPackageId, onPackageChange }) => {
  const handleChange = (value: string) => {
    onPackageChange(value as PackageId);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Escolha seu Pacote</h2>
      <p className="text-gray-400 mb-3 text-sm">
        Você pode alterar seu pacote antes de finalizar o pagamento.
      </p>
      
      <RadioGroup value={currentPackageId} onValueChange={handleChange} className="space-y-3">
        {Object.entries(packageData).map(([id, pkg]) => (
          <div 
            key={id}
            className={`relative border rounded-lg p-3 transition-all ${
              currentPackageId === id 
                ? 'border-harmonia-green bg-harmonia-green/10' 
                : 'border-border hover:border-harmonia-green/50'
            }`}
          >
            <RadioGroupItem value={id} id={id} className="absolute top-3 left-3" />
            
            <div className="pl-7">
              <Label htmlFor={id} className="font-medium">
                {pkg.name} - {pkg.price}
              </Label>
              
              <ul className="mt-2 space-y-1">
                {pkg.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-start gap-1 text-xs text-gray-300">
                    <Check className="min-w-3 h-3 text-harmonia-green mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
                {pkg.features.length > 3 && (
                  <li className="text-xs text-gray-400 pl-4">
                    + {pkg.features.length - 3} outros recursos
                  </li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default PackageSwitch;
