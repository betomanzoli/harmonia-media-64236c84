
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePreviewLink } from '@/utils/previewLinkUtils';

interface SharePreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectTitle: string;
}

const SharePreviewDialog: React.FC<SharePreviewDialogProps> = ({
  isOpen,
  onOpenChange,
  projectId,
  projectTitle
}) => {
  const { toast } = useToast();
  const [recipientEmail, setRecipientEmail] = useState('');
  
  // Generate a shareable preview link
  const previewLink = `${window.location.origin}/preview/${projectId}`;
  const encodedLink = `${window.location.origin}/preview/${generatePreviewLink(projectId)}`;
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Link copiado",
        description: "O link foi copiado para a área de transferência."
      });
    });
  };
  
  const handleShareViaEmail = () => {
    // In a real implementation, this would send an email with the link
    // For now, just show a toast notification
    if (!recipientEmail) {
      toast({
        title: "Email necessário",
        description: "Por favor, informe um email para compartilhar.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      toast({
        title: "Email inválido",
        description: "Por favor, informe um email válido.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Link compartilhado",
      description: `O link de prévia foi enviado para ${recipientEmail}.`
    });
    
    // Close dialog
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartilhar Prévia</DialogTitle>
          <DialogDescription>
            Compartilhe esta prévia com outras pessoas que precisam revisá-la.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <div className="text-sm font-medium mb-2">Link de compartilhamento direto</div>
            <div className="flex">
              <Input 
                value={previewLink} 
                readOnly 
                className="flex-1 mr-2"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleCopy(previewLink)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Este link permite acesso direto à prévia do projeto "{projectTitle}".
            </p>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-2">Link codificado (mais seguro)</div>
            <div className="flex">
              <Input 
                value={encodedLink} 
                readOnly 
                className="flex-1 mr-2"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleCopy(encodedLink)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Este é um link codificado que não mostra o ID do projeto diretamente. Este link pode ser compartilhado sem necessidade de autenticação.
            </p>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-2">Compartilhar por email</div>
            <div className="flex">
              <Input
                placeholder="email@exemplo.com"
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="flex-1 mr-2"
              />
              <Button 
                variant="outline"
                onClick={handleShareViaEmail}
              >
                <Share className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SharePreviewDialog;
