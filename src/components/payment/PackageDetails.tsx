
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface PackageDetailsProps {
  selectedPackage: {
    name: string;
    price: string;
    priceUSD: string;
    features: string[];
  };
}

const PackageDetails: React.FC<PackageDetailsProps> = ({ selectedPackage }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
        <CardDescription>
          {selectedPackage.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="text-2xl font-bold">{selectedPackage.price}</p>
            <p className="text-sm text-gray-500">ou {selectedPackage.priceUSD} (internacional)</p>
          </div>
          
          <ul className="space-y-2">
            {selectedPackage.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-harmonia-green">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex flex-col items-start">
        <p className="text-xs text-gray-400">
          <span className="font-medium">Pagamento seguro</span>: Todas as transações são processadas com criptografia avançada.
        </p>
      </CardFooter>
    </Card>
  );
};

export default PackageDetails;
