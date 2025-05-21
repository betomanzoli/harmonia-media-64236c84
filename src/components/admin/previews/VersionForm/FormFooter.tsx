
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormFooterProps {
  isLoading: boolean;
  onCancel: () => void;
}

const FormFooter: React.FC<FormFooterProps> = ({ isLoading, onCancel }) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Salvando...' : 'Salvar Versão'}
      </Button>
    </div>
  );
};

export default FormFooter;
