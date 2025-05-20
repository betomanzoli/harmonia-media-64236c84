
import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Download, Filter, Search, ExternalLink, Trash2, Eye 
} from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseData } from '@/hooks/use-supabase-data';
import webhookService from '@/services/webhookService';

interface MarketingLead {
  id: string;
  name: string;
  email: string;
  lead_source?: string;
  lead_medium?: string;
  lead_campaign?: string;
  responses: Record<string, any>;
  created_at: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'unqualified';
}

const MarketingLeadsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<MarketingLead | null>(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const { toast } = useToast();
  
  const {
    data: marketingLeads,
    isLoading,
    error,
    fetchData,
    updateItem,
    deleteItem
  } = useSupabaseData<MarketingLead>('marketing_leads', {
    orderBy: { column: 'created_at', ascending: false }
  });

  const handleStatusChange = async (leadId: string, newStatus: 'new' | 'contacted' | 'qualified' | 'converted' | 'unqualified') => {
    try {
      await updateItem(leadId, { status: newStatus });
      toast({
        title: "Status atualizado",
        description: `O status do lead foi alterado com sucesso.`
      });
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do lead.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (confirm('Tem certeza que deseja excluir este lead?')) {
      try {
        await deleteItem(leadId);
        toast({
          title: "Lead excluído",
          description: "O lead foi excluído com sucesso."
        });
      } catch (error) {
        console.error('Error deleting lead:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o lead.",
          variant: "destructive"
        });
      }
    }
  };

  const handleNotifyN8n = async (lead: MarketingLead) => {
    try {
      await webhookService.sendItemNotification('client_message', {
        type: 'marketing_lead_notification',
        lead: {
          id: lead.id,
          name: lead.name,
          email: lead.email,
          status: lead.status,
          source: lead.lead_source,
          created_at: lead.created_at
        }
      });
      
      toast({
        title: "Notificação enviada",
        description: "O workflow do n8n foi notificado com sucesso."
      });
    } catch (error) {
      console.error('Error notifying n8n:', error);
      toast({
        title: "Erro",
        description: "Não foi possível notificar o workflow.",
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    if (!marketingLeads.length) return;
    
    // Prepare CSV content
    const headers = ['ID', 'Nome', 'Email', 'Origem', 'Meio', 'Campanha', 'Status', 'Data de Criação'];
    const csvRows = [headers];
    
    marketingLeads.forEach(lead => {
      csvRows.push([
        lead.id,
        lead.name,
        lead.email,
        lead.lead_source || '',
        lead.lead_medium || '',
        lead.lead_campaign || '',
        lead.status,
        new Date(lead.created_at).toLocaleDateString('pt-BR')
      ]);
    });
    
    // Convert to CSV string
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `marketing_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = marketingLeads
    .filter(lead => {
      const matchesSearch = !searchTerm || 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || lead.status === statusFilter;
      const matchesSource = !sourceFilter || lead.lead_source === sourceFilter;
      
      return matchesSearch && matchesStatus && matchesSource;
    });

  const uniqueSources = Array.from(new Set(marketingLeads.map(lead => lead.lead_source).filter(Boolean)));

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">Novo</Badge>;
      case 'contacted':
        return <Badge className="bg-yellow-500">Contatado</Badge>;
      case 'qualified':
        return <Badge className="bg-green-500">Qualificado</Badge>;
      case 'converted':
        return <Badge className="bg-purple-500">Convertido</Badge>;
      case 'unqualified':
        return <Badge className="bg-red-500">Não Qualificado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Carregando leads...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Erro ao carregar leads: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Leads de Marketing</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Gerencie leads capturados nas campanhas de marketing
          </p>
        </div>
        
        <Button onClick={exportToCSV} disabled={!marketingLeads.length}>
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Campanhas Ativas</CardTitle>
          <CardDescription>
            {marketingLeads.length} leads capturados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={statusFilter || ''} onValueChange={(value) => setStatusFilter(value || null)}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>{statusFilter ? `Status: ${statusFilter}` : 'Filtrar por status'}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                <SelectItem value="new">Novos</SelectItem>
                <SelectItem value="contacted">Contatados</SelectItem>
                <SelectItem value="qualified">Qualificados</SelectItem>
                <SelectItem value="converted">Convertidos</SelectItem>
                <SelectItem value="unqualified">Não Qualificados</SelectItem>
              </SelectContent>
            </Select>
            
            {uniqueSources.length > 0 && (
              <Select value={sourceFilter || ''} onValueChange={(value) => setSourceFilter(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>{sourceFilter ? `Origem: ${sourceFilter}` : 'Filtrar por origem'}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as origens</SelectItem>
                  {uniqueSources.map(source => (
                    <SelectItem key={source} value={source || ''}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          {filteredLeads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum lead encontrado com os filtros aplicados.
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>
                        {lead.lead_source ? (
                          <div className="flex flex-col">
                            <span>{lead.lead_source}</span>
                            {lead.lead_medium && (
                              <span className="text-xs text-gray-500">{lead.lead_medium}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">Direto</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={lead.status} 
                          onValueChange={(value) => handleStatusChange(lead.id, value)}
                        >
                          <SelectTrigger className="h-8 w-[130px]">
                            {getStatusBadge(lead.status)}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">Novo</SelectItem>
                            <SelectItem value="contacted">Contatado</SelectItem>
                            <SelectItem value="qualified">Qualificado</SelectItem>
                            <SelectItem value="converted">Convertido</SelectItem>
                            <SelectItem value="unqualified">Não Qualificado</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {formatDate(lead.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              setSelectedLead(lead);
                              setShowLeadDetails(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleNotifyN8n(lead)} 
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteLead(lead.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Lead Details Dialog */}
      <Dialog open={showLeadDetails} onOpenChange={setShowLeadDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
            <DialogDescription>
              Informações completas sobre o lead
            </DialogDescription>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Informações Básicas</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nome:</span>
                      <span className="font-medium">{selectedLead.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium">{selectedLead.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="font-medium">{getStatusBadge(selectedLead.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Data de Criação:</span>
                      <span className="font-medium">{formatDate(selectedLead.created_at)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Informações de Campanha</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Origem (UTM Source):</span>
                      <span className="font-medium">{selectedLead.lead_source || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Meio (UTM Medium):</span>
                      <span className="font-medium">{selectedLead.lead_medium || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Campanha (UTM Campaign):</span>
                      <span className="font-medium">{selectedLead.lead_campaign || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Respostas do Funil</h3>
                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Pergunta</TableHead>
                          <TableHead>Resposta</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(selectedLead.responses).map(([key, value]) => {
                          // Skip name and email as they're shown above
                          if (key === 'name' || key === 'email') return null;
                          
                          // Format the question based on the key
                          let question = '';
                          switch (key) {
                            case 'projectType':
                              question = 'Tipo de projeto musical';
                              break;
                            case 'musicStyle':
                              question = 'Estilo musical preferido';
                              break;
                            case 'musicValue':
                              question = 'O que mais valoriza em uma música';
                              break;
                            default:
                              question = key;
                          }
                          
                          // Format the value based on known options
                          let displayValue = String(value);
                          if (key === 'projectType') {
                            if (value === 'evento_pessoal') displayValue = 'Evento pessoal';
                            if (value === 'negocio') displayValue = 'Para negócio';
                            if (value === 'presente') displayValue = 'Presente';
                          } else if (key === 'musicValue') {
                            if (value === 'letra') displayValue = 'Uma letra marcante';
                            if (value === 'melodia') displayValue = 'Uma melodia única';
                            if (value === 'producao') displayValue = 'Produção de alta qualidade';
                            if (value === 'originalidade') displayValue = 'Originalidade e criatividade';
                          }
                          
                          return (
                            <TableRow key={key}>
                              <TableCell>{question}</TableCell>
                              <TableCell>{displayValue}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setShowLeadDetails(false)}
                >
                  Fechar
                </Button>
                
                <Button onClick={() => handleNotifyN8n(selectedLead)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Enviar para N8N
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketingLeadsList;
