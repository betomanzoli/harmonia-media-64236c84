
import React, { useState } from 'react';
import { Copy, Check, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const SharePreviewDialog: React.FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Get current URL for sharing
  const shareUrl = window.location.href;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        toast({
          title: "Link copiado!",
          description: "O link da prévia foi copiado para a área de transferência.",
        });
        
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        console.error('Erro ao copiar link:', err);
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o link. Tente selecioná-lo manualmente.",
          variant: "destructive"
        });
      });
  };
  
  const handleShareByEmail = () => {
    if (!email) {
      toast({
        title: "Email necessário",
        description: "Por favor, insira um email para compartilhar.",
        variant: "destructive"
      });
      return;
    }
    
    // Simular envio de email
    toast({
      title: "Link compartilhado!",
      description: `Um email com o link da prévia foi enviado para ${email}.`,
    });
    
    setEmail('');
  };
  
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Compartilhar Prévia</DialogTitle>
        <DialogDescription>
          Compartilhe este link para que outras pessoas possam ouvir as prévias da sua música.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6 py-4">
        <div className="flex items-center space-x-2">
          <Input
            value={shareUrl}
            readOnly
            className="flex-1"
          />
          <Button 
            size="sm" 
            onClick={handleCopyLink}
            className={copied ? "bg-green-600" : ""}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Ou envie por email</h3>
          <div className="flex space-x-2">
            <Input
              placeholder="Digite o email do destinatário"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleShareByEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </div>
        </div>
      </div>
      
      <DialogFooter className="sm:justify-start">
        <p className="text-xs text-gray-500">
          Observação: O link permite apenas visualizar as prévias. A pessoa não poderá enviar feedback.
        </p>
      </DialogFooter>
    </DialogContent>
  );
};

export default SharePreviewDialog;
