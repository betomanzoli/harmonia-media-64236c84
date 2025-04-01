
import React from 'react';
import { Button } from "@/components/ui/button";

interface PremiumStorageProps {
  onStorageClick: (service: string) => void;
}

const PremiumStorage: React.FC<PremiumStorageProps> = ({ onStorageClick }) => {
  return (
    <div className="mt-16 bg-gradient-to-r from-harmonia-green/20 to-transparent border border-harmonia-green/30 rounded-lg p-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Armazenamento Premium</h3>
          <p className="text-gray-300 mb-4">
            Mantenha seus arquivos seguros por mais tempo. Por padrão, os arquivos do projeto ficam disponíveis por até 7 dias após a entrega final. 
            Com o armazenamento premium, você terá acesso aos seus arquivos por até 12 meses.
          </p>
          <p className="text-harmonia-green font-semibold">R$49/ano por projeto</p>
        </div>
        <Button 
          onClick={() => onStorageClick("Armazenamento Premium")}
          className="whitespace-nowrap bg-harmonia-green hover:bg-harmonia-green/90 text-white"
        >
          Adicionar Armazenamento
        </Button>
      </div>
    </div>
  );
};

export default PremiumStorage;
