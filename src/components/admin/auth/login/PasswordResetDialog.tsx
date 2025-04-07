
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface PasswordResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (email: string) => Promise<void>;
  isLoading: boolean;
}

const PasswordResetDialog: React.FC<PasswordResetDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading
}) => {
  const [resetEmail, setResetEmail] = React.useState('');
  const [resetSent, setResetSent] = React.useState(false);

  const handleSubmit = async () => {
    await onSubmit(resetEmail);
    setResetSent(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state for next time dialog is opened
    setTimeout(() => {
      if (!open) {
        setResetSent(false);
        setResetEmail('');
      }
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Redefinir senha</DialogTitle>
          <DialogDescription>
            Insira seu email para receber instruções de redefinição de senha.
          </DialogDescription>
        </DialogHeader>
        
        {resetSent ? (
          <div className="space-y-4 py-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Email enviado</AlertTitle>
              <AlertDescription>
                Verifique sua caixa de entrada para as instruções de redefinição de senha.
              </AlertDescription>
            </Alert>
            <Button 
              className="w-full" 
              onClick={handleClose}
            >
              Fechar
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PasswordResetDialog;
