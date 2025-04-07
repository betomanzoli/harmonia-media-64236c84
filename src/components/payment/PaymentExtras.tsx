import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { extraServicesData } from '@/data/extraServices';
import { PackageId } from '@/lib/payment/packageData';

// Map of which extras are compatible with which packages
const packageCompatibility: Record<string, PackageId[]> = {
  "Revisão Extra": ["essencial", "profissional", "premium"],
  "Registro na BN (Letra)": ["essencial", "profissional", "premium"],
  "Registro UBC": ["essencial", "profissional", "premium"],
  "Masterização Premium": ["essencial", "profissional"],
  "Stems Separados": ["essencial"],
  "Entrega Expressa": ["essencial", "profissional", "premium"],
  "Partituras MusicXML/PDF": ["essencial", "profissional"],
  "Composição sem IA (letra)": ["essencial", "profissional", "premium"],
  "Composição sem IA (letra + melodia)": ["essencial", "profissional", "premium"],
  "Composição sem IA (letra + melodia + gravação)": ["essencial", "profissional", "premium"]
};

interface PaymentExtrasProps {
  packageId: PackageId;
  selectedExtras: string[];
  onExtraToggle: (extraId: string) => void;
}

const PaymentExtras: React.FC<PaymentExtrasProps> = ({ 
  packageId, 
  selectedExtras, 
  onExtraToggle 
}) => {
  // Filter extras based on package compatibility
  const compatibleExtras = extraServicesData.filter(extra => {
    // If compatibility isn't specified, show for all packages
    if (!packageCompatibility[extra.id]) return true;
    // Otherwise check if current package is compatible
    return packageCompatibility[extra.id].includes(packageId);
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Serviços Extras Recomendados</h2>
      <p className="text-gray-400 mb-6">
        Personalize sua experiência com estes serviços adicionais compatíveis com o pacote {packageId}.
        Adicione agora e economize tempo e dinheiro.
      </p>
      
      <div className="space-y-4">
        {compatibleExtras.map((extra) => (
          <div 
            key={extra.id}
            className={`border rounded-lg p-4 transition-all ${
              selectedExtras.includes(extra.id) 
                ? 'border-harmonia-green bg-harmonia-green/10' 
                : 'border-border hover:border-border-400'
            }`}
          >
            <div className="flex items-start gap-3">
              <Checkbox 
                id={`extra-${extra.id}`} 
                checked={selectedExtras.includes(extra.id)}
                onCheckedChange={() => onExtraToggle(extra.id)}
                className="mt-1"
              />
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor={`extra-${extra.id}`} className="font-medium">
                    {extra.title}
                  </Label>
                  <span className="font-bold text-harmonia-green">
                    {typeof extra.price === 'number' ? `R$${extra.price},00` : extra.price}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{extra.description}</p>
                
                <ul className="mt-2 space-y-1">
                  {extra.features.map((feature, index) => (
                    <li key={index} className="text-xs text-gray-300">{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
        
        {compatibleExtras.length === 0 && (
          <p className="text-center py-4 text-gray-400">
            Não há serviços extras específicos para esse pacote no momento.
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentExtras;
