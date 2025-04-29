
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, CalendarPlus, MessageSquare, Clock, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddVersionDialog from './AddVersionDialog';
import { VersionItem } from '@/hooks/admin/usePreviewProjects';

interface ProjectActionCardProps {
  projectId: string;
  onAddVersion: (version: VersionItem) => void;
  onExtendDeadline: () => void;
  previewUrl: string;
  clientPhone?: string;
  clientEmail?: string;
}

const ProjectActionCard: React.FC<ProjectActionCardProps> = ({
  projectId,
  onAddVersion,
  onExtendDeadline,
  previewUrl,
  clientPhone = '',
  clientEmail = ''
}) => {
  const { toast } = useToast();
  const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false);
  const [isDeadlineConfirmOpen, setIsDeadlineConfirmOpen] = useState(false);
  
  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/preview/${projectId}`;
    navigator.clipboard.writeText(fullUrl)
      .then(() => {
        toast({
          title: "Link copiado!",
          description: "O link de prévia foi copiado para a área de transferência."
        });
      })
      .catch(err => {
        console.error('Erro ao copiar link:', err);
        toast({
          title: "Erro",
          description: "Não foi possível copiar o link.",
          variant: "destructive"
        });
      });
  };
  
  const handleWhatsApp = () => {
    if (!clientPhone) {
      toast({
        title: "Telefone não disponível",
        description: "Nenhum número de telefone registrado para este cliente.",
        variant: "destructive"
      });
      return;
    }
    
    // Format phone number (remove non-digits)
    const formattedPhone = clientPhone.replace(/\D/g, '');
    
    // Prepare message text
    const message = encodeURIComponent(
      `Olá! Sua prévia musical já está disponível para avaliação. Acesse: ${window.location.origin}/preview/${projectId}`
    );
    
    // Create WhatsApp link
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
  };
  
  const handleEmail = () => {
    if (!clientEmail) {
      toast({
        title: "Email não disponível",
        description: "Nenhum endereço de email registrado para este cliente.",
        variant: "destructive"
      });
      return;
    }
    
    // Prepare email subject and body
    const subject = encodeURIComponent("Sua prévia musical está disponível");
    const body = encodeURIComponent(
      `Olá!\n\nSua prévia musical já está disponível para avaliação.\n\nAcesse: ${window.location.origin}/preview/${projectId}\n\nAguardamos seu feedback!\n\nAtenciosamente,\nEquipe harmonIA`
    );
    
    // Create mailto link
    const mailtoUrl = `mailto:${clientEmail}?subject=${subject}&body=${body}`;
    
    // Open in new tab/email client
    window.location.href = mailtoUrl;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          className="w-full flex justify-start" 
          onClick={() => setIsVersionDialogOpen(true)}
        >
          <Copy className="mr-2 h-4 w-4" />
          Adicionar Nova Versão
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full flex justify-start"
          onClick={() => setIsDeadlineConfirmOpen(true)}
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          Estender Prazo (+7 dias)
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full flex justify-start"
          onClick={handleCopyLink}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copiar Link de Prévia
        </Button>
        
        <div className="pt-2 border-t border-gray-100 mt-4">
          <h3 className="text-sm font-medium mb-2">Contatar Cliente</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              className="flex justify-start"
              onClick={handleWhatsApp}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
            
            <Button 
              variant="outline" 
              className="flex justify-start"
              onClick={handleEmail}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
          </div>
        </div>
      </CardContent>
      
      {/* Add Version Dialog */}
      <AddVersionDialog 
        isOpen={isVersionDialogOpen} 
        onClose={() => setIsVersionDialogOpen(false)}
        onSubmit={(version) => {
          onAddVersion(version);
          setIsVersionDialogOpen(false);
        }}
      />
      
      {/* Extend Deadline Confirmation Dialog */}
      <Dialog open={isDeadlineConfirmOpen} onOpenChange={setIsDeadlineConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Estender Prazo</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja estender o prazo da prévia por mais 7 dias?
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center py-4">
            <Clock className="h-12 w-12 text-amber-500" />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeadlineConfirmOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                onExtendDeadline();
                setIsDeadlineConfirmOpen(false);
              }}
            >
              Confirmar Extensão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProjectActionCard;
