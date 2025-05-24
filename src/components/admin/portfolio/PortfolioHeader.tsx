
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PortfolioHeaderProps {
  onAdd?: () => void;
}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({ onAdd }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-white">Portfólio</h1>
        <p className="text-gray-300">Gerencie os itens do portfólio que aparecem no site</p>
      </div>
      
      {onAdd && (
        <Button 
          onClick={onAdd}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Item
        </Button>
      )}
    </div>
  );
};

export default PortfolioHeader;
