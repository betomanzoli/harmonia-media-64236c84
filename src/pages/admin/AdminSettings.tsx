import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Shield, Bell, User, Lock, Globe, ArrowLeft, Link2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import WebhookUrlManager from '@/components/admin/integrations/WebhookUrlManager';

const AdminSettings: React.FC = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso."
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie as configurações da sua conta e preferências do sistema
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="border-harmonia-green text-harmonia-green hover:bg-harmonia-green/10"
          >
            <Link to="/admin-j28s7d1k/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
        </div>
        
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="bg-harmonia-light-green/20 text-harmonia-green">
            <TabsTrigger 
              value="account" 
              className="data-[state=active]:bg-harmonia-green data-[state=active]:text-white"
            >
              <User className="h-4 w-4 mr-2" />
              Conta
            </TabsTrigger>
            <TabsTrigger 
              value="security"
              className="data-[state=active]:bg-harmonia-green data-[state=active]:text-white"
            >
              <Shield className="h-4 w-4 mr-2" />
              Segurança
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className="data-[state=active]:bg-harmonia-green data-[state=active]:text-white"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger 
              value="password"
              className="data-[state=active]:bg-harmonia-green data-[state=active]:text-white"
            >
              <Lock className="h-4 w-4 mr-2" />
              Senha
            </TabsTrigger>
            <TabsTrigger 
              value="site"
              className="data-[state=active]:bg-harmonia-green data-[state=active]:text-white"
            >
              <Globe className="h-4 w-4 mr-2" />
              Site
            </TabsTrigger>
            <TabsTrigger 
              value="integrations"
              className="data-[state=active]:bg-harmonia-green data-[state=active]:text-white"
            >
              <Link2 className="h-4 w-4 mr-2" />
              Integrações
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-6">
            <Card className="shadow-md border-harmonia-green/20">
              <CardHeader className="bg-gradient-to-r from-harmonia-light-green to-harmonia-green/10">
                <CardTitle className="text-harmonia-green">Informações da Conta</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais e de contato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" defaultValue="Admin Usuario" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="admin@harmonia.media" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Input id="bio" defaultValue="Administrador do sistema harmonIA" />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSave}
                  className="bg-harmonia-green hover:bg-harmonia-green/90"
                >
                  Salvar Alterações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card className="shadow-md border-harmonia-green/20">
              <CardHeader className="bg-gradient-to-r from-harmonia-light-green to-harmonia-green/10">
                <CardTitle className="text-harmonia-green">Segurança</CardTitle>
                <CardDescription>
                  Gerenciar configurações de segurança da conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticação de dois fatores</Label>
                    <p className="text-sm text-muted-foreground">
                      Adiciona uma camada extra de segurança à sua conta
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificar sobre novos logins</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações quando sua conta for acessada de um novo dispositivo
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSave}
                  className="bg-harmonia-green hover:bg-harmonia-green/90"
                >
                  Salvar Alterações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>
                  Configurar quais notificações você deseja receber
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="new-orders" defaultChecked />
                    <Label htmlFor="new-orders">Novos pedidos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="updates" defaultChecked />
                    <Label htmlFor="updates">Atualizações do sistema</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="comments" />
                    <Label htmlFor="comments">Novos comentários</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="marketing" />
                    <Label htmlFor="marketing">Informações de marketing</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Salvar Alterações</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="password" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>
                  Atualize sua senha para manter sua conta segura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Alterar Senha</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="site" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Site</CardTitle>
                <CardDescription>
                  Gerenciar configurações gerais do site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Nome do Site</Label>
                  <Input id="site-name" defaultValue="harmonIA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-description">Descrição</Label>
                  <Input id="site-description" defaultValue="Produções musicais personalizadas" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenance-mode">Modo de Manutenção</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="maintenance-mode" />
                    <Label htmlFor="maintenance-mode">Ativar modo de manutenção</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Salvar Alterações</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WebhookUrlManager 
                title="Webhook Global" 
                description="Configure o webhook global para todas as notificações do sistema"
                serviceType="portfolio"
                storageUrl="https://drive.google.com/drive/folders/1uuhCHv0c5eePU9_m-0BdYiuo0-3vUwVJ"
              />
              
              <Card className="shadow-md border-harmonia-green/20">
                <CardHeader className="bg-gradient-to-r from-harmonia-light-green to-harmonia-green/10">
                  <CardTitle className="text-harmonia-green">Links de Armazenamento</CardTitle>
                  <CardDescription>
                    Gerencie os links para pastas compartilhadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="audio-folder">Banco de Dados de Áudio</Label>
                    <Input 
                      id="audio-folder" 
                      defaultValue="https://drive.google.com/drive/folders/1zOKfHNA7rAihCmEVKZtL191k8XgUsXMg" 
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolio-folder">Portfólio</Label>
                    <Input 
                      id="portfolio-folder" 
                      defaultValue="https://drive.google.com/drive/folders/1MJk2diD6Bmb9Q6lNVDPnLePAznerOU29" 
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="previews-folder">Projetos de Prévias</Label>
                    <Input 
                      id="previews-folder" 
                      defaultValue="https://drive.google.com/drive/folders/1lLw3oBgNhlpUiYbo3wevgUvjA0RTV7tN" 
                      readOnly
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => window.open('https://drive.google.com/', '_blank')}
                    className="bg-harmonia-green hover:bg-harmonia-green/90"
                  >
                    Abrir Google Drive
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
