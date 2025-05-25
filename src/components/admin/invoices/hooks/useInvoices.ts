import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Invoice, Client, Project } from '../types';
import { FormValues } from '../components/CreateInvoiceForm';

export function useInvoices() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
    fetchClients();
    fetchProjects();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      // Type-safe mapping
      const typedInvoices: Invoice[] = (data || []).map((item: any) => ({
        id: item.id as string,
        client: item.client as string,
        amount: item.amount as string,
        date: item.date as string,
        due_date: item.due_date as string,
        status: item.status as string,
        description: item.description as string,
        client_id: item.client_id as string
      }));

      setInvoices(typedInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as faturas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, email')
        .order('name');

      if (error) throw error;

      // Type-safe mapping
      const typedClients: Client[] = (data || []).map((item: any) => ({
        id: item.id as string,
        name: item.name as string,
        email: item.email as string
      }));

      setClients(typedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, client_id');

      if (error) throw error;

      // Type-safe mapping
      const typedProjects: Project[] = (data || []).map((item: any) => ({
        id: item.id as string,
        title: item.title as string,
        client_id: item.client_id as string
      }));

      setProjects(typedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleCreateInvoice = async (values: FormValues) => {
    try {
      const selectedClient = clients.find(c => c.id === values.client_id);
      
      const { data, error } = await supabase
        .from('invoices')
        .insert([
          {
            client: selectedClient?.name || 'Cliente',
            client_id: values.client_id,
            project_id: values.project_id,
            description: values.description,
            amount: values.amount,
            due_date: values.due_date,
            status: 'pending'
          }
        ])
        .select();

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Fatura criada com sucesso',
      });

      setShowCreateDialog(false);
      fetchInvoices();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a fatura',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return;

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceToDelete);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Fatura excluída com sucesso',
      });

      fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a fatura',
        variant: 'destructive',
      });
    } finally {
      setShowDeleteDialog(false);
      setInvoiceToDelete(null);
    }
  };

  const handleDeleteClick = (invoiceId: string) => {
    setInvoiceToDelete(invoiceId);
    setShowDeleteDialog(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    // To be implemented - editing functionality
    console.log('Edit invoice:', invoice);
  };

  const handleViewPdf = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // To be implemented - download functionality
    console.log('Download invoice:', invoice);
  };

  return {
    invoices,
    clients,
    projects,
    loading,
    showCreateDialog,
    showDeleteDialog,
    invoiceToDelete,
    setShowCreateDialog,
    setShowDeleteDialog,
    setInvoiceToDelete,
    handleCreateInvoice,
    handleDeleteInvoice,
    handleDeleteClick,
    handleEditInvoice,
    handleViewPdf,
    handleDownloadInvoice
  };
}
