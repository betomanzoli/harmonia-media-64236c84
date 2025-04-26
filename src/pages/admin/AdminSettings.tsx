
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
                        <Switch id="maintenance-mode" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="debug-mode" className="text-base">Modo de Depuração</Label>
                          <p className="text-sm text-gray-500">Ativa logs detalhados para depuração</p>
                        </div>
                        <Switch id="debug-mode" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="allow-registration" className="text-base">Permitir Novos Cadastros</Label>
                          <p className="text-sm text-gray-500">Permite que novos clientes se cadastrem no site</p>
                        </div>
                        <Switch id="allow-registration" defaultChecked />
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
                    <h3 className="text-lg font-medium">Modelos de Email</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Email de Boas-vindas</Label>
                          <p className="text-sm text-gray-500">Enviado quando um cliente se cadastra</p>
                        </div>
                        <Button variant="outline" size="sm">Editar</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Notificação de Prévia</Label>
                          <p className="text-sm text-gray-500">Enviado quando uma nova prévia é disponibilizada</p>
                        </div>
                        <Button variant="outline" size="sm">Editar</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Confirmação de Pagamento</Label>
                          <p className="text-sm text-gray-500">Enviado após confirmação de pagamento</p>
                        </div>
                        <Button variant="outline" size="sm">Editar</Button>
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
            
            {/* Outras abas (conteúdo simplificado para este exemplo) */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BellRing className="h-5 w-5 mr-2" />
                    Configurações de Notificações
                  </CardTitle>
                  <CardDescription>Gerenciar notificações do sistema.</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Conteúdo aqui */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notify-new-order" className="text-base">Novos Pedidos</Label>
                        <p className="text-sm text-gray-500">Notificar quando um novo pedido for realizado</p>
                      </div>
                      <Switch id="notify-new-order" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notify-feedback" className="text-base">Feedback de Clientes</Label>
                        <p className="text-sm text-gray-500">Notificar quando um cliente enviar feedback</p>
                      </div>
                      <Switch id="notify-feedback" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notify-payment" className="text-base">Pagamentos</Label>
                        <p className="text-sm text-gray-500">Notificar sobre novos pagamentos</p>
                      </div>
                      <Switch id="notify-payment" defaultChecked />
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
            
            <TabsContent value="storage">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Cloud className="h-5 w-5 mr-2" />
                    Configurações de Armazenamento
                  </CardTitle>
                  <CardDescription>Gerenciar o armazenamento de arquivos.</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Conteúdo simplificado */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="google-api-key">Google Drive API Key</Label>
                      <Input id="google-api-key" defaultValue="***********************" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="default-folder">Pasta Padrão</Label>
                      <Input id="default-folder" defaultValue="HarmonIA/Projetos" />
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
            
            <TabsContent value="contracts">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Contratos e Termos
                  </CardTitle>
                  <CardDescription>Gerenciar os contratos e termos do sistema.</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Conteúdo simplificado */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Contrato Padrão</Label>
                        <p className="text-sm text-gray-500">Contrato base usado em todos os pacotes</p>
                      </div>
                      <Button variant="outline" size="sm">Editar</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Termos do Pacote Essencial</Label>
                        <p className="text-sm text-gray-500">Termos específicos para o pacote Essencial</p>
                      </div>
                      <Button variant="outline" size="sm">Editar</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Termos do Pacote Premium</Label>
                        <p className="text-sm text-gray-500">Termos específicos para o pacote Premium</p>
                      </div>
                      <Button variant="outline" size="sm">Editar</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Termos do Pacote Profissional</Label>
                        <p className="text-sm text-gray-500">Termos específicos para o pacote Profissional</p>
                      </div>
                      <Button variant="outline" size="sm">Editar</Button>
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
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Segurança
                  </CardTitle>
                  <CardDescription>Configurações de segurança do sistema.</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Conteúdo simplificado */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="two-factor" className="text-base">Autenticação de Dois Fatores</Label>
                        <p className="text-sm text-gray-500">Exigir 2FA para administradores</p>
                      </div>
                      <Switch id="two-factor" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password-policy">Política de Senhas</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch id="require-uppercase" />
                          <Label htmlFor="require-uppercase">Exigir maiúsculas</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="require-number" />
                          <Label htmlFor="require-number">Exigir números</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="require-symbol" />
                          <Label htmlFor="require-symbol">Exigir símbolos</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="min-length" />
                          <Label htmlFor="min-length">Mínimo de 8 caracteres</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Tempo de Sessão (minutos)</Label>
                      <Input id="session-timeout" defaultValue="60" type="number" />
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
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
