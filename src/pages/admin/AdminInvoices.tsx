
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Download, ArrowUpDown, DollarSign, Filter, Plus, MoreHorizontal } from 'lucide-react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Mock invoice data
const mockInvoices = [
  {
    id: 'INV001',
    client: 'João Silva',
    amount: 'R$ 1.200,00',
    status: 'paid',
    date: '15/06/2023',
    dueDate: '30/06/2023'
  },
  {
    id: 'INV002',
    client: 'Maria Oliveira',
    amount: 'R$ 950,00',
    status: 'pending',
    date: '18/06/2023',
    dueDate: '02/07/2023'
  },
  {
    id: 'INV003',
    client: 'Carlos Santos',
    amount: 'R$ 1.500,00',
    status: 'overdue',
    date: '10/06/2023',
    dueDate: '25/06/2023'
  },
  {
    id: 'INV004',
    client: 'Ana Pereira',
    amount: 'R$ 800,00',
    status: 'paid',
    date: '12/06/2023',
    dueDate: '27/06/2023'
  },
  {
    id: 'INV005',
    client: 'Roberto Almeida',
    amount: 'R$ 2.300,00',
    status: 'pending',
    date: '20/06/2023',
    dueDate: '05/07/2023'
  }
];

const AdminInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isNewInvoiceDialogOpen, setIsNewInvoiceDialogOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    client: '',
    amount: '',
    dueDate: '',
    description: ''
  });
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setInvoices(mockInvoices);
      setLoading(false);
    }, 800);
  }, []);
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Pago</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Vencido</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };
  
  // Filter invoices based on selected status
  const filteredInvoices = filterStatus === "all" 
    ? invoices 
    : invoices.filter(inv => inv.status === filterStatus);
    
  // Calculate summary values
  const totalAmount = invoices.reduce((sum, inv) => {
    const amount = parseFloat(inv.amount.replace('R$ ', '').replace('.', '').replace(',', '.'));
    return sum + amount;
  }, 0);
  
  const pendingAmount = invoices
    .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((sum, inv) => {
      const amount = parseFloat(inv.amount.replace('R$ ', '').replace('.', '').replace(',', '.'));
      return sum + amount;
    }, 0);
  
  const handleNewInvoiceClick = () => {
    setIsNewInvoiceDialogOpen(true);
  };
  
  const handleNewInvoiceChange = (field: string, value: string) => {
    setNewInvoice({
      ...newInvoice,
      [field]: value
    });
  };
  
  const handleNewInvoiceSubmit = () => {
    // Validar campos obrigatórios
    if (!newInvoice.client || !newInvoice.amount || !newInvoice.dueDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Cliente, valor e data de vencimento são campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // Validar formato do valor
    let amountValue = newInvoice.amount;
    if (!amountValue.includes('R$')) {
      amountValue = `R$ ${amountValue}`;
    }
    
    // Criar nova fatura
    const newId = `INV${(invoices.length + 1).toString().padStart(3, '0')}`;
    const currentDate = new Date().toLocaleDateString('pt-BR');
    const createdInvoice = {
      id: newId,
      client: newInvoice.client,
      amount: amountValue,
      status: 'pending',
      date: currentDate,
      dueDate: newInvoice.dueDate
    };
    
    // Adicionar à lista de faturas
    setInvoices([...invoices, createdInvoice]);
    
    // Fechar o diálogo e resetar o formulário
    setIsNewInvoiceDialogOpen(false);
    setNewInvoice({
      client: '',
      amount: '',
      dueDate: '',
      description: ''
    });
    
    toast({
      title: "Fatura criada",
      description: `A fatura ${newId} foi criada com sucesso.`
    });
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciamento de Faturas</h1>
          <Button onClick={handleNewInvoiceClick}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Fatura
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading 
                  ? '...'
                  : `R$ ${totalAmount.toFixed(2).replace('.', ',')}`}
              </div>
              <p className="text-xs text-muted-foreground">
                +20.1% em relação ao mês passado
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturas Pendentes</CardTitle>
              <span className="h-4 w-4 text-muted-foreground">{loading ? '' : '3'}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading 
                  ? '...'
                  : `R$ ${pendingAmount.toFixed(2).replace('.', ',')}`}
              </div>
              <p className="text-xs text-muted-foreground">
                2 faturas vencidas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Pagamento</CardTitle>
              <span className="h-4 w-4 text-muted-foreground">%</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : '67%'}
              </div>
              <p className="text-xs text-muted-foreground">
                +5.2% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Faturas e Pagamentos</CardTitle>
            <CardDescription>Gerencie todas as faturas e acompanhe os pagamentos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar faturas..." className="pl-8" />
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <Select 
                  value={filterStatus} 
                  onValueChange={(value) => setFilterStatus(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filtrar status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="paid">Pagos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="overdue">Vencidos</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200"></div>
                <p className="mt-2 text-sm text-gray-500">Carregando faturas...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fatura</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.client}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell className="text-right">{invoice.amount}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Dialog open={isNewInvoiceDialogOpen} onOpenChange={setIsNewInvoiceDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Fatura</DialogTitle>
              <DialogDescription>
                Preencha os detalhes para criar uma nova fatura.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="invoice-client" className="text-right">
                  Cliente*
                </Label>
                <Input
                  id="invoice-client"
                  className="col-span-3"
                  value={newInvoice.client}
                  onChange={(e) => handleNewInvoiceChange('client', e.target.value)}
                  placeholder="Nome do cliente"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="invoice-amount" className="text-right">
                  Valor*
                </Label>
                <Input
                  id="invoice-amount"
                  className="col-span-3"
                  value={newInvoice.amount}
                  onChange={(e) => handleNewInvoiceChange('amount', e.target.value)}
                  placeholder="R$ 0,00"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="invoice-due-date" className="text-right">
                  Vencimento*
                </Label>
                <Input
                  id="invoice-due-date"
                  type="date"
                  className="col-span-3"
                  value={newInvoice.dueDate}
                  onChange={(e) => handleNewInvoiceChange('dueDate', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="invoice-description" className="text-right">
                  Descrição
                </Label>
                <Input
                  id="invoice-description"
                  className="col-span-3"
                  value={newInvoice.description}
                  onChange={(e) => handleNewInvoiceChange('description', e.target.value)}
                  placeholder="Descrição da fatura (opcional)"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" onClick={handleNewInvoiceSubmit}>
                Criar Fatura
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminInvoices;
