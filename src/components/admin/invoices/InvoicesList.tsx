
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import InvoiceTable from './components/InvoiceTable';
import CreateInvoiceForm from './components/CreateInvoiceForm';
import DeleteInvoiceDialog from './components/DeleteInvoiceDialog';
import { useInvoices } from './hooks/useInvoices';

const InvoicesList: React.FC = () => {
  const {
    invoices,
    clients,
    projects,
    isLoading,
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

  // Wrapper functions to match expected signatures
  const handleEdit = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      handleEditInvoice(invoice);
    }
  };

  const handleDelete = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      handleDeleteClick(invoice);
    }
  };

  const handleViewPdfWrapper = (pdfUrl: string) => {
    // Find invoice by PDF URL or handle differently based on your needs
    const invoice = invoices.find(inv => inv.invoice_pdf === pdfUrl);
    if (invoice) {
      handleViewPdf(invoice);
    } else {
      // Handle case where we only have the PDF URL
      window.open(pdfUrl, '_blank');
    }
  };

  const handleDownloadWrapper = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      handleDownloadInvoice(invoice);
    }
  };

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
        loading={isLoading}
        projects={projects}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewPdf={handleViewPdfWrapper}
        onDownload={handleDownloadWrapper}
      />

      {/* Create invoice dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Nova Fatura</DialogTitle>
          </DialogHeader>
          <CreateInvoiceForm 
            clients={clients}
            projects={projects}
            onSubmit={handleCreateInvoice}
            onCancel={() => setShowCreateDialog(false)}
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
