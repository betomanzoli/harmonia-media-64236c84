
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShareIcon, Copy, Check } from 'lucide-react';

interface SharePreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectTitle?: string;
}

const SharePreviewDialog: React.FC<SharePreviewDialogProps> = ({ 
  isOpen, 
  onOpenChange,
  projectId,
  projectTitle = 'Prévia Musical'
}) => {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const previewUrl = `${window.location.origin}/preview/${projectId}`;

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailShare = () => {
    // In a real application, this would send the invitation via email
    console.log(`Sharing link ${previewUrl} with ${email}`);
    setEmailSent(true);
    setTimeout(() => {
      setEmailSent(false);
      setEmail('');
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShareIcon className="h-5 w-5" /> Compartilhar Prévia
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <div>
            <Label htmlFor="preview-link" className="mb-2 block">Link para prévia</Label>
            <div className="flex gap-2">
              <Input
                id="preview-link"
                value={previewUrl}
                readOnly
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleCopyToClipboard}
                title="Copiar link"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="mt-1 text-xs text-green-600">Link copiado para a área de transferência!</p>
            )}
          </div>
          
          <div className="mt-2">
            <Label htmlFor="share-email" className="mb-2 block">Compartilhar por e-mail</Label>
            <div className="flex gap-2">
              <Input
                id="share-email"
                type="email"
                placeholder="cliente@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleEmailShare}
                disabled={!email || emailSent}
              >
                {emailSent ? 'Enviado!' : 'Enviar'}
              </Button>
            </div>
            {emailSent && (
              <p className="mt-1 text-xs text-green-600">Link enviado com sucesso!</p>
            )}
          </div>
        </div>
        
        <DialogFooter className="sm:justify-start">
          <div className="text-sm text-muted-foreground">
            Compartilhe este link para que outras pessoas possam acessar a prévia de
            <span className="font-semibold"> {projectTitle}</span>.
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SharePreviewDialog;
