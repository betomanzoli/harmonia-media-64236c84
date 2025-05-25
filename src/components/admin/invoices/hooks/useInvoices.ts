
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Invoice {
  id: string;
  client: string;
  amount: string;
  date: string;
  due_date: string;
  status: string;
  description: string;
  client_id: string;
  has_receipt: boolean;
  invoice_pdf?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
}

export interface Project {
  id: string;
  title: string;
  client_id: string;
}

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();

  const loadInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedInvoices: Invoice[] = (data || []).map((item: any) => ({
        id: String(item.id || ''),
        client: String(item.client || ''),
        amount: String(item.amount || '0'),
        date: String(item.date || new Date().toISOString().split('T')[0]),
        due_date: String(item.due_date || new Date().toISOString().split('T')[0]),
        status: String(item.status || 'pending'),
        description: String(item.description || ''),
        client_id: String(item.client_id || ''),
        has_receipt: Boolean(item.has_receipt || false),
        invoice_pdf: item.invoice_pdf ? String(item.invoice_pdf) : undefined
      }));

      setInvoices(mappedInvoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
      setInvoices([]);
    }
  };

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');

      if (error) throw error;

      const mappedClients: Client[] = (data || []).map((item: any) => ({
        id: String(item.id || ''),
        name: String(item.name || ''),
        email: String(item.email || '')
      }));

      setClients(mappedClients);
    } catch (error) {
      console.error('Error loading clients:', error);
      setClients([]);
    }
  };

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('title');

      if (error) throw error;

      const mappedProjects: Project[] = (data || []).map((item: any) => ({
        id: String(item.id || ''),
        title: String(item.title || ''),
        client_id: String(item.client_id || '')
      }));

      setProjects(mappedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    }
  };

  const handleCreateInvoice = async (invoiceData: Partial<Invoice>) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select();

      if (error) throw error;

      toast({
        title: "Fatura criada",
        description: "A fatura foi criada com sucesso."
      });

      await loadInvoices();
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Erro ao criar fatura",
        description: "Não foi possível criar a fatura.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDeleteDialog(true);
  };

  const handleDeleteInvoice = async () => {
    if (!selectedInvoice) return;

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', selectedInvoice.id);

      if (error) throw error;

      toast({
        title: "Fatura excluída",
        description: "A fatura foi excluída com sucesso."
      });

      await loadInvoices();
      setShowDeleteDialog(false);
      setSelectedInvoice(null);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast({
        title: "Erro ao excluir fatura",
        description: "Não foi possível excluir a fatura.",
        variant: "destructive"
      });
    }
  };

  const handleEditInvoice = (invoice: Invoice) => {
    console.log('Edit invoice:', invoice);
    // TODO: Implement edit functionality
  };

  const handleViewPdf = (invoice: Invoice) => {
    console.log('View PDF for invoice:', invoice);
    // TODO: Implement PDF view functionality
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    console.log('Download invoice:', invoice);
    // TODO: Implement download functionality
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([loadInvoices(), loadClients(), loadProjects()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    invoices,
    clients,
    projects,
    isLoading,
    loading: isLoading, // Alias for backward compatibility
    showCreateDialog,
    showDeleteDialog,
    setShowCreateDialog,
    setShowDeleteDialog,
    handleCreateInvoice,
    handleDeleteInvoice,
    handleDeleteClick,
    handleEditInvoice,
    handleViewPdf,
    handleDownloadInvoice,
    loadInvoices,
    loadClients,
    loadProjects
  };
};
