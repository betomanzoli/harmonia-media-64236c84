
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PreviewsAdminGuide from '../guides/PreviewsAdminGuide';

interface PreviewsHeaderProps {
  scrollToNewForm: () => void;
}

const PreviewsHeader: React.FC<PreviewsHeaderProps> = ({ scrollToNewForm }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Gerenciar Prévias Musicais</h1>
          <PreviewsAdminGuide />
        </div>
        <p className="text-gray-500 mt-2">Crie e gerencie versões musicais para avaliação dos clientes</p>
      </div>
      <Button 
        className="bg-harmonia-green hover:bg-harmonia-green/90"
        onClick={scrollToNewForm}
      >
        <Plus className="w-4 h-4 mr-2" />
        Novo Projeto
      </Button>
    </div>
  );
};

export default PreviewsHeader;
