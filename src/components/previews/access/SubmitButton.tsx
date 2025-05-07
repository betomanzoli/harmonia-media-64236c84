
import React from 'react';
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isLoading: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, onClick }) => {
  return (
    <Button 
      onClick={onClick}
      className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <span className="animate-spin mr-2">⭘</span>
          Verificando...
        </>
      ) : (
        "Acessar Prévia"
      )}
    </Button>
  );
};

export default SubmitButton;
