
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSupabaseData } from '@/hooks/use-supabase-data';
import { PlusCircle, Pencil, Trash2, FileText, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface Client {
  id: string;
  name: string;
  email: string;
}

interface Invoice {
  id: string;
  client: string;
  client_id: string;
  amount: string;
  status: string;
  date?: string;
  due_date: string;
  invoice_pdf?: string;
  has_receipt: boolean;
  description?: string;
  created_at?: string;
}

export default function InvoicesList() {
  const { data: invoices, isLoading, addItem, updateItem, deleteItem } = useSupabaseData<Invoice>('invoices', {
    orderBy: { column: 'created_at', ascending: false }
  });
  
  const { data: clients } = useSupabaseData<Client>('clients', {
    orderBy: { column: 'name', ascending: true }
  });
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewInvoiceDialogOpen, setIsViewInvoiceDialogOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState<Partial<Invoice>>({
    client: '',
    client_id: '',
    amount: '',
    status: 'pending',
    due_date: '',
    invoice_pdf: '',
    has_receipt: false,
    description: ''
  });
  
  const { toast } = useToast();
  
  const statusTypes = [
    { value: 'pending', label: 'Pendente' },
    { value: 'paid', label: 'Pago' },
    { value: 'overdue', label: 'Atrasado' },
    { value: 'canceled', label: 'Cancelado' }
  ];

  const handleAddInvoice = async () => {
    if (!formData.client_id || !formData.amount || !formData.due_date) {
      toast({
        title: "Campos obrigatórios",
        description: "Cliente, valor e data de vencimento são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Get client name from the selected client_id
    const selectedClient = clients.find(c => c.id === formData.client_id);
    if (!selectedClient) return;

    await addItem({
      ...formData,
      client: selectedClient.name,
      has_receipt: formData.has_receipt || false
    });
    
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleUpdateInvoice = async () => {
    if (!formData.client_id || !formData.amount || !formData.due_date) {
      toast({
        title: "Campos obrigatórios",
        description: "Cliente, valor e data de vencimento são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Get client name from the selected client_id if it was changed
    if (formData.client_id !== currentInvoice?.client_id) {
      const selectedClient = clients.find(c => c.id === formData.client_id);
      if (selectedClient) {
        formData.client = selectedClient.name;
      }
    }

    if (currentInvoice) {
      await updateItem(currentInvoice.id, formData);
      setIsEditDialogOpen(false);
      resetForm();
    }
  };

  const handleDeleteInvoice = async () => {
    if (currentInvoice) {
      await deleteItem(currentInvoice.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setFormData({
      client: invoice.client,
      client_id: invoice.client_id,
      amount: invoice.amount,
      status: invoice.status,
      due_date: invoice.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : '',
      invoice_pdf: invoice.invoice_pdf || '',
      has_receipt: invoice.has_receipt,
      description: invoice.description || ''
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setIsDeleteDialogOpen(true);
  };

  const openViewInvoiceDialog = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setIsViewInvoiceDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      client: '',
      client_id: '',
      amount: '',
      status: 'pending',
      due_date: '',
      invoice_pdf: '',
      has_receipt: false,
      description: ''
    });
    setCurrentInvoice(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, label: string }> = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pendente" },
      paid: { color: "bg-green-100 text-green-800", label: "Pago" },
      overdue: { color: "bg-red-100 text-red-800", label: "Atrasado" },
      canceled: { color: "bg-gray-100 text-gray-800", label: "Cancelado" }
    };

    const statusInfo = statusMap[status] || { color: "bg-gray-100 text-gray-800", label: status };

    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
      {statusInfo.label}
    </span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Faturas</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Fatura
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Carregando faturas...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Vencimento</TableHead>
              <TableHead>Nota Fiscal</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[120px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Nenhuma fatura cadastrada
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>R$ {invoice.amount}</TableCell>
                  <TableCell>
                    {getStatusBadge(invoice.status)}
                  </TableCell>
                  <TableCell>
                    {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    {invoice.has_receipt ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Check className="h-3 w-3 mr-1" /> Emitida
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        <X className="h-3 w-3 mr-1" /> Não emitida
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="truncate max-w-[200px]">
                    {invoice.description || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(invoice)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => openDeleteDialog(invoice)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {invoice.invoice_pdf && (
                        <Button variant="default" size="icon" onClick={() => openViewInvoiceDialog(invoice)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Add Invoice Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Fatura</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="client">Cliente*</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('client_id', value)} 
                value={formData.client_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Valor*</Label>
              <Input id="amount" name="amount" value={formData.amount} onChange={handleInputChange} placeholder="0.00" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('status', value)} 
                value={formData.status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusTypes.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="due_date">Data de Vencimento*</Label>
              <Input 
                id="due_date" 
                name="due_date" 
                type="date" 
                value={formData.due_date} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="invoice_pdf">Link da Nota Fiscal (PDF)</Label>
              <Input 
                id="invoice_pdf" 
                name="invoice_pdf" 
                value={formData.invoice_pdf} 
                onChange={handleInputChange} 
                placeholder="https://exemplo.com/nota-fiscal.pdf"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="has_receipt" 
                checked={formData.has_receipt} 
                onCheckedChange={(value) => handleSwitchChange('has_receipt', value)} 
              />
              <Label htmlFor="has_receipt">Nota Fiscal Emitida</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                name="description" 
                rows={3} 
                value={formData.description} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddInvoice}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Invoice Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Fatura</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-client">Cliente*</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('client_id', value)} 
                value={formData.client_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Valor*</Label>
              <Input id="edit-amount" name="amount" value={formData.amount} onChange={handleInputChange} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('status', value)} 
                value={formData.status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusTypes.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-due_date">Data de Vencimento*</Label>
              <Input 
                id="edit-due_date" 
                name="due_date" 
                type="date" 
                value={formData.due_date} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-invoice_pdf">Link da Nota Fiscal (PDF)</Label>
              <Input 
                id="edit-invoice_pdf" 
                name="invoice_pdf" 
                value={formData.invoice_pdf} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="edit-has_receipt" 
                checked={formData.has_receipt} 
                onCheckedChange={(value) => handleSwitchChange('has_receipt', value)} 
              />
              <Label htmlFor="edit-has_receipt">Nota Fiscal Emitida</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea 
                id="edit-description" 
                name="description" 
                rows={3} 
                value={formData.description} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateInvoice}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Tem certeza que deseja excluir a fatura de {currentInvoice?.client}?</p>
            <p className="text-sm text-gray-500">Esta ação não pode ser desfeita.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteInvoice}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog open={isViewInvoiceDialogOpen} onOpenChange={setIsViewInvoiceDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nota Fiscal</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {currentInvoice?.invoice_pdf ? (
              <div className="aspect-ratio">
                <iframe 
                  src={currentInvoice.invoice_pdf} 
                  className="w-full h-[500px]" 
                  title="Nota Fiscal"
                ></iframe>
              </div>
            ) : (
              <p className="text-center">Nenhum arquivo PDF disponível.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewInvoiceDialogOpen(false)}>Fechar</Button>
            {currentInvoice?.invoice_pdf && (
              <Button asChild>
                <a href={currentInvoice.invoice_pdf} target="_blank" rel="noopener noreferrer">
                  Abrir em Nova Aba
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
