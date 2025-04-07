
import React, { useState } from 'react';
import { Copy, CheckCheck } from 'lucide-react';
import { 
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const SharePreviewDialog: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  
  const handleSharePreview = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    
    toast({
      title: "Link copiado!",
      description: "O link para esta prévia musical foi copiado para a área de transferência.",
    });
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Compartilhar prévia</DialogTitle>
        <DialogDescription>
          Compartilhe este link com colaboradores para obter feedback adicional.
        </DialogDescription>
      </DialogHeader>
      <div className="flex items-center space-x-2 mt-4">
        <Input
          readOnly
          value={window.location.href}
          className="flex-1"
        />
        <Button 
          variant="secondary" 
          onClick={handleSharePreview}
          className="flex items-center gap-2"
        >
          {isCopied ? (
            <>
              <CheckCheck className="w-4 h-4" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copiar
            </>
          )}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-4">
        Nota: Este link permanecerá válido por 7 dias ou até a aprovação final.
      </p>
    </DialogContent>
  );
};

export default SharePreviewDialog;
