
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Mail, CreditCard, Globe, Bell, Key, Lock, Save, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminSettings: React.FC = () => {
  const { toast } = useToast();
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'harmonIA',
    email: 'contato@harmonia.media',
    phone: '(11) 98765-4321',
    logo: '/logo.png'
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newOrderNotifications: true,
    feedbackNotifications: true,
    marketingNotifications: false
  });
  
  const [paymentSettings, setPaymentSettings] = useState({
    mercadoPagoEnabled: true,
    mercadoPagoKey: 'TEST-12345-6789',
    mercadoPagoClientId: 'TEST-CLIENT-ID',
    pixEnabled: true,
    bankTransferEnabled: true
  });

  const handleSaveSettings = (settingType: string) => {
    toast({
      title: "Configurações salvas",
      description: `As configurações de ${settingType} foram salvas com sucesso.`
    });
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
          <div className="flex gap-2">
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
        </div>
        
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              Pagamento
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-harmonia-green" />
                  Configurações Gerais
                </CardTitle>
                <CardDescription>
                  Configure as informações básicas do seu site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="site-name" className="text-sm font-medium">
                    Nome do Site
                  </label>
                  <Input 
                    id="site-name" 
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="site-email" className="text-sm font-medium">
                    Email de Contato
                  </label>
                  <Input 
                    id="site-email" 
                    type="email"
                    value={generalSettings.email}
                    onChange={(e) => setGeneralSettings({...generalSettings, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="site-phone" className="text-sm font-medium">
                    Telefone de Contato
                  </label>
                  <Input 
                    id="site-phone" 
                    value={generalSettings.phone}
                    onChange={(e) => setGeneralSettings({...generalSettings, phone: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="site-logo" className="text-sm font-medium">
                    Logo do Site
                  </label>
                  <div className="flex items-center gap-4">
                    <img 
                      src={generalSettings.logo} 
                      alt="Logo do site" 
                      className="h-16 w-auto bg-gray-100 p-2 rounded"
                    />
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Fazer Upload
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="bg-harmonia-green hover:bg-harmonia-green/90"
                  onClick={() => handleSaveSettings('gerais')}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-harmonia-green" />
                  Configurações de Notificações
                </CardTitle>
                <CardDescription>
                  Configure como você recebe notificações do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">
                      Notificações por Email
                    </label>
                    <p className="text-xs text-gray-500">
                      Receba notificações importantes por email
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, emailNotifications: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">
                      Novos Pedidos
                    </label>
                    <p className="text-xs text-gray-500">
                      Receba notificações quando novos pedidos forem realizados
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.newOrderNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, newOrderNotifications: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">
                      Feedbacks de Clientes
                    </label>
                    <p className="text-xs text-gray-500">
                      Receba notificações quando clientes enviarem feedbacks
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.feedbackNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, feedbackNotifications: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">
                      Marketing e Promoções
                    </label>
                    <p className="text-xs text-gray-500">
                      Receba notificações sobre marketing e promoções
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.marketingNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, marketingNotifications: checked})
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="bg-harmonia-green hover:bg-harmonia-green/90"
                  onClick={() => handleSaveSettings('notificações')}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-harmonia-green" />
                  Configurações de Pagamento
                </CardTitle>
                <CardDescription>
                  Configure as opções de pagamento disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">
                      MercadoPago
                    </label>
                    <Switch 
                      checked={paymentSettings.mercadoPagoEnabled}
                      onCheckedChange={(checked) => 
                        setPaymentSettings({...paymentSettings, mercadoPagoEnabled: checked})
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="mercado-pago-key" className="text-xs text-gray-500">
                      Chave de API
                    </label>
                    <Input 
                      id="mercado-pago-key" 
                      type="password"
                      value={paymentSettings.mercadoPagoKey}
                      onChange={(e) => setPaymentSettings({...paymentSettings, mercadoPagoKey: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="mercado-pago-client" className="text-xs text-gray-500">
                      Client ID
                    </label>
                    <Input 
                      id="mercado-pago-client"
                      value={paymentSettings.mercadoPagoClientId}
                      onChange={(e) => setPaymentSettings({...paymentSettings, mercadoPagoClientId: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">
                      Pagamento via PIX
                    </label>
                    <p className="text-xs text-gray-500">
                      Permitir pagamentos via PIX
                    </p>
                  </div>
                  <Switch 
                    checked={paymentSettings.pixEnabled}
                    onCheckedChange={(checked) => 
                      setPaymentSettings({...paymentSettings, pixEnabled: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">
                      Transferência Bancária
                    </label>
                    <p className="text-xs text-gray-500">
                      Permitir pagamentos via transferência bancária
                    </p>
                  </div>
                  <Switch 
                    checked={paymentSettings.bankTransferEnabled}
                    onCheckedChange={(checked) => 
                      setPaymentSettings({...paymentSettings, bankTransferEnabled: checked})
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="bg-harmonia-green hover:bg-harmonia-green/90"
                  onClick={() => handleSaveSettings('pagamento')}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
