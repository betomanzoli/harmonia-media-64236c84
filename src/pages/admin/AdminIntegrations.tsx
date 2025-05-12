import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CloudOff, Mail, MessageSquare, Download, Upload, Check, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import webhookService from '@/services/webhookService';

const AdminIntegrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState('storage');
  const [isLoadingStorage, setIsLoadingStorage] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isStorageConnected, setIsStorageConnected] = useState(false);
  const [isEmailConnected, setIsEmailConnected] = useState(false);
  const [emailSettings, setEmailSettings] = useState({ 
    smtpServer: '', 
    smtpPort: '', 
    username: '', 
    password: '••••••••',
    fromName: 'harmonIA',
    fromEmail: 'no-reply@harmonia.media'
  });
  const [storageSettings, setStorageSettings] = useState({
    provider: 'google-drive',
    folderId: '',
    accessToken: '••••••••••••••••••••••••••••••',
    refreshToken: '••••••••���•••••••••••••••••••••',
    uploadEnabled: true,
    downloadEnabled: true
  });
  const [webhookUrls, setWebhookUrls] = useState<Record<string, string>>({
    previews: '',
    briefings: '',
    portfolio: ''
  });
  const [whatsappSettings, setWhatsappSettings] = useState({
    enabled: false,
    apiKey: '',
    phoneNumberId: '',
    businessAccountId: ''
  });
  
  useEffect(() => {
    // Simulate loading integrations
    setTimeout(() => {
      setIsStorageConnected(true);
      setIsEmailConnected(true);
      
      // Get existing webhook URLs from storage
      const loadWebhooks = async () => {
        const savedUrl = await webhookService.getWebhookUrl();
        if (savedUrl) {
          setWebhookUrls({
            previews: savedUrl,
            briefings: savedUrl,
            portfolio: savedUrl
          });
        }
      };
      
      loadWebhooks();
    }, 1000);
  }, []);
  
  const connectStorage = () => {
    setIsLoadingStorage(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoadingStorage(false);
      setIsStorageConnected(true);
    }, 2000);
  };
  
  const connectEmail = () => {
    setIsLoadingEmail(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoadingEmail(false);
      setIsEmailConnected(true);
    }, 2000);
  };
  
  const handleEmailSettingChange = (setting: string, value: string) => {
    setEmailSettings(prevSettings => ({
      ...prevSettings,
      [setting]: value
    }));
  };
  
  const handleStorageSettingChange = (setting: string, value: string | boolean) => {
    setStorageSettings(prevSettings => ({
      ...prevSettings,
      [setting]: value
    }));
  };
  
  const saveWebhookUrl = async (serviceType: string, url: string) => {
    setWebhookUrls(prev => ({
      ...prev,
      [serviceType]: url
    }));
    
    // Save to service
    await webhookService.saveWebhookUrl(url);
  };
  
  const handleWhatsappSettingChange = (setting: string, value: any) => {
    setWhatsappSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  const testIntegration = (integrationType: string) => {
    // Implement test functionality
    const testMessage = `Testando integração de ${integrationType}...`;
    console.log(testMessage);
    
    // Show success toast
    setTimeout(() => {
      console.log(`Teste de integração de ${integrationType} concluído com sucesso!`);
    }, 2000);
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Integrações</h1>
          <p className="text-muted-foreground">Gerencie as integrações do sistema com serviços externos</p>
        </div>
        
        <Tabs defaultValue="storage" value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-6">
            <TabsList>
              <TabsTrigger value="storage">
                <Download className="mr-2 h-4 w-4" />
                Armazenamento
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="webhook">
                <ExternalLink className="mr-2 h-4 w-4" />
                Webhooks
              </TabsTrigger>
              <TabsTrigger value="whatsapp">
                <MessageSquare className="mr-2 h-4 w-4" />
                WhatsApp
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="storage" className={activeTab === "storage" ? "" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle>Integração de Armazenamento</CardTitle>
                <CardDescription>Configure a integração com serviços de armazenamento em nuvem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {!isStorageConnected ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-6 flex flex-col items-center justify-center">
                      <CloudOff className="h-12 w-12 text-gray-400 mb-2" />
                      <h3 className="text-lg font-medium mb-2">Sem conexão de armazenamento</h3>
                      <p className="text-center text-gray-500 mb-4 max-w-md">
                        Conecte uma conta de armazenamento em nuvem para gerenciar arquivos de músicas e outros recursos.
                      </p>
                      <Button onClick={connectStorage} disabled={isLoadingStorage}>
                        {isLoadingStorage ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Conectando...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Conectar Google Drive
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2 bg-green-50 text-green-700 border border-green-200 rounded-md p-4">
                        <Check className="h-5 w-5 text-green-500" />
                        <p>Integração com Google Drive está ativa e funcionando.</p>
                      </div>
                      
                      <div className="grid gap-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="provider" className="text-right">
                            Provedor
                          </Label>
                          <div className="col-span-3">
                            <Input id="provider" value={storageSettings.provider} disabled />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="folder-id" className="text-right">
                            ID da pasta
                          </Label>
                          <div className="col-span-3">
                            <Input 
                              id="folder-id" 
                              value={storageSettings.folderId} 
                              onChange={(e) => handleStorageSettingChange('folderId', e.target.value)} 
                              placeholder="ID da pasta raiz no Google Drive"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="access-token" className="text-right">
                            Token de acesso
                          </Label>
                          <div className="col-span-3">
                            <Input 
                              id="access-token" 
                              value={storageSettings.accessToken} 
                              disabled
                              type="password" 
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="upload-enabled" className="text-right">
                            Permitir upload
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="upload-enabled" 
                              checked={storageSettings.uploadEnabled} 
                              onCheckedChange={(checked) => handleStorageSettingChange('uploadEnabled', checked)} 
                            />
                            <Label htmlFor="upload-enabled">
                              {storageSettings.uploadEnabled ? 'Ativado' : 'Desativado'}
                            </Label>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="download-enabled" className="text-right">
                            Permitir download
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="download-enabled" 
                              checked={storageSettings.downloadEnabled} 
                              onCheckedChange={(checked) => handleStorageSettingChange('downloadEnabled', checked)} 
                            />
                            <Label htmlFor="download-enabled">
                              {storageSettings.downloadEnabled ? 'Ativado' : 'Desativado'}
                            </Label>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
              {isStorageConnected && (
                <CardFooter className="justify-between border-t px-6 py-4">
                  <Button variant="outline" onClick={() => testIntegration('armazenamento')}>
                    Testar Conexão
                  </Button>
                  <Button>
                    <Check className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="email" className={activeTab === "email" ? "" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle>Integração de Email</CardTitle>
                <CardDescription>Configure o servidor SMTP para envio de emails</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {!isEmailConnected ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-6 flex flex-col items-center justify-center">
                      <Mail className="h-12 w-12 text-gray-400 mb-2" />
                      <h3 className="text-lg font-medium mb-2">Configuração de email pendente</h3>
                      <p className="text-center text-gray-500 mb-4 max-w-md">
                        Configure um servidor SMTP para permitir que o sistema envie emails aos clientes.
                      </p>
                      <Button onClick={connectEmail} disabled={isLoadingEmail}>
                        {isLoadingEmail ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Conectando...
                          </>
                        ) : (
                          <>
                            <Mail className="mr-2 h-4 w-4" />
                            Configurar Servidor SMTP
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2 bg-green-50 text-green-700 border border-green-200 rounded-md p-4">
                        <Check className="h-5 w-5 text-green-500" />
                        <p>Servidor SMTP configurado e funcional.</p>
                      </div>
                      
                      <div className="grid gap-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="smtp-server" className="text-right">
                            Servidor SMTP
                          </Label>
                          <div className="col-span-3">
                            <Input 
                              id="smtp-server" 
                              value={emailSettings.smtpServer} 
                              onChange={(e) => handleEmailSettingChange('smtpServer', e.target.value)} 
                              placeholder="smtp.example.com"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="smtp-port" className="text-right">
                            Porta SMTP
                          </Label>
                          <div className="col-span-3">
                            <Input 
                              id="smtp-port" 
                              value={emailSettings.smtpPort} 
                              onChange={(e) => handleEmailSettingChange('smtpPort', e.target.value)} 
                              placeholder="587"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-right">
                            Usuário
                          </Label>
                          <div className="col-span-3">
                            <Input 
                              id="username" 
                              value={emailSettings.username} 
                              onChange={(e) => handleEmailSettingChange('username', e.target.value)} 
                              placeholder="user@example.com"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="password" className="text-right">
                            Senha
                          </Label>
                          <div className="col-span-3">
                            <Input 
                              id="password" 
                              type="password" 
                              value={emailSettings.password} 
                              onChange={(e) => handleEmailSettingChange('password', e.target.value)} 
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="from-name" className="text-right">
                            Nome de Exibição
                          </Label>
                          <div className="col-span-3">
                            <Input 
                              id="from-name" 
                              value={emailSettings.fromName} 
                              onChange={(e) => handleEmailSettingChange('fromName', e.target.value)} 
                              placeholder="harmonIA"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="from-email" className="text-right">
                            Email de Origem
                          </Label>
                          <div className="col-span-3">
                            <Input 
                              id="from-email" 
                              value={emailSettings.fromEmail} 
                              onChange={(e) => handleEmailSettingChange('fromEmail', e.target.value)} 
                              placeholder="no-reply@harmonia.media"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
              {isEmailConnected && (
                <CardFooter className="justify-between border-t px-6 py-4">
                  <Button variant="outline" onClick={() => testIntegration('email')}>
                    Enviar Email Teste
                  </Button>
                  <Button>
                    <Check className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="webhook" className={activeTab === "webhook" ? "" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle>Configuração de Webhooks</CardTitle>
                <CardDescription>Configure URLs para receber notificações de eventos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-amber-50 text-amber-800 border border-amber-200 rounded-md p-4 flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <p>Os webhooks permitem que seu serviço seja notificado quando ocorrerem eventos no sistema.</p>
                      <p className="text-sm mt-1">Forneça URLs que possam receber solicitações POST com dados JSON.</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="webhook-previews">Webhook para Prévias</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="webhook-previews" 
                          value={webhookUrls.previews} 
                          onChange={(e) => setWebhookUrls(prev => ({ ...prev, previews: e.target.value }))} 
                          placeholder="https://seu-servidor.com/webhook/previews"
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => saveWebhookUrl('previews', webhookUrls.previews)}
                        >
                          Salvar
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Receba notificações quando prévias forem enviadas ou avaliadas.
                      </p>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="webhook-briefings">Webhook para Briefings</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="webhook-briefings" 
                          value={webhookUrls.briefings} 
                          onChange={(e) => setWebhookUrls(prev => ({ ...prev, briefings: e.target.value }))} 
                          placeholder="https://seu-servidor.com/webhook/briefings"
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => saveWebhookUrl('briefings', webhookUrls.briefings)}
                        >
                          Salvar
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Receba notificações quando novos briefings forem enviados.
                      </p>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="webhook-portfolio">Webhook para Portfólio</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="webhook-portfolio" 
                          value={webhookUrls.portfolio} 
                          onChange={(e) => setWebhookUrls(prev => ({ ...prev, portfolio: e.target.value }))} 
                          placeholder="https://seu-servidor.com/webhook/portfolio"
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => saveWebhookUrl('portfolio', webhookUrls.portfolio)}
                        >
                          Salvar
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Receba notificações quando itens forem adicionados ao portfólio.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between border-t px-6 py-4">
                <Button variant="outline" onClick={() => testIntegration('webhook')}>
                  Testar Webhooks
                </Button>
                <Button>
                  <Check className="mr-2 h-4 w-4" />
                  Salvar Tudo
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="whatsapp" className={activeTab === "whatsapp" ? "" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle>Integração com WhatsApp</CardTitle>
                <CardDescription>Configure a API do WhatsApp Business para mensagens automáticas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="whatsapp-enabled" 
                      checked={whatsappSettings.enabled} 
                      onCheckedChange={(checked) => handleWhatsappSettingChange('enabled', checked)} 
                    />
                    <Label htmlFor="whatsapp-enabled">Ativar integração com WhatsApp</Label>
                  </div>
                  
                  {whatsappSettings.enabled && (
                    <div className="grid gap-4 pt-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="api-key" className="text-right">
                          Chave de API
                        </Label>
                        <div className="col-span-3">
                          <Input 
                            id="api-key" 
                            value={whatsappSettings.apiKey} 
                            onChange={(e) => handleWhatsappSettingChange('apiKey', e.target.value)} 
                            placeholder="Insira sua chave de API do WhatsApp Business"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone-id" className="text-right">
                          ID do Telefone
                        </Label>
                        <div className="col-span-3">
                          <Input 
                            id="phone-id" 
                            value={whatsappSettings.phoneNumberId} 
                            onChange={(e) => handleWhatsappSettingChange('phoneNumberId', e.target.value)} 
                            placeholder="ID do número de telefone"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="business-id" className="text-right">
                          ID da Conta
                        </Label>
                        <div className="col-span-3">
                          <Input 
                            id="business-id" 
                            value={whatsappSettings.businessAccountId} 
                            onChange={(e) => handleWhatsappSettingChange('businessAccountId', e.target.value)} 
                            placeholder="ID da conta business"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              {whatsappSettings.enabled && (
                <CardFooter className="justify-between border-t px-6 py-4">
                  <Button variant="outline" onClick={() => testIntegration('whatsapp')}>
                    Testar Mensagem
                  </Button>
                  <Button>
                    <Check className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminIntegrations;
