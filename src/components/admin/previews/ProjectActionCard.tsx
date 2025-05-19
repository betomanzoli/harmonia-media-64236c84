import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import emailService from '@/services/emailService';

interface ProjectActionCardProps {
  projectId: string;
  onAddVersion: (version: any) => void;
  onExtendDeadline: () => void;
  previewUrl: string;
  clientPhone?: string;
  clientEmail?: string;
  projectStatus?: string;
  packageType?: string;
  clientName: string;
}

const ProjectActionCard: React.FC<ProjectActionCardProps> = ({
  projectId,
  onAddVersion,
  onExtendDeadline,
  previewUrl,
  clientPhone,
  clientEmail,
  projectStatus,
  packageType,
  clientName
}) => {
  const { toast } = useToast();
  const [isAddingVersion, setIsAddingVersion] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [versionDescription, setVersionDescription] = useState('');
  const [versionFileId, setVersionFileId] = useState('');
  const [isRecommended, setIsRecommended] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleAddVersionSubmit = async () => {
    if (!versionName || !versionFileId) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos."
      });
      return;
    }
    
    setIsAddingVersion(true);
    
    try {
      const newVersion = {
        id: `v${Date.now()}`,
        name: versionName,
        description: versionDescription,
        fileId: versionFileId,
        recommended: isRecommended,
        final: isFinal
      };
      
      onAddVersion(newVersion);
      
      setVersionName('');
      setVersionDescription('');
      setVersionFileId('');
      setIsRecommended(false);
      setIsFinal(false);
      
      toast({
        title: "Versão adicionada",
        description: "Nova versão adicionada com sucesso."
      });
    } catch (error) {
      console.error("Erro ao adicionar versão:", error);
      toast({
        title: "Erro ao adicionar versão",
        description: "Não foi possível adicionar a versão. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsAddingVersion(false);
    }
  };

  // Na função ProjectActionCard, adicione o uso do emailService.sendPreviewAccessLink:
  const handleSendEmail = async () => {
    if (!clientEmail) {
      toast({
        title: "Email não disponível",
        description: "Não há email de cliente cadastrado para este projeto."
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // Usar o novo método que envia email personalizado para prévia
      const result = await emailService.sendPreviewAccessLink(
        clientEmail,
        // Extrai o primeiro nome do cliente se disponível, ou usa o nome completo
        clientName.split(' ')[0] || clientName,
        `${window.location.origin}${previewUrl}`,
        packageType || "Música Personalizada"
      );
      
      if (result.success) {
        toast({
          title: "Email enviado",
          description: `Link de prévia enviado para ${clientEmail}`,
        });
      } else {
        throw new Error("Falha ao enviar email");
      }
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      
      toast({
        title: "Erro ao enviar email",
        description: "Não foi possível enviar o email. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="bg-white shadow-md rounded-lg">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-lg font-semibold">Ações do Projeto</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="versionName">Nome da Versão</Label>
          <Input
            id="versionName"
            placeholder="Ex: Versão Acústica"
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="versionDescription">Descrição da Versão</Label>
          <Textarea
            id="versionDescription"
            placeholder="Detalhes sobre a versão"
            value={versionDescription}
            onChange={(e) => setVersionDescription(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="versionFileId">ID do Arquivo (Google Drive)</Label>
          <Input
            id="versionFileId"
            placeholder="ID do arquivo de áudio"
            value={versionFileId}
            onChange={(e) => setVersionFileId(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="isRecommended">Recomendada</Label>
          <Switch
            id="isRecommended"
            checked={isRecommended}
            onCheckedChange={(checked) => setIsRecommended(checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="isFinal">Versão Final</Label>
          <Switch
            id="isFinal"
            checked={isFinal}
            onCheckedChange={(checked) => setIsFinal(checked)}
          />
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleAddVersionSubmit}
          disabled={isAddingVersion}
        >
          {isAddingVersion ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adicionando...
            </>
          ) : (
            "Adicionar Versão"
          )}
        </Button>
        
        <Button variant="secondary" className="w-full" onClick={onExtendDeadline}>
          Estender Prazo +7 dias
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center"
          onClick={handleSendEmail}
          disabled={isSending}
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Enviar Link por Email
            </>
          )}
        </Button>
        
        {clientPhone && (
          <Button variant="ghost" className="w-full flex items-center justify-center">
            <Phone className="mr-2 h-4 w-4" />
            Enviar Link por WhatsApp
          </Button>
        )}
        
        <Button variant="ghost" className="w-full flex items-center justify-center">
          <LinkIcon className="mr-2 h-4 w-4" />
          Copiar Link de Acesso
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectActionCard;
