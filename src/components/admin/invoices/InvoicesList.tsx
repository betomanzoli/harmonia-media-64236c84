
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Edit, Trash2, Download, FilePdf, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useSupabaseData } from '@/hooks/use-supabase-data';

interface Invoice {
  id: string;
  client: string;
  description?: string;
  amount: string;
  date: string;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  has_receipt: boolean;
  invoice_pdf?: string;
  client_id?: string;
  project_id?: string;
}

const InvoicesList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showNewInvoiceDialog, setShowNewInvoiceDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState({
    client: '',
    description: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    due_date: format(new Date(new Date().setDate(new Date().getDate() + 15)), 'yyyy-MM-dd'),
    status: 'pending',
    project_id: ''
  });
  const { toast } = useToast();

  // Fetch projects for dropdown
  const { data: projects } = useSupabaseData('projects', {
    orderBy: { column: 'created_at', ascending: false }
  });

  useEffect(() => {
    // Load invoices from localStorage or API
    const fetchInvoices = async () => {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          setInvoices(data as Invoice[]);
        }
      } catch (error) {
        console.error('Error loading invoices:', error);
        
        // Fallback to localStorage
        const storedInvoices = localStorage.getItem('harmonIA_invoices');
        if (storedInvoices) {
          setInvoices(JSON.parse(storedInvoices));
        }
      }
    };

    fetchInvoices();
  }, []);

  useEffect(() => {
    if (selectedInvoice && showEditDialog) {
      setFormData({
        client: selectedInvoice.client,
        description: selectedInvoice.description || '',
        amount: selectedInvoice.amount,
        date: format(new Date(selectedInvoice.date), 'yyyy-MM-dd'),
        due_date: format(new Date(selectedInvoice.due_date), 'yyyy-MM-dd'),
        status: selectedInvoice.status,
        project_id: selectedInvoice.project_id || ''
      });
    }
  }, [selectedInvoice, showEditDialog]);

  const saveInvoices = (updatedInvoices: Invoice[]) => {
    localStorage.setItem('harmonIA_invoices', JSON.stringify(updatedInvoices));
    setInvoices(updatedInvoices);
  };

  const handleAddInvoice = async () => {
    try {
      const newInvoice = {
        client: formData.client,
        description: formData.description,
        amount: formData.amount,
        date: new Date(formData.date).toISOString(),
        due_date: new Date(formData.due_date).toISOString(),
        status: formData.status as 'pending' | 'paid' | 'overdue' | 'cancelled',
        has_receipt: false,
        project_id: formData.project_id || null
      };

      const { data, error } = await supabase
        .from('invoices')
        .insert([newInvoice])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setInvoices(prev => [data as Invoice, ...prev]);
      
      toast({
        title: "Fatura criada",
        description: `A fatura para ${formData.client} foi adicionada com sucesso.`
      });
      
      setShowNewInvoiceDialog(false);
      // Reset form data
      setFormData({
        client: '',
        description: '',
        amount: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        due_date: format(new Date(new Date().setDate(new Date().getDate() + 15)), 'yyyy-MM-dd'),
        status: 'pending',
        project_id: ''
      });
    } catch (error) {
      console.error('Error adding invoice:', error);
      toast({
        title: "Erro ao criar fatura",
        description: "Não foi possível adicionar a fatura. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleEditInvoice = async () => {
    if (!selectedInvoice) return;

    try {
      const updatedInvoice = {
        client: formData.client,
        description: formData.description,
        amount: formData.amount,
        date: new Date(formData.date).toISOString(),
        due_date: new Date(formData.due_date).toISOString(),
        status: formData.status as 'pending' | 'paid' | 'overdue' | 'cancelled',
        project_id: formData.project_id || null
      };

      const { error } = await supabase
        .from('invoices')
        .update(updatedInvoice)
        .eq('id', selectedInvoice.id);

      if (error) throw error;

      // Update local state
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === selectedInvoice.id 
            ? { ...invoice, ...updatedInvoice }
            : invoice
        )
      );
      
      toast({
        title: "Fatura atualizada",
        description: `A fatura para ${formData.client} foi atualizada com sucesso.`
      });
      
      setShowEditDialog(false);
      setSelectedInvoice(null);
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast({
        title: "Erro ao atualizar fatura",
        description: "Não foi possível atualizar a fatura. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteInvoice = async () => {
    if (!selectedInvoice) return;

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', selectedInvoice.id);

      if (error) throw error;

      // Update local state
      setInvoices(prev => prev.filter(invoice => invoice.id !== selectedInvoice.id));
      
      toast({
        title: "Fatura excluída",
        description: `A fatura foi excluída com sucesso.`,
        variant: "destructive"
      });
      
      setShowDeleteDialog(false);
      setSelectedInvoice(null);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast({
        title: "Erro ao excluir fatura",
        description: "Não foi possível excluir a fatura. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleMarkAsPaid = async (invoice: Invoice) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status: 'paid' })
        .eq('id', invoice.id);

      if (error) throw error;

      // Update local state
      setInvoices(prev => 
        prev.map(inv => 
          inv.id === invoice.id 
            ? { ...inv, status: 'paid' }
            : inv
        )
      );
      
      toast({
        title: "Status atualizado",
        description: `A fatura foi marcada como paga.`
      });
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da fatura.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Pago</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Atrasado</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Function to get project code by ID
  const getProjectCode = (projectId: string | undefined) => {
    if (!projectId || !projects) return "N/A";
    const project = projects.find(p => p.id === projectId);
    return project ? project.id : "N/A";
  };

  // Get project name by ID for display
  const getProjectName = (projectId: string | undefined) => {
    if (!projectId || !projects) return "";
    const project = projects.find(p => p.id === projectId);
    return project ? `${project.title}` : "";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Faturas</h2>
        <Button onClick={() => setShowNewInvoiceDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Fatura
        </Button>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Projeto</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Nenhuma fatura encontrada.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>{getProjectCode(invoice.project_id)}</TableCell>
                  <TableCell>{invoice.description || "—"}</TableCell>
                  <TableCell>R$ {invoice.amount}</TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell>{formatDate(invoice.due_date)}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {invoice.status === 'pending' && (
                          <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice)}>
                            <Check className="mr-2 h-4 w-4" />
                            Marcar como Pago
                          </DropdownMenuItem>
                        )}
                        {invoice.invoice_pdf && (
                          <DropdownMenuItem>
                            <a 
                              href={invoice.invoice_pdf} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center w-full"
                            >
                              <FilePdf className="mr-2 h-4 w-4" />
                              Ver PDF
                            </a>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowDeleteDialog(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* New Invoice Dialog */}
      <Dialog open={showNewInvoiceDialog} onOpenChange={setShowNewInvoiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Fatura</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium" htmlFor="client">
                Nome do Cliente
              </label>
              <input
                id="client"
                name="client"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="Nome do cliente"
                value={formData.client}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="project_id">
                Projeto
              </label>
              <select
                id="project_id"
                name="project_id"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.project_id}
                onChange={handleChange}
              >
                <option value="">Selecione um projeto</option>
                {projects && projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.id} - {project.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="description">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="Descrição da fatura"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="amount">
                Valor (R$)
              </label>
              <input
                id="amount"
                name="amount"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="Valor em reais (ex: 1500.00)"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium" htmlFor="date">
                  Data de Emissão
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="due_date">
                  Data de Vencimento
                </label>
                <input
                  id="due_date"
                  name="due_date"
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.due_date}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">Pendente</option>
                <option value="paid">Pago</option>
                <option value="overdue">Atrasado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowNewInvoiceDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddInvoice}>Criar Fatura</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Invoice Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Fatura</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium" htmlFor="edit-client">
                Nome do Cliente
              </label>
              <input
                id="edit-client"
                name="client"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="Nome do cliente"
                value={formData.client}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="edit-project_id">
                Projeto
              </label>
              <select
                id="edit-project_id"
                name="project_id"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.project_id || ''}
                onChange={handleChange}
              >
                <option value="">Selecione um projeto</option>
                {projects && projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.id} - {project.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="edit-description">
                Descrição
              </label>
              <textarea
                id="edit-description"
                name="description"
                className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="Descrição da fatura"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="edit-amount">
                Valor (R$)
              </label>
              <input
                id="edit-amount"
                name="amount"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="Valor em reais (ex: 1500.00)"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium" htmlFor="edit-date">
                  Data de Emissão
                </label>
                <input
                  id="edit-date"
                  name="date"
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="edit-due_date">
                  Data de Vencimento
                </label>
                <input
                  id="edit-due_date"
                  name="due_date"
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.due_date}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="edit-status">
                Status
              </label>
              <select
                id="edit-status"
                name="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">Pendente</option>
                <option value="paid">Pago</option>
                <option value="overdue">Atrasado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditInvoice}>Salvar Alterações</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a fatura para "{selectedInvoice?.client}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteInvoice}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvoicesList;
