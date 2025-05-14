
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, X, MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Invoice, Project } from '../types';

interface InvoiceTableProps {
  invoices: Invoice[];
  loading: boolean;
  projects: Project[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoiceId: string) => void;
  onViewPdf: (pdfUrl: string) => void;
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Pago</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Vencido</Badge>;
      default:
        return <Badge>{status}</Badge>;
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
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell>
                  {invoice.has_receipt ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-gray-400" />
                  )}
                </TableCell>
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
                      {invoice.invoice_pdf && (
                        <DropdownMenuItem onClick={() => onViewPdf(invoice.invoice_pdf!)}>
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
                        onClick={() => onDelete(invoice.id)}
                      >
                        <span className="mr-2">🗑️</span>
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
  );
};

export default InvoiceTable;
