
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, FileText, Download, CheckCircle, XCircle, Calendar, Send, HelpCircle } from 'lucide-react';
import InvoicesGuide from '@/components/admin/guides/InvoicesGuide';

// Estados possíveis para nota fiscal
enum InvoiceStatus {
  PENDING = 'pending',
  GENERATED = 'generated',
  SENT = 'sent',
  CANCELED = 'canceled'
}

// Interface para os dados de uma nota fiscal
interface Invoice {
  id: string;
  orderId: string;
  customerName: string;
  customerDocument: string;
  amount: number;
  email: string;
  createdAt: Date;
  status: InvoiceStatus;
  invoiceNumber?: string;
  sentAt?: Date;
  generatedAt?: Date;
}

// Dados de exemplo para a demonstração
const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    orderId: 'HAR12345',
    customerName: 'Maria Silva',
    customerDocument: '123.456.789-00',
    amount: 479,
    email: 'maria@exemplo.com',
    createdAt: new Date(2025, 3, 5),
    status: InvoiceStatus.PENDING
  },
  {
    id: 'inv-002',
    orderId: 'HAR12346',
    customerName: 'João Santos',
    customerDocument: '987.654.321-00',
    amount: 219,
    email: 'joao@exemplo.com',
    createdAt: new Date(2025, 3, 4),
    status: InvoiceStatus.GENERATED,
    invoiceNumber: 'NF-e 12345',
    generatedAt: new Date(2025, 3, 6)
  },
  {
    id: 'inv-003',
    orderId: 'HAR12347',
    customerName: 'Empresa ABC Ltda',
    customerDocument: '12.345.678/0001-90',
    amount: 969,
    email: 'financeiro@empresaabc.com',
    createdAt: new Date(2025, 3, 3),
    status: InvoiceStatus.SENT,
    invoiceNumber: 'NF-e 12344',
    generatedAt: new Date(2025, 3, 4),
    sentAt: new Date(2025, 3, 4)
  },
  {
    id: 'inv-004',
    orderId: 'HAR12348',
    customerName: 'Ana Oliveira',
    customerDocument: '111.222.333-44',
    amount: 349,
    email: 'ana@exemplo.com',
    createdAt: new Date(2025, 3, 2),
    status: InvoiceStatus.CANCELED
  }
];

const AdminInvoices: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'all'>('all');
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [showHelp, setShowHelp] = useState(false);
  
  // Função para filtrar as notas fiscais
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Manipular a seleção de notas fiscais
  const toggleInvoiceSelection = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId)
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };
  
  // Selecionar ou desselecionar todas as notas
  const toggleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(inv => inv.id));
    }
  };
  
  // Gerar nota fiscal
  const generateInvoice = (invoiceId: string) => {
    // Simular geração de nota fiscal
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId
        ? {
            ...inv,
            status: InvoiceStatus.GENERATED,
            invoiceNumber: `NF-e ${Math.floor(10000 + Math.random() * 90000)}`,
            generatedAt: new Date()
          }
        : inv
    ));
    
    toast({
      title: "Nota fiscal gerada com sucesso",
      description: "A nota fiscal foi gerada e está pronta para envio."
    });
  };
  
  // Enviar nota fiscal
  const sendInvoice = (invoiceId: string) => {
    // Simular envio de nota fiscal
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId
        ? {
            ...inv,
            status: InvoiceStatus.SENT,
            sentAt: new Date()
          }
        : inv
    ));
    
    toast({
      title: "Nota fiscal enviada",
      description: "A nota fiscal foi enviada por email para o cliente."
    });
  };
  
  // Cancelar nota fiscal
  const cancelInvoice = (invoiceId: string) => {
    // Simular cancelamento de nota fiscal
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId
        ? {
            ...inv,
            status: InvoiceStatus.CANCELED
          }
        : inv
    ));
    
    toast({
      title: "Nota fiscal cancelada",
      description: "A nota fiscal foi cancelada com sucesso."
    });
  };
  
  // Ações em lote para as notas selecionadas
  const bulkGenerateInvoices = () => {
    // Filtrar apenas as notas com status PENDING
    const eligibleInvoices = selectedInvoices.filter(id => 
      invoices.find(inv => inv.id === id)?.status === InvoiceStatus.PENDING
    );
    
    if (eligibleInvoices.length === 0) {
      toast({
        title: "Nenhuma nota elegível",
        description: "Selecione notas com status 'Pendente' para gerar.",
        variant: "destructive"
      });
      return;
    }
    
    // Simular geração em lote
    eligibleInvoices.forEach(id => generateInvoice(id));
    
    toast({
      title: "Notas fiscais geradas",
      description: `${eligibleInvoices.length} notas fiscais foram geradas com sucesso.`
    });
  };
  
  const bulkSendInvoices = () => {
    // Filtrar apenas as notas com status GENERATED
    const eligibleInvoices = selectedInvoices.filter(id => 
      invoices.find(inv => inv.id === id)?.status === InvoiceStatus.GENERATED
    );
    
    if (eligibleInvoices.length === 0) {
      toast({
        title: "Nenhuma nota elegível",
        description: "Selecione notas com status 'Gerada' para enviar.",
        variant: "destructive"
      });
      return;
    }
    
    // Simular envio em lote
    eligibleInvoices.forEach(id => sendInvoice(id));
    
    toast({
      title: "Notas fiscais enviadas",
      description: `${eligibleInvoices.length} notas fiscais foram enviadas para os clientes.`
    });
  };
  
  // Renderizar o status da nota fiscal com badge colorida
  const renderStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.PENDING:
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">Pendente</Badge>;
      case InvoiceStatus.GENERATED:
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">Gerada</Badge>;
      case InvoiceStatus.SENT:
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">Enviada</Badge>;
      case InvoiceStatus.CANCELED:
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">Cancelada</Badge>;
    }
  };
  
  // Funções para formatação
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };
  
  // Renderizar ações disponíveis para cada nota fiscal
  const renderActions = (invoice: Invoice) => {
    if (invoice.status === InvoiceStatus.PENDING) {
      return (
        <Button
          size="sm"
          variant="outline"
          className="text-blue-500 border-blue-500/30 hover:bg-blue-500/10"
          onClick={() => generateInvoice(invoice.id)}
        >
          <FileText className="w-4 h-4 mr-1" /> Gerar NF
        </Button>
      );
    }
    
    if (invoice.status === InvoiceStatus.GENERATED) {
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-green-500 border-green-500/30 hover:bg-green-500/10"
            onClick={() => sendInvoice(invoice.id)}
          >
            <Send className="w-4 h-4 mr-1" /> Enviar
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-500 border-red-500/30 hover:bg-red-500/10"
            onClick={() => cancelInvoice(invoice.id)}
          >
            <XCircle className="w-4 h-4 mr-1" /> Cancelar
          </Button>
        </div>
      );
    }
    
    if (invoice.status === InvoiceStatus.SENT) {
      return (
        <Button
          size="sm"
          variant="outline"
          className="text-gray-500"
        >
          <Download className="w-4 h-4 mr-1" /> Download
        </Button>
      );
    }
    
    return null;
  };
  
  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold">Gestão de Notas Fiscais</h1>
          <Button 
            variant="outline" 
            size="sm" 
            className={`gap-2 ${showHelp ? 'bg-blue-100 border-blue-300' : ''}`}
            onClick={() => setShowHelp(!showHelp)}
          >
            <HelpCircle className="w-4 h-4" />
            {showHelp ? 'Desativar ajuda' : 'Ativar ajuda'}
          </Button>
        </div>
        
        <ScrollArea className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold">Notas Fiscais</h1>
                <InvoicesGuide />
              </div>
              <p className="text-gray-500 mt-2">Gere e gerencie notas fiscais para os pedidos processados</p>
            </div>
            
            <div className="flex gap-2">
              {selectedInvoices.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    className="border-blue-500/30 text-blue-500 hover:bg-blue-500/10"
                    onClick={bulkGenerateInvoices}
                  >
                    <FileText className="w-4 h-4 mr-1" /> Gerar selecionadas
                  </Button>
                  <Button
                    variant="outline"
                    className="border-green-500/30 text-green-500 hover:bg-green-500/10"
                    onClick={bulkSendInvoices}
                  >
                    <Send className="w-4 h-4 mr-1" /> Enviar selecionadas
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <Card className="mb-8">
            <div className="p-6 space-y-6">
              <div className="flex justify-between">
                <div className="relative w-1/3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar por cliente, pedido ou nº da NF..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Tabs
                  value={filterStatus}
                  onValueChange={(value) => setFilterStatus(value as InvoiceStatus | 'all')}
                >
                  <TabsList>
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value={InvoiceStatus.PENDING}>Pendentes</TabsTrigger>
                    <TabsTrigger value={InvoiceStatus.GENERATED}>Geradas</TabsTrigger>
                    <TabsTrigger value={InvoiceStatus.SENT}>Enviadas</TabsTrigger>
                    <TabsTrigger value={InvoiceStatus.CANCELED}>Canceladas</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-card border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                            onCheckedChange={toggleSelectAll}
                          />
                          <Label>Pedido</Label>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left">Cliente</th>
                      <th className="px-4 py-3 text-left">CPF/CNPJ</th>
                      <th className="px-4 py-3 text-left">Valor</th>
                      <th className="px-4 py-3 text-left">Data</th>
                      <th className="px-4 py-3 text-left">Nota Fiscal</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-gray-500">
                          Nenhuma nota fiscal encontrada
                        </td>
                      </tr>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <tr key={invoice.id} className="border-t border-border hover:bg-card/60">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={selectedInvoices.includes(invoice.id)}
                                onCheckedChange={() => toggleInvoiceSelection(invoice.id)}
                              />
                              {invoice.orderId}
                            </div>
                          </td>
                          <td className="px-4 py-4">{invoice.customerName}</td>
                          <td className="px-4 py-4">{invoice.customerDocument}</td>
                          <td className="px-4 py-4">{formatCurrency(invoice.amount)}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              {formatDate(invoice.createdAt)}
                            </div>
                          </td>
                          <td className="px-4 py-4">{invoice.invoiceNumber || "-"}</td>
                          <td className="px-4 py-4">{renderStatusBadge(invoice.status)}</td>
                          <td className="px-4 py-4">{renderActions(invoice)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Fluxo de Emissão de Notas Fiscais</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="bg-background border border-border rounded-lg p-4">
                  <div className="bg-yellow-500/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <span className="text-yellow-500 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Pagamento Confirmado</h3>
                  <p className="text-sm text-gray-400">
                    Após a confirmação do pagamento, o sistema registra automaticamente a necessidade de emissão de nota fiscal.
                  </p>
                </div>
                
                <div className="bg-background border border-border rounded-lg p-4">
                  <div className="bg-blue-500/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <span className="text-blue-500 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Geração da NF</h3>
                  <p className="text-sm text-gray-400">
                    O administrador acessa esta interface e gera a nota fiscal manualmente ou em lote. A integração com o sistema de NF-e é realizada.
                  </p>
                </div>
                
                <div className="bg-background border border-border rounded-lg p-4">
                  <div className="bg-green-500/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <span className="text-green-500 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Envio ao Cliente</h3>
                  <p className="text-sm text-gray-400">
                    Notas fiscais geradas são enviadas automaticamente por email para o cliente quando o botão "Enviar" é clicado.
                  </p>
                </div>
                
                <div className="bg-background border border-border rounded-lg p-4">
                  <div className="bg-harmonia-green/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <span className="text-harmonia-green font-bold">4</span>
                  </div>
                  <h3 className="font-semibold mb-2">Arquivamento</h3>
                  <p className="text-sm text-gray-400">
                    Todas as notas fiscais são arquivadas digitalmente e podem ser acessadas a qualquer momento através deste painel.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </ScrollArea>
      </div>
    </AdminLayout>
  );
};

export default AdminInvoices;
