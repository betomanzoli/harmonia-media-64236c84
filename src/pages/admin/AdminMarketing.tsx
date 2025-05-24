import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UserPlus, BarChart, TrendingUp, Mail, MessageSquare } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { MarketingLeadsList } from '@/components/admin/marketing/MarketingLeadsList';
import { WebhookConfigDialog } from '@/components/admin/marketing/WebhookConfigDialog';

// ✅ TIPOS CORRIGIDOS
type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

interface MarketingLead {
  id: string;
  name: string;
  email: string;
  status: LeadStatus; // ✅ TIPO ESPECÍFICO
  lead_source: string;
  created_at: string;
}

const AdminMarketing: React.FC = () => {
  const [isWebhookDialogOpen, setIsWebhookDialogOpen] = useState(false);

  // ✅ CORRIGIDO: mockLeads com tipos corretos
  const mockLeads: MarketingLead[] = [
    {
      id: "lead-1",
      name: "João Silva",
      email: "joao@example.com",
      status: "new", // ✅ TIPO CORRETO
      lead_source: "website",
      created_at: "2023-05-15"
    },
    {
      id: "lead-2",
      name: "Maria Santos",
      email: "maria@example.com",
      status: "contacted", // ✅ TIPO CORRETO
      lead_source: "referral",
      created_at: "2023-05-14"
    },
    {
      id: "lead-3",
      name: "Pedro Oliveira",
      email: "pedro@example.com",
      status: "qualified", // ✅ TIPO CORRETO
      lead_source: "google_ads",
      created_at: "2023-05-13"
    },
    {
      id: "lead-4",
      name: "Ana Costa",
      email: "ana@example.com",
      status: "converted", // ✅ TIPO CORRETO
      lead_source: "instagram",
      created_at: "2023-05-12"
    }
  ];

  const campaigns = [
    {
      title: "Campanha Instagram - Maio 2024",
      leads: 45,
      conversions: 12,
      dates: "01/05 - 31/05"
    },
    {
      title: "Google Ads - Música Personalizada",
      leads: 32,
      conversions: 8,
      dates: "15/05 - 15/06"
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Marketing</h1>
          <Button onClick={() => setIsWebhookDialogOpen(true)}>
            Configurar Webhooks
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockLeads.length}</div>
                  <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversões</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockLeads.filter(lead => lead.status === 'converted').length}
                  </div>
                  <p className="text-xs text-muted-foreground">+8% em relação ao mês anterior</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {((mockLeads.filter(lead => lead.status === 'converted').length / mockLeads.length) * 100).toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">-2% em relação ao mês anterior</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Email Open Rate</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24.8%</div>
                  <p className="text-xs text-muted-foreground">+3% em relação ao mês anterior</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {campaigns.map((campaign, index) => (
                <CampaignCard key={index} {...campaign} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leads" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Leads Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {/* ✅ COMPONENTE COM PROPS CORRETAS */}
                <MarketingLeadsList leads={mockLeads} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Fontes de Tráfego</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Website Direto</span>
                      <Badge variant="outline">35%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Google Ads</span>
                      <Badge variant="outline">28%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Instagram</span>
                      <Badge variant="outline">22%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Referências</span>
                      <Badge variant="outline">15%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Conversão por Fonte</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Referências</span>
                      <Badge>25%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Website Direto</span>
                      <Badge>18%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Instagram</span>
                      <Badge>15%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Google Ads</span>
                      <Badge>12%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <WebhookConfigDialog
        open={isWebhookDialogOpen}
        onOpenChange={setIsWebhookDialogOpen}
      />
    </AdminLayout>
  );
};

interface CampaignCardProps {
  title: string;
  leads: number;
  conversions: number;
  dates: string;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  title,
  leads,
  conversions,
  dates
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg">{title}</h3>
          <Badge>Ativa</Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{dates}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center gap-1">
                <UserPlus className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">{leads}</span>
              </div>
              <p className="text-xs text-muted-foreground">Leads</p>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-1">
                <BarChart className="h-4 w-4 text-green-500" />
                <span className="font-semibold">{conversions}</span>
              </div>
              <p className="text-xs text-muted-foreground">Conversões</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium">
              {Math.round((conversions / leads) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Taxa</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full">
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminMarketing;
