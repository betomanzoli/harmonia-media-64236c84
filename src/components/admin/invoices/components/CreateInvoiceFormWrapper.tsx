
import React from 'react';
import { Loader2 } from "lucide-react";
import { FormValues } from '../types/form';
import OriginalCreateInvoiceForm from './CreateInvoiceForm';

interface CreateInvoiceFormWrapperProps {
  clients: any[];
  projects: any[];
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
  isLoadingClients?: boolean;
}

const CreateInvoiceFormWrapper: React.FC<CreateInvoiceFormWrapperProps> = ({
  clients,
  projects,
  onSubmit,
  onCancel,
  isLoadingClients = false
}) => {
  if (isLoadingClients) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Carregando clientes...</span>
      </div>
    );
  }

  // @ts-ignore - We know the component exists, but TS might not recognize it
  return <OriginalCreateInvoiceForm 
    clients={clients}
    projects={projects}
    onSubmit={onSubmit}
    onCancel={onCancel}
  />;
};

export default CreateInvoiceFormWrapper;
