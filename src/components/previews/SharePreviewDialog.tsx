
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SharePreviewDialogProps {
  open: boolean; // Changed from isOpen to open to match Dialog component expectation
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectTitle: string;
}

const SharePreviewDialog: React.FC<SharePreviewDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  projectTitle
}) => {
  const { toast } = useToast();
  const projectLinkRef = React.useRef<HTMLInputElement>(null);
  
  const shareUrl = `${window.location.origin}/preview/${encodeURIComponent(projectId)}`;
  
  const handleCopyLink = () => {
    if (projectLinkRef.current) {
      projectLinkRef.current.select();
      navigator.clipboard.writeText(projectLinkRef.current.value)
        .then(() => {
          toast({
            title: "Link copiado",
            description: "O link foi copiado para a área de transferência",
          });
        })
        .catch(err => {
          console.error('Error copying link:', err);
          toast({
            title: "Erro ao copiar link",
            description: "Por favor, selecione e copie o link manualmente",
            variant: "destructive"
          });
        });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Prévia: ${projectTitle}`,
          text: `Confira a prévia de "${projectTitle}"`,
          url: shareUrl,
        });
        toast({
          title: "Compartilhado com sucesso",
          description: "Link compartilhado com sucesso",
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
          toast({
            title: "Erro ao compartilhar",
            description: "Não foi possível compartilhar o link",
            variant: "destructive"
          });
        }
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar Prévia</DialogTitle>
          <DialogDescription>
            Compartilhe este link com quem você deseja que acesse esta prévia.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                ref={projectLinkRef}
                readOnly
                value={shareUrl}
                className="select-all"
              />
            </div>
            <Button type="button" size="sm" onClick={handleCopyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              Quem receber este link precisará inserir o email usado no cadastro para acessar a prévia.
            </p>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            className="sm:mt-0 mt-2"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
          {navigator.share && (
            <Button type="button" className="sm:ml-auto" onClick={handleShare}>
              <Share className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SharePreviewDialog;
