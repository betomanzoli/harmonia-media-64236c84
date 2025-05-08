
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, Mail, Share2, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SharePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewUrl: string;
  clientEmail?: string;
}

const SharePreviewDialog: React.FC<SharePreviewDialogProps> = ({
  open,
  onOpenChange,
  previewUrl,
  clientEmail = ''
}) => {
  const [recipientEmail, setRecipientEmail] = useState(clientEmail || '');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(previewUrl);
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para a área de transferência."
    });
  };
  
  const handleSendEmail = async () => {
    try {
      setIsLoading(true);
      
      // In a real implementation, this would call an API to send the email
      setTimeout(() => {
        toast({
          title: "Email enviado!",
          description: `Preview enviada para ${recipientEmail}`
        });
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Erro ao enviar email",
        description: "Não foi possível enviar o email. Tente copiar o link manualmente.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Compartilhar Prévia</DialogTitle>
          <DialogDescription>
            Compartilhe o link de prévia diretamente ou envie por email.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="preview-link">Link da Prévia</Label>
            <div className="flex mt-1.5">
              <Input 
                id="preview-link" 
                value={previewUrl} 
                readOnly 
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon" 
                className="ml-2" 
                onClick={handleCopyLink}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
              <Mail className="h-4 w-4 mr-1.5" />
              Enviar por Email
            </h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="recipient">Email do Destinatário</Label>
                <Input 
                  id="recipient"
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="cliente@exemplo.com"
                />
              </div>
              
              <Button 
                onClick={handleSendEmail} 
                disabled={isLoading || !recipientEmail}
                className="w-full"
              >
                {isLoading ? "Enviando..." : "Enviar Email"}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SharePreviewDialog;
