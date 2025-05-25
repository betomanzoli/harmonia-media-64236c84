
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Filter, RefreshCw, Search } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MarketingLeadsList from '@/components/admin/marketing/MarketingLeadsList';
import WebhookConfigDialog from '@/components/admin/marketing/WebhookConfigDialog';

export type MarketingLead = {
  id: string;
  name: string;
  email: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'unqualified';
  responses: Record<string, any>;
  lead_source?: string;
  lead_medium?: string;
  lead_campaign?: string;
  created_at: string;
};

const AdminMarketing: React.FC = () => {
  const [leads, setLeads] = useState<MarketingLead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [showWebhookConfig, setShowWebhookConfig] = useState(false);
  const { toast } = useToast();

  const sources = Array.from(new Set(leads.map(lead => lead.lead_source).filter(Boolean)));

  const fetchLeads = async () => {
    setIsLoading(true);
    
    try {
      let query = supabase.from('marketing_leads').select('*').order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching marketing leads:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os leads de marketing',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateLeadStatus = async (id: string, status: 'new' | 'contacted' | 'qualified' | 'converted' | 'unqualified') => {
    try {
      const { error } = await supabase
        .from('marketing_leads')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      setLeads(leads.map(lead => 
        lead.id === id ? { ...lead, status } : lead
      ));
      
      toast({
        title: 'Status atualizado',
        description: 'O status do lead foi atualizado com sucesso'
      });
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status do lead',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este lead?')) return;
    
    try {
      const { error } = await supabase
        .from('marketing_leads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setLeads(leads.filter(lead => lead.id !== id));
      
      toast({
        title: 'Lead excluído',
        description: 'O lead foi excluído com sucesso'
      });
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o lead',
        variant: 'destructive'
      });
    }
  };

  const exportToCSV = () => {
    if (leads.length === 0) {
      toast({
        title: 'Sem dados',
        description: 'Não há leads para exportar',
        variant: 'destructive'
      });
      return;
    }
    
    // Filter leads if filters are applied
    const filteredLeads = leads.filter(lead => {
      if (sourceFilter && lead.lead_source !== sourceFilter) return false;
      if (statusFilter && lead.status !== statusFilter) return false;
      if (searchQuery && !lead.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !lead.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
    
    if (filteredLeads.length === 0) {
      toast({
        title: 'Sem dados',
        description: 'Não há leads correspondentes aos filtros para exportar',
        variant: 'destructive'
      });
      return;
    }
    
    // Create CSV headers
    const headers = [
      'Nome',
      'Email',
      'Status',
      'Data',
      'Origem',
      'Meio',
      'Campanha',
      'Tipo de projeto',
      'Estilo musical',
      'Preferência de valor'
    ];
    
    // Create CSV rows
    const rows = filteredLeads.map(lead => [
      lead.name,
      lead.email,
      lead.status,
      new Date(lead.created_at).toLocaleDateString('pt-BR'),
      lead.lead_source || '',
      lead.lead_medium || '',
      lead.lead_campaign || '',
      lead.responses?.project_type || '',
      lead.responses?.music_style || '',
      lead.responses?.value_preference || ''
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads-marketing-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter(lead => {
    if (sourceFilter && lead.lead_source !== sourceFilter) return false;
    if (statusFilter && lead.status !== statusFilter) return false;
    if (searchQuery && !lead.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !lead.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Marketing Leads</h1>
          <p className="text-gray-500">Gerenciamento de leads capturados via landing pages</p>
        </div>
        
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowWebhookConfig(true)}
          >
            Configurar Webhook
          </Button>
          
          <Button 
            variant="default" 
            onClick={exportToCSV}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2 w-full sm:max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-gray-100' : ''}
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  fetchLeads();
                  toast({
                    title: 'Atualizado',
                    description: 'Os leads foram atualizados'
                  });
                }}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            {showFilters && (
              <div className="flex flex-wrap gap-2">
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por origem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undefined">Todas origens</SelectItem>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undefined">Todos status</SelectItem>
                    <SelectItem value="new">Novo</SelectItem>
                    <SelectItem value="contacted">Contactado</SelectItem>
                    <SelectItem value="qualified">Qualificado</SelectItem>
                    <SelectItem value="converted">Convertido</SelectItem>
                    <SelectItem value="unqualified">Não qualificado</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSourceFilter(undefined);
                    setStatusFilter(undefined);
                    setSearchQuery('');
                  }}
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <MarketingLeadsList 
            leads={filteredLeads}
            isLoading={isLoading} 
            onUpdateStatus={handleUpdateLeadStatus}
            onDelete={handleDeleteLead}
          />
        </CardContent>
      </Card>
      
      <WebhookConfigDialog
        open={showWebhookConfig}
        onOpenChange={setShowWebhookConfig}
      />
    </div>
  );
};

export default AdminMarketing;
