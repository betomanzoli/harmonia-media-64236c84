
import React, { useState } from 'react';
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
import { Search, Download, ArrowUpDown, DollarSign, Filter, Plus, MoreHorizontal, Pencil, Trash2, FileText, Eye, Link as LinkIcon } from 'lucide-react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseData } from '@/hooks/use-supabase-data';

interface Invoice {
  id: string;
  client: string;
  client_id?: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  due_date: string;
  invoice_pdf?: string;
  has_receipt?: boolean;
  description?: string;
  created_at?: string;
}

const AdminInvoices: React.FC = () => {
  const { data: invoices, isLoading, addItem, updateItem, deleteItem } = useSupabaseData<Invoice>('invoices', {
    orderBy: { column: 'created_at', ascending: false }
  });
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isNewInvoiceDialogOpen, setIsNewInvoiceDialogOpen] = useState(false);
  const [isEditInvoiceDialogOpen, setIsEditInvoiceDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [newInvoice, setNewInvoice] = useState({
    client: '',
    amount: '',
    due_date: '',
    description: '',
    invoice_pdf: ''
  });
  const { toast } = useToast();
  
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
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  
  const pendingAmount = invoices
    .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((sum, inv) => {
      const amount = parseFloat(inv.amount.replace('R$ ', '').replace('.', '').replace(',', '.'));
      return sum + (isNaN(amount) ? 0 : amount);
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
  
  const handleNewInvoiceSubmit = async () => {
    // Validar campos obrigatórios
    if (!newInvoice.client || !newInvoice.amount || !newInvoice.due_date) {
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
    const currentDate = new Date().toISOString();
    await addItem({
      client: newInvoice.client,
      amount: amountValue,
      status: 'pending',
      date: currentDate,
      due_date: new Date(newInvoice.due_date).toISOString(),
      description: newInvoice.description,
      invoice_pdf: newInvoice.invoice_pdf,
      has_receipt: false
    });
    
    // Fechar o diálogo e resetar o formulário
    setIsNewInvoiceDialogOpen(false);
    setNewInvoice({
      client: '',
      amount: '',
      due_date: '',
      description: '',
      invoice_pdf: ''
    });
  };
  
  const handleEditClick = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setIsEditInvoiceDialogOpen(true);
  };

  const handlePdfClick = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setIsPdfDialogOpen(true);
  };

  const handleDeleteClick = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setIsDeleteDialogOpen(true);
  };

  const handleEditInvoiceChange = (field: string, value: string) => {
    if (!currentInvoice) return;

    setCurrentInvoice({
      ...currentInvoice,
      [field]: value
    });
  };

  const handleEditInvoiceSubmit = async () => {
    if (!currentInvoice) return;

    // Validar campos obrigatórios
    if (!currentInvoice.client || !currentInvoice.amount || !currentInvoice.due_date) {
      toast({
        title: "Campos obrigatórios",
        description: "Cliente, valor e data de vencimento são campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // Atualizar fatura
    await updateItem(currentInvoice.id, {
      client: currentInvoice.client,
      amount: currentInvoice.amount,
      status: currentInvoice.status,
      due_date: currentInvoice.due_date,
      description: currentInvoice.description,
      invoice_pdf: currentInvoice.invoice_pdf,
      has_receipt: currentInvoice.has_receipt
    });
    
    // Fechar o diálogo
    setIsEditInvoiceDialogOpen(false);
    setCurrentInvoice(null);
  };

  const handlePdfUpdate = async () => {
    if (!currentInvoice) return;
    
    // Atualizar PDF da fatura
    await updateItem(currentInvoice.id, {
      invoice_pdf: currentInvoice.invoice_pdf,
      has_receipt: !!currentInvoice.invoice_pdf
    });
    
    toast({
      title: "PDF atualizado",
      description: "O link do PDF da fatura foi atualizado com sucesso."
    });
    
    // Fechar o diálogo
    setIsPdfDialogOpen(false);
    setCurrentInvoice(null);
  };

  const handleDeleteConfirm = async () => {
    if (!currentInvoice) return;
    
    await deleteItem(currentInvoice.id);
    
    setIsDeleteDialogOpen(false);
    setCurrentInvoice(null);
  };
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      return dateStr;
    }
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
                {isLoading 
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
              <span className="h-4 w-4 text-muted-foreground">
                {isLoading ? '' : invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue').length}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading 
                  ? '...'
                  : `R$ ${pendingAmount.toFixed(2).replace('.', ',')}`}
              </div>
              <p className="text-xs text-muted-foreground">
                {invoices.filter(inv => inv.status === 'overdue').length} faturas vencidas
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
                {isLoading ? '...' : 
                  invoices.length > 0 ? 
                  `${Math.round((invoices.filter(inv => inv.status === 'paid').length / invoices.length) * 100)}%` : 
                  '0%'}
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
            
            {isLoading ? (
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
                      <TableHead>NF</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id.substring(0, 6)}</TableCell>
                        <TableCell>{invoice.client}</TableCell>
                        <TableCell>{formatDate(invoice.date)}</TableCell>
                        <TableCell>{formatDate(invoice.due_date)}</TableCell>
                        <TableCell className="text-right">{invoice.amount}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>
                          {invoice.has_receipt ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              <FileText className="mr-1 h-3 w-3" /> Gerada
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                              Pendente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handlePdfClick(invoice)}
                              title="Gerenciar PDF da NF"
                            >
                              <LinkIcon className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditClick(invoice)}
                              title="Editar fatura"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteClick(invoice)}
                              className="text-red-500 hover:text-red-700"
                              title="Excluir fatura"
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
                  value={newInvoice.due_date}
                  onChange={(e) => handleNewInvoiceChange('due_date', e.target.value)}
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
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="invoice-pdf" className="text-right">
                  Link do PDF
                </Label>
                <Input
                  id="invoice-pdf"
                  className="col-span-3"
                  value={newInvoice.invoice_pdf}
                  onChange={(e) => handleNewInvoiceChange('invoice_pdf', e.target.value)}
                  placeholder="URL do PDF da nota fiscal (opcional)"
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
        
        <Dialog open={isEditInvoiceDialogOpen} onOpenChange={setIsEditInvoiceDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Fatura</DialogTitle>
              <DialogDescription>
                Atualize os detalhes da fatura.
              </DialogDescription>
            </DialogHeader>
            
            {currentInvoice && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-invoice-client" className="text-right">
                    Cliente*
                  </Label>
                  <Input
                    id="edit-invoice-client"
                    className="col-span-3"
                    value={currentInvoice.client}
                    onChange={(e) => handleEditInvoiceChange('client', e.target.value)}
                    placeholder="Nome do cliente"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-invoice-amount" className="text-right">
                    Valor*
                  </Label>
                  <Input
                    id="edit-invoice-amount"
                    className="col-span-3"
                    value={currentInvoice.amount}
                    onChange={(e) => handleEditInvoiceChange('amount', e.target.value)}
                    placeholder="R$ 0,00"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-invoice-status" className="text-right">
                    Status
                  </Label>
                  <Select 
                    value={currentInvoice.status} 
                    onValueChange={(value: any) => handleEditInvoiceChange('status', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="paid">Pago</SelectItem>
                      <SelectItem value="overdue">Vencido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-invoice-due-date" className="text-right">
                    Vencimento*
                  </Label>
                  <Input
                    id="edit-invoice-due-date"
                    type="date"
                    className="col-span-3"
                    value={new Date(currentInvoice.due_date).toISOString().split('T')[0]}
                    onChange={(e) => handleEditInvoiceChange('due_date', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-invoice-description" className="text-right">
                    Descrição
                  </Label>
                  <Input
                    id="edit-invoice-description"
                    className="col-span-3"
                    value={currentInvoice.description || ''}
                    onChange={(e) => handleEditInvoiceChange('description', e.target.value)}
                    placeholder="Descrição da fatura (opcional)"
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button type="submit" onClick={handleEditInvoiceSubmit}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Gerenciar PDF da NF</DialogTitle>
              <DialogDescription>
                Adicione ou atualize o link do PDF da nota fiscal.
              </DialogDescription>
            </DialogHeader>
            
            {currentInvoice && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pdf-url" className="text-right">
                    Link do PDF
                  </Label>
                  <Input
                    id="pdf-url"
                    className="col-span-3"
                    value={currentInvoice.invoice_pdf || ''}
                    onChange={(e) => handleEditInvoiceChange('invoice_pdf', e.target.value)}
                    placeholder="URL do PDF da nota fiscal"
                  />
                </div>
                
                {currentInvoice.invoice_pdf && (
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={() => window.open(currentInvoice.invoice_pdf, '_blank')}
                      className="mt-2"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar PDF
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button type="submit" onClick={handlePdfUpdate}>
                Salvar PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Você tem certeza que deseja excluir esta fatura? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminInvoices;
