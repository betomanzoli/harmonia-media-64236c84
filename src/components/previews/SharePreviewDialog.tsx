
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Mail, Share2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface SharePreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName?: string;
}

const SharePreviewDialog: React.FC<SharePreviewDialogProps> = ({
  isOpen,
  onOpenChange,
  projectId,
  projectName = 'Prévia musical'
}) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  
  const previewLink = `${window.location.origin}/preview/${projectId}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(previewLink);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    
    toast({
      title: "Link copiado",
      description: "Link de prévia copiado para a área de transferência."
    });
  };
  
  const handleEmailShare = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email requerido",
        description: "Por favor, insira um email para compartilhar a prévia.",
        variant: "destructive"
      });
      return;
    }
    
    // Ideally this would call an API to send the email
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(`Prévia de música personalizada - ${projectName}`)}&body=${encodeURIComponent(`Olá!\n\nGostaria de compartilhar esta prévia musical com você:\n\n${previewLink}\n\nAtenciosamente,\nHarmonIA`)}`;
    window.open(mailtoLink, '_blank');
    
    toast({
      title: "Link compartilhado",
      description: "O cliente de email foi aberto para compartilhar o link."
    });
  };
  
  const handleWhatsAppShare = () => {
    const whatsappText = `Olá! Gostaria de compartilhar esta prévia musical "${projectName}" com você: ${previewLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(whatsappText)}`, '_blank');
    
    toast({
      title: "Link compartilhado",
      description: "O WhatsApp foi aberto para compartilhar o link."
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar Prévia</DialogTitle>
          <DialogDescription>
            Compartilhe o link desta prévia musical com outras pessoas.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="mt-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Input
                  id="link"
                  value={previewLink}
                  readOnly
                  className="w-full"
                />
              </div>
              <Button type="button" size="sm" onClick={handleCopy} className="px-3">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="mt-4">
            <form onSubmit={handleEmailShare} className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="email" className="text-sm">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Enviar por Email
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="whatsapp" className="mt-4">
            <Button onClick={handleWhatsAppShare} className="w-full bg-green-600 hover:bg-green-700">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar via WhatsApp
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SharePreviewDialog;
