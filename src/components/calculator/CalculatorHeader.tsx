
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const CalculatorHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-8 flex items-center gap-4">
      <Button variant="outline" size="sm" onClick={() => navigate('/')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      <h1 className="text-3xl font-bold">Calculadora de Preço</h1>
    </div>
  );
};

export default CalculatorHeader;
