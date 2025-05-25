
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useSystemSettings from '@/hooks/useSystemSettings';

interface WebhookConfigDialogProps {
  children?: React.ReactNode;
}

const WebhookConfigDialog: React.FC<WebhookConfigDialogProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [marketingUrl, setMarketingUrl] = useState('');
  const [notificationsUrl, setNotificationsUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { getSetting, saveSetting } = useSystemSettings();

  useEffect(() => {
    const loadUrls = async () => {
      const marketingSetting = await getSetting('marketing_webhook_url');
      const notificationsSetting = await getSetting('notifications_webhook_url');
      
      // Type-safe access to nested properties
      if (marketingSetting && typeof marketingSetting === 'object' && 'url' in marketingSetting) {
        setMarketingUrl((marketingSetting as { url: string }).url || '');
      }
      
      if (notificationsSetting && typeof notificationsSetting === 'object' && 'url' in notificationsSetting) {
        setNotificationsUrl((notificationsSetting as { url: string }).url || '');
      }
    };

    if (open) {
      loadUrls();
    }
  }, [open, getSetting]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await saveSetting('marketing_webhook_url', { url: marketingUrl });
      await saveSetting('notifications_webhook_url', { url: notificationsUrl });
      
      toast({
        title: "Configurações salvas",
        description: "URLs dos webhooks foram atualizadas com sucesso",
      });
      
      setOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurar Webhooks
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configuração de Webhooks</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="marketing-url">URL do Webhook de Marketing</Label>
            <Input
              id="marketing-url"
              placeholder="https://seu-webhook-marketing.com/endpoint"
              value={marketingUrl}
              onChange={(e) => setMarketingUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notifications-url">URL do Webhook de Notificações</Label>
            <Input
              id="notifications-url"
              placeholder="https://seu-webhook-notificacoes.com/endpoint"
              value={notificationsUrl}
              onChange={(e) => setNotificationsUrl(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WebhookConfigDialog;
