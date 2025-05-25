
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, X } from 'lucide-react';
import { Invoice, Project } from '../types';
import InvoiceActionMenu from './InvoiceActionMenu';
import { StatusBadge } from '@/components/ui/status-badge';

interface InvoiceTableProps {
  invoices: Invoice[];
  loading: boolean;
  projects: Project[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  onViewPdf: (invoice: Invoice) => void;
  onDownload: (invoice: Invoice) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ 
  invoices, 
  loading, 
  projects,
  onEdit, 
  onDelete,
  onViewPdf,
  onDownload
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const getProjectName = (projectId: string | undefined) => {
    if (!projectId) return "N/A";
    const project = projects.find(p => p.id === projectId);
    return project ? project.title : "N/A";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Projeto</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Emissão</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Recibo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                Carregando faturas...
              </TableCell>
            </TableRow>
          ) : invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                Nenhuma fatura encontrada
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id.slice(0, 8)}</TableCell>
                <TableCell>{invoice.client}</TableCell>
                <TableCell>{getProjectName(invoice.project_id)}</TableCell>
                <TableCell>R$ {invoice.amount}</TableCell>
                <TableCell>{formatDate(invoice.date)}</TableCell>
                <TableCell>{formatDate(invoice.due_date)}</TableCell>
                <TableCell>
                  <StatusBadge status={invoice.status} size="sm" />
                </TableCell>
                <TableCell>
                  {invoice.has_receipt ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-gray-400" />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <InvoiceActionMenu
                    invoice={invoice}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onViewPdf={onViewPdf}
                    onDownload={onDownload}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceTable;
