
import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Invoice } from '../types';

interface InvoiceActionMenuProps {
  invoice: Invoice;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  onViewPdf: (invoice: Invoice) => void;
  onDownload: (invoice: Invoice) => void;
}

const InvoiceActionMenu: React.FC<InvoiceActionMenuProps> = ({ 
  invoice, 
  onEdit, 
  onDelete,
  onViewPdf,
  onDownload 
}) => {
  return (
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
        {invoice.invoice_pdf && (
          <DropdownMenuItem onClick={() => onViewPdf(invoice)}>
            <span className="mr-2">📄</span>
            Ver fatura
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onEdit(invoice)}>
          <span className="mr-2">✏️</span>
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDownload(invoice)}>
          <span className="mr-2">⬇️</span>
          Baixar
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-600"
          onClick={() => onDelete(invoice)}
        >
          <span className="mr-2">🗑️</span>
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InvoiceActionMenu;
