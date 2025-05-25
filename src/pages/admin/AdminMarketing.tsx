
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Settings, Users, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import WebhookConfigDialog from '@/components/admin/marketing/WebhookConfigDialog';

interface MarketingLead {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
  updated_at: string;
  lead_source?: string;
  lead_medium?: string;
  lead_campaign?: string;
  lead_term?: string;
  lead_content?: string;
  redirect_page?: string;
  responses: any;
}

const AdminMarketing = () => {
  const [leads, setLeads] = useState<MarketingLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    converted: 0,
    conversionRate: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('marketing_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type-safe mapping
      const typedLeads: MarketingLead[] = (data || []).map((item: any) => ({
        id: item.id as string,
        name: item.name as string,
        email: item.email as string,
        status: item.status as string,
        created_at: item.created_at as string,
        updated_at: item.updated_at as string,
        lead_source: item.lead_source as string,
        lead_medium: item.lead_medium as string,
        lead_campaign: item.lead_campaign as string,
        lead_term: item.lead_term as string,
        lead_content: item.lead_content as string,
        redirect_page: item.redirect_page as string,
        responses: item.responses || {}
      }));

      setLeads(typedLeads);

      // Calculate stats
      const total = typedLeads.length;
      const thisMonth = typedLeads.filter(lead => {
        const leadDate = new Date(lead.created_at);
        const now = new Date();
        return leadDate.getMonth() === now.getMonth() && 
               leadDate.getFullYear() === now.getFullYear();
      }).length;
      
      const converted = typedLeads.filter(lead => lead.status === 'converted').length;
      const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

      setStats({ total, thisMonth, converted, conversionRate });

    } catch (error: any) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os leads",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportLeads = () => {
    const csvContent = [
      ['Nome', 'Email', 'Status', 'Data de Criação', 'Fonte', 'Campanha'].join(','),
      ...leads.map(lead => [
        lead.name,
        lead.email,
        lead.status,
        new Date(lead.created_at).toLocaleDateString('pt-BR'),
        lead.lead_source || '',
        lead.lead_campaign || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-harmonia-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-harmonia-green">Marketing & Leads</h1>
        <div className="flex space-x-2">
          <WebhookConfigDialog>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurar Webhooks
            </Button>
          </WebhookConfigDialog>
          <Button onClick={exportLeads} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total de Leads</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Este Mês</p>
                <p className="text-2xl font-bold">{stats.thisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Convertidos</p>
                <p className="text-2xl font-bold">{stats.converted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold">{stats.conversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leads Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Nome</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Fonte</th>
                  <th className="text-left p-2">Data</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{lead.name}</td>
                    <td className="p-2 text-gray-600">{lead.email}</td>
                    <td className="p-2">
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="p-2 text-gray-600">{lead.lead_source || '-'}</td>
                    <td className="p-2 text-gray-600">
                      {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {leads.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum lead encontrado
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMarketing;
