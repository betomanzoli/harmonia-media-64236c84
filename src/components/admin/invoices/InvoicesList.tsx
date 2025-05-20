
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import InvoiceTable from './components/InvoiceTable';
import CreateInvoiceFormWrapper from './components/CreateInvoiceFormWrapper';
import DeleteInvoiceDialog from './components/DeleteInvoiceDialog';
import { useInvoices } from './hooks/useInvoices';
import { supabase } from '@/lib/supabase';

const InvoicesList: React.FC = () => {
  const {
    invoices,
    clients,
    projects,
    loading,
    showCreateDialog,
    showDeleteDialog,
    setShowCreateDialog,
    setShowDeleteDialog,
    handleCreateInvoice,
    handleDeleteInvoice,
    handleDeleteClick,
    handleEditInvoice,
    handleViewPdf,
    handleDownloadInvoice
  } = useInvoices();

  const [existingClients, setExistingClients] = useState<any[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);

  // Fetch existing clients from Supabase
  useEffect(() => {
    const fetchClients = async () => {
      setLoadingClients(true);
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) throw error;
        setExistingClients(data || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Faturas</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Fatura
        </Button>
      </div>

      <InvoiceTable 
        invoices={invoices}
        loading={loading}
        projects={projects}
        onEdit={handleEditInvoice}
        onDelete={handleDeleteClick}
        onViewPdf={handleViewPdf}
        onDownload={handleDownloadInvoice}
      />

      {/* Create invoice dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Nova Fatura</DialogTitle>
          </DialogHeader>
          <CreateInvoiceFormWrapper 
            clients={existingClients.length > 0 ? existingClients : clients}
            projects={projects}
            onSubmit={handleCreateInvoice}
            onCancel={() => setShowCreateDialog(false)}
            isLoadingClients={loadingClients}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <DeleteInvoiceDialog 
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteInvoice}
      />
    </div>
  );
};

export default InvoicesList;
