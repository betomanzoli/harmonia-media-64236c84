
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from 'lucide-react';
import { extraServicesData } from '@/data/extraServices';
import { ScrollArea } from "@/components/ui/scroll-area";

interface PackageDetailsProps {
  selectedPackage: any;
  selectedExtras?: string[];
}

const PackageDetails: React.FC<PackageDetailsProps> = ({ selectedPackage, selectedExtras = [] }) => {
  // Calculate extras total
  const calculateExtrasTotal = (): number => {
    return selectedExtras.reduce((total, extraId) => {
      const extra = extraServicesData.find(e => e.id === extraId);
      if (extra && typeof extra.price === 'number') {
        return total + extra.price;
      }
      return total;
    }, 0);
  };

  const extrasTotal = calculateExtrasTotal();
  const packagePrice = parseInt(selectedPackage.price.replace(/[^0-9]/g, ''));
  const totalPrice = packagePrice + extrasTotal;

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px] pr-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">{selectedPackage.name}</h3>
              <ul className="space-y-1">
                {selectedPackage.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                    <Check className="min-w-4 h-4 text-harmonia-green mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {selectedExtras.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Serviços Extras</h3>
                <ul className="space-y-3">
                  {selectedExtras.map(extraId => {
                    const extra = extraServicesData.find(e => e.id === extraId);
                    if (!extra) return null;
                    
                    return (
                      <li key={extraId} className="flex justify-between text-sm">
                        <span className="text-gray-300">{extra.title}</span>
                        <span className="font-medium">
                          {typeof extra.price === 'number' ? `R$${extra.price},00` : extra.price}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="border-t border-border mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Subtotal (Pacote)</span>
            <span>{selectedPackage.price}</span>
          </div>
          
          {extrasTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal (Extras)</span>
              <span>R${extrasTotal},00</span>
            </div>
          )}
          
          <div className="flex justify-between font-bold pt-2 border-t border-dashed border-border">
            <span>Total</span>
            <span className="text-harmonia-green">R${totalPrice},00</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageDetails;
