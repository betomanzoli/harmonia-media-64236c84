
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { Loader2 } from 'lucide-react';

const EmailSettingsCard: React.FC = () => {
  const { settings, isLoading, saveSetting } = useSystemSettings();
  const { toast } = useToast();
  const [adminEmail, setAdminEmail] = useState(settings.admin_email || '');
  const [emailEnabled, setEmailEnabled] = useState(() => {
    // Convert value to boolean safely
    if (settings.email_notifications_enabled === true) return true;
    if (String(settings.email_notifications_enabled) === 'true') return true;
    return false;
  });
  const [isSaving, setIsSaving] = useState(false);

  // Update states when settings load
  useEffect(() => {
    if (settings) {
      setAdminEmail(settings.admin_email || '');
      setEmailEnabled(() => {
        // Convert value to boolean safely
        if (settings.email_notifications_enabled === true) return true;
        if (String(settings.email_notifications_enabled) === 'true') return true;
        return false;
      });
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Save both settings
      const result1 = await saveSetting('admin_email', adminEmail);
      const result2 = await saveSetting('email_notifications_enabled', emailEnabled.toString());
      
      if (result1.success && result2.success) {
        toast({
          title: "Configurações salvas",
          description: "As configurações de email foram atualizadas com sucesso.",
        });
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Ocorreu um problema ao salvar as configurações.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Email</CardTitle>
        <CardDescription>
          Configure as notificações por email e emails administrativos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="email-notifications">Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Ativa o envio de emails automáticos para clientes
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailEnabled}
                onCheckedChange={setEmailEnabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email Administrativo</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@harmonia.media"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Este email receberá cópias de todas as notificações importantes
              </p>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Configurações'
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailSettingsCard;
