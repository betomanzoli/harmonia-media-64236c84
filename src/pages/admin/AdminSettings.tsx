import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Upload, Database, Globe, Bell, Lock, Mail, Palette, Webhook, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const AdminSettings: React.FC = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const handleSaveSettings = (section: string) => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Configurações salvas",
        description: `As configurações de ${section} foram atualizadas com sucesso.`
      });
    }, 1000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie as configurações do sistema
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
        
        <Tabs defaultValue="general">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="md:w-64 flex-shrink-0">
              <CardContent className="p-4">
                <TabsList className="flex flex-col h-auto space-y-1">
                  <TabsTrigger value="general" className="justify-start w-full">
                    <Globe className="w-4 h-4 mr-2" />
                    Geral
                  </TabsTrigger>
                  <TabsTrigger value="site" className="justify-start w-full">
                    <Palette className="w-4 h-4 mr-2" />
                    Personalização
                  </TabsTrigger>
                  <TabsTrigger value="email" className="justify-start w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="database" className="justify-start w-full">
                    <Database className="w-4 h-4 mr-2" />
                    Banco de Dados
                  </TabsTrigger>
                  <TabsTrigger value="integrations" className="justify-start w-full">
                    <Webhook className="w-4 h-4 mr-2" />
                    Integrações
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="justify-start w-full">
                    <Bell className="w-4 h-4 mr-2" />
                    Notificações
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="justify-start w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    Privacidade
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="justify-start w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Documentos
                  </TabsTrigger>
                </TabsList>
              </CardContent>
            </Card>
            
            <div className="flex-1">
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações Gerais</CardTitle>
                    <CardDescription>
                      Configure as informações básicas do sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="site-name">Nome do Site</Label>
                          <Input id="site-name" defaultValue="harmonIA" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="site-url">URL do Site</Label>
                          <Input id="site-url" defaultValue="https://harmonia.media" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="site-description">Descrição</Label>
                        <Textarea 
                          id="site-description" 
                          defaultValue="harmonIA - Transformando histórias em música com IA e talento humano"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="maintenance-mode" className="block">Modo de Manutenção</Label>
                        <div className="flex items-center space-x-2">
                          <Switch id="maintenance-mode" />
                          <Label htmlFor="maintenance-mode">Ativar modo de manutenção</Label>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-end">
                      <Button 
                        className="bg-harmonia-green hover:bg-harmonia-green/90"
                        onClick={() => handleSaveSettings('Geral')}
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Alterações
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="site">
                <Card>
                  <CardHeader>
                    <CardTitle>Personalização</CardTitle>
                    <CardDescription>
                      Personalize a aparência do site
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="primary-color">Cor Primária</Label>
                          <div className="flex gap-2">
                            <Input id="primary-color" defaultValue="#10B981" />
                            <div className="w-10 h-10 rounded bg-harmonia-green border"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="logo-upload">Logo</Label>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" className="w-full">
                              <Upload className="mr-2 h-4 w-4" />
                              Enviar Logo
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="footer-text">Texto do Rodapé</Label>
                        <Textarea 
                          id="footer-text" 
                          defaultValue="© 2025 harmonIA. Todos os direitos reservados."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="custom-css">CSS Personalizado</Label>
                        <Textarea 
                          id="custom-css" 
                          className="font-mono"
                          placeholder="Adicione CSS personalizado aqui..."
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-end">
                      <Button 
                        className="bg-harmonia-green hover:bg-harmonia-green/90"
                        onClick={() => handleSaveSettings('Personalização')}
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Alterações
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="email">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Email</CardTitle>
                    <CardDescription>Configure o envio de emails do sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Esta seção será implementada em breve.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="database">
                <Card>
                  <CardHeader>
                    <CardTitle>Banco de Dados</CardTitle>
                    <CardDescription>Gerencie configurações do banco de dados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Esta seção será implementada em breve.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="integrations">
                <Card>
                  <CardHeader>
                    <CardTitle>Integrações</CardTitle>
                    <CardDescription>Configure integrações com outros serviços</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Esta seção será implementada em breve.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notificações</CardTitle>
                    <CardDescription>Configure as notificações do sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Esta seção será implementada em breve.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="privacy">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacidade</CardTitle>
                    <CardDescription>Configure as políticas de privacidade</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Esta seção será implementada em breve.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Documentos</CardTitle>
                    <CardDescription>Gerencie documentos do sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Esta seção será implementada em breve.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
