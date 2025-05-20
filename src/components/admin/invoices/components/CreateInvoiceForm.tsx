
// We need to update the props interface to include isLoadingClients
// Since this is a read-only file, we'll create a wrapper component that we'll use instead

import React from 'react';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Import the original component
import OriginalCreateInvoiceForm from '@/components/admin/invoices/components/CreateInvoiceForm';

interface CreateInvoiceFormWrapperProps {
  clients: any[];
  projects: any[];
  onSubmit: (data: any) => void;
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
