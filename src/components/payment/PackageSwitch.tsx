
import React from 'react';
import { packageData, PackageId } from '@/lib/payment/packageData';
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
      <h2 className="text-xl font-semibold mb-4">Escolha seu Pacote</h2>
      <p className="text-gray-400 mb-6">
        Você pode alterar seu pacote antes de finalizar o pagamento. Compare as opções e escolha a que melhor atende suas necessidades.
      </p>
      
      <RadioGroup value={currentPackageId} onValueChange={handleChange} className="space-y-4">
        {Object.entries(packageData).map(([id, pkg]) => (
          <div 
            key={id}
            className={`relative border rounded-lg p-4 transition-all ${
              currentPackageId === id 
                ? 'border-harmonia-green bg-harmonia-green/10' 
                : 'border-border hover:border-harmonia-green/50'
            }`}
          >
            <RadioGroupItem value={id} id={id} className="absolute top-4 left-4" />
            
            <div className="pl-8">
              <Label htmlFor={id} className="font-medium text-lg">
                {pkg.name} - {pkg.price}
              </Label>
              
              <ul className="mt-3 space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check className="min-w-4 h-4 text-harmonia-green mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default PackageSwitch;
