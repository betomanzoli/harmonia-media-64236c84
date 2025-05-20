
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';

interface FormFooterProps {
  isSubmitting: boolean;
  onClose: () => void;
}

const FormFooter: React.FC<FormFooterProps> = ({ isSubmitting, onClose }) => {
  return (
    <DialogFooter className="pt-4">
      <Button variant="outline" onClick={onClose} type="button">
        Cancelar
      </Button>
      <Button 
        type="submit" 
        className="bg-harmonia-green hover:bg-harmonia-green/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando...
          </>
        ) : (
          "Criar Briefing"
        )}
      </Button>
    </DialogFooter>
  );
};

export default FormFooter;
