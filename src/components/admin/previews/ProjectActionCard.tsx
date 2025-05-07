
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Plus, CalendarPlus, Mail, Phone } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import AddVersionForm from './AddVersionForm';

interface ProjectActionCardProps {
  projectId: string;
  onAddVersion: (version: any) => void;
  onExtendDeadline: () => void;
  previewUrl: string;
  clientPhone: string;
  clientEmail: string;
  projectStatus: string;
  packageType: string;
}

const ProjectActionCard: React.FC<ProjectActionCardProps> = ({ 
  projectId, 
  onAddVersion, 
  onExtendDeadline, 
  previewUrl,
  clientPhone,
  clientEmail,
  projectStatus,
  packageType 
}) => {
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const { toast } = useToast();

  const handleAddVersion = (newVersion: any) => {
    onAddVersion(newVersion);
    setShowVersionDialog(false);
  };

  // Função para criar link de WhatsApp
  const generateWhatsAppLink = (phone: string, message: string): string => {
    const cleanPhone = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Função para enviar email
  const sendEmailToClient = (email: string, subject: string): string => {
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Olá,\n\nVisualize sua prévia musical aqui: ' + previewUrl + '\n\nAguardamos seu feedback!\nEquipe Harmonia')}`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Ações do Projeto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="previewUrl">Link de Prévia</Label>
          <div className="flex mt-1">
            <Input 
              id="previewUrl" 
              value={previewUrl} 
              readOnly 
              className="rounded-r-none" 
            />
            <Button 
              className="rounded-l-none" 
              variant="outline" 
              onClick={() => {
                navigator.clipboard.writeText(previewUrl);
                toast({
                  title: "Link copiado",
                  description: "O link de prévia foi copiado para a área de transferência"
                });
              }}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {clientEmail && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Contato por Email</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open(sendEmailToClient(clientEmail, "Sua prévia musical está disponível!"))}
            >
              <Mail className="mr-2 w-4 h-4" />
              Enviar Email
            </Button>
          </div>
        )}

        {clientPhone && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Contato por WhatsApp</p>
            <Button 
              variant="outline" 
              className="w-full bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
              onClick={() => window.open(generateWhatsAppLink(clientPhone, `Olá! Sua prévia musical está disponível em: ${previewUrl}`))}
            >
              <Phone className="mr-2 w-4 h-4" />
              Enviar WhatsApp
            </Button>
          </div>
        )}

        <Separator className="my-3" />
        
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => {
              setShowVersionDialog(true);
            }}
          >
            <Plus className="mr-2 w-4 h-4" />
            Adicionar Versão
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onExtendDeadline}
          >
            <CalendarPlus className="mr-2 w-4 h-4" />
            Estender Prazo
          </Button>
          
          {/* Placeholder for future actions */}
        </div>
      </CardContent>
      
      {showVersionDialog && (
        <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Versão</DialogTitle>
              <DialogDescription>
                Adicione uma nova versão ao projeto.
              </DialogDescription>
            </DialogHeader>
            <AddVersionForm 
              onSubmit={handleAddVersion}
              projectStatus={projectStatus as 'waiting' | 'feedback' | 'approved'}
              projectId={projectId}
            />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default ProjectActionCard;
