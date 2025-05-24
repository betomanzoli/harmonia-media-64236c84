
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Lock, Mail, BellRing, Cloud, FileText, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminSettings: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [emailSubscription, setEmailSubscription] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);

  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simular salvamento das configurações
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram atualizadas com sucesso."
      });
    }, 1000);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="mr-4"
            >
              <Link to="/admin-j28s7d1k/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Configurações</h1>
          </div>
          <Button 
            onClick={handleSaveSettings}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
        
        <div className="p-6 flex-1 overflow-auto">
          <Tabs defaultValue="general">
            <TabsList className="mb-6">
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
              <TabsTrigger value="storage">Armazenamento</TabsTrigger>
              <TabsTrigger value="contracts">Contratos</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
            </TabsList>
            
            {/* Configurações Gerais */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>Configure as opções básicas do sistema.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informações da Empresa</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Nome da Empresa</Label>
                        <Input id="company-name" defaultValue="HarmonIA" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-email">Email de Contato</Label>
                        <Input id="company-email" defaultValue="contato@harmonia.media" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-phone">Telefone</Label>
                        <Input id="company-phone" defaultValue="(11) 99999-9999" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-website">Website</Label>
                        <Input id="company-website" defaultValue="https://harmonia.media" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Configurações de Sistema</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="maintenance-mode" className="text-base">Modo de Manutenção</Label>
                          <p className="text-sm text-gray-500">Ativa o modo de manutenção no site</p>
                        </div>
                        <Switch 
                          id="maintenance-mode"
                          checked={maintenanceMode}
                          onCheckedChange={setMaintenanceMode}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="debug-mode" className="text-base">Modo de Depuração</Label>
                          <p className="text-sm text-gray-500">Ativa logs detalhados para depuração</p>
                        </div>
                        <Switch 
                          id="debug-mode" 
                          checked={debugMode}
                          onCheckedChange={setDebugMode}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="allow-registration" className="text-base">Permitir Novos Cadastros</Label>
                          <p className="text-sm text-gray-500">Permite que novos clientes se cadastrem no site</p>
                        </div>
                        <Switch 
                          id="allow-registration" 
                          checked={allowRegistration}
                          onCheckedChange={setAllowRegistration}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSaveSettings} disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Configurações de Email */}
            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Configurações de Email
                  </CardTitle>
                  <CardDescription>Configure como os emails são enviados pelo sistema.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-host">Servidor SMTP</Label>
                      <Input id="smtp-host" defaultValue="smtp.example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">Porta</Label>
                      <Input id="smtp-port" defaultValue="587" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-user">Usuário</Label>
                      <Input id="smtp-user" defaultValue="user@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-password">Senha</Label>
                      <Input id="smtp-password" type="password" defaultValue="********" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Configurações de Notificações</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-subscription" className="text-base">Emails Automáticos</Label>
                          <p className="text-sm text-gray-500">Envio de emails automáticos para clientes</p>
                        </div>
                        <Switch 
                          id="email-subscription" 
                          checked={emailSubscription}
                          onCheckedChange={setEmailSubscription}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSaveSettings} disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Configurações de Notificações */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BellRing className="h-5 w-5 mr-2" />
                    Configurações de Notificações
                  </CardTitle>
                  <CardDescription>Configure como as notificações são enviadas.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Canais de Notificação</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="sms-notifications" className="text-base">SMS</Label>
                          <p className="text-sm text-gray-500">Ativar envio de notificações por SMS</p>
                        </div>
                        <Switch 
                          id="sms-notifications" 
                          checked={smsNotifications}
                          onCheckedChange={setSmsNotifications}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="whatsapp-notifications" className="text-base">WhatsApp</Label>
                          <p className="text-sm text-gray-500">Ativar envio de notificações via WhatsApp</p>
                        </div>
                        <Switch 
                          id="whatsapp-notifications" 
                          checked={whatsappNotifications}
                          onCheckedChange={setWhatsappNotifications}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSaveSettings} disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Configurações de Armazenamento */}
            <TabsContent value="storage">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Cloud className="h-5 w-5 mr-2" />
                    Armazenamento
                  </CardTitle>
                  <CardDescription>Configure o armazenamento de arquivos.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Configurações de armazenamento em desenvolvimento. Em breve estará disponível.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Configurações de Contratos */}
            <TabsContent value="contracts">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Contratos
                  </CardTitle>
                  <CardDescription>Configure os modelos de contrato.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Editor de modelos de contrato em desenvolvimento. Em breve estará disponível.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Configurações de Segurança */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Segurança
                  </CardTitle>
                  <CardDescription>Configure as opções de segurança.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Configurações de segurança em desenvolvimento. Em breve estará disponível.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
