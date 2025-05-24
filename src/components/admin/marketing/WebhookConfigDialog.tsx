
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface WebhookConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WebhookConfigDialog: React.FC<WebhookConfigDialogProps> = ({ open, onOpenChange }) => {
  const [webhookUrl, setWebhookUrl] = useState('https://example.com/webhook');
  const { toast } = useToast();
  
  const handleSave = () => {
    // In a real app, this would save the webhook URL to a database
    toast({
      title: 'Webhook salvo',
      description: 'A URL do webhook foi salva com sucesso'
    });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar Webhook</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL do Webhook</Label>
            <Input 
              id="webhook-url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://seu-dominio.com/webhook"
            />
            <p className="text-sm text-muted-foreground">
              Cole a URL do seu webhook para receber leads em tempo real
            </p>
          </div>
          
          <div className="p-4 bg-gray-100 rounded-md text-sm">
            <h4 className="font-medium mb-2">Formato do payload</h4>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify({
                name: "Nome do Cliente",
                email: "email@example.com",
                responses: {
                  project_type: "Música para Casamento",
                  music_style: "Pop Romântico"
                },
                source: "landing_page",
                timestamp: "2023-05-15T10:30:00Z"
              }, null, 2)}
            </pre>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              className="bg-harmonia-green hover:bg-harmonia-green/90"
            >
              Salvar Configuração
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WebhookConfigDialog;
