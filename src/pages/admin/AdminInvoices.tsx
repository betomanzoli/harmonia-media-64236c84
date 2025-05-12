
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download, Eye, RefreshCcw, Trash2, Upload, FileText, FilePlus, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';

// Mock invoice data
const invoices = [
  {
    id: 'INV-2025-001',
    customer: 'João Silva',
    amount: 750.00,
    status: 'paid',
    date: '2025-03-15',
    dueDate: '2025-04-15',
    projectId: 'HAR-2025-0001',
    hasReceipt: false
  },
  {
    id: 'INV-2025-002',
    customer: 'Maria Oliveira',
    amount: 1250.00,
    status: 'paid',
    date: '2025-03-20',
    dueDate: '2025-04-20',
    projectId: 'HAR-2025-0002',
    hasReceipt: true
  },
  {
    id: 'INV-2025-003',
    customer: 'Carlos Santos',
    amount: 450.00,
    status: 'pending',
    date: '2025-04-01',
    dueDate: '2025-05-01',
    projectId: 'HAR-2025-0003',
    hasReceipt: false
  },
  {
    id: 'INV-2025-004',
    customer: 'Ana Ferreira',
    amount: 450.00,
    status: 'pending',
    date: '2025-04-05',
    dueDate: '2025-05-05',
    projectId: 'HAR-2025-0004',
    hasReceipt: false
  },
  {
    id: 'INV-2025-005',
    customer: 'Pedro Costa',
    amount: 750.00,
    status: 'overdue',
    date: '2025-02-20',
    dueDate: '2025-03-20',
    projectId: 'HAR-2025-0005',
    hasReceipt: false
  }
];

const AdminInvoices: React.FC = () => {
  const { toast } = useToast();
  const [invoicesList, setInvoicesList] = useState(invoices);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paga</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pendente</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Vencida</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const handleDelete = (invoiceId: string) => {
    setInvoicesList(invoicesList.filter(invoice => invoice.id !== invoiceId));
    toast({
      title: "Fatura excluída",
      description: `A fatura ${invoiceId} foi excluída com sucesso.`
    });
  };

  const handleUploadReceipt = (invoice: any) => {
    setSelectedInvoice(invoice);
    setUploadDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = () => {
    if (!receiptFile || !selectedInvoice) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo para fazer upload.",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, this would upload the file to Google Drive or another storage
    setInvoicesList(invoicesList.map(invoice => 
      invoice.id === selectedInvoice.id 
        ? { ...invoice, hasReceipt: true }
        : invoice
    ));

    toast({
      title: "Nota fiscal anexada",
      description: `Nota fiscal para ${selectedInvoice.id} foi anexada com sucesso como "${selectedInvoice.projectId}_NF.pdf".`
    });

    // Reset form and close dialog
    setReceiptFile(null);
    setSelectedInvoice(null);
    setUploadDialogOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Faturas</h1>
            <p className="text-muted-foreground">Gerencie as faturas e pagamentos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin-j28s7d1k/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Dashboard
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
            <Button size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Faturas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>NF</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoicesList.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.projectId}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{formatDate(invoice.date)}</TableCell>
                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      {invoice.hasReceipt ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          <FileText className="h-3 w-3 mr-1" />
                          Anexada
                        </Badge>
                      ) : invoice.status === 'paid' ? (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                          <Upload className="h-3 w-3 mr-1" />
                          Pendente
                        </Badge>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Visualizar</span>
                        </Button>
                        {invoice.status === 'paid' && !invoice.hasReceipt && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-amber-500 hover:text-amber-700 hover:bg-amber-50"
                            onClick={() => handleUploadReceipt(invoice)}
                          >
                            <Receipt className="h-4 w-4" />
                            <span className="sr-only">Anexar NF</span>
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso excluirá permanentemente a fatura {invoice.id}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(invoice.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Invoice Receipt Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Anexar Nota Fiscal</DialogTitle>
              <DialogDescription>
                {selectedInvoice && (
                  <>
                    Faça upload da nota fiscal para a fatura {selectedInvoice.id} do projeto {selectedInvoice.projectId}.
                    O arquivo será salvo no Google Drive com o nome "{selectedInvoice.projectId}_NF.pdf".
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="receipt" className="text-right">
                  Arquivo NF
                </Label>
                <div className="col-span-3">
                  <Input
                    id="receipt"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              {receiptFile && (
                <div className="bg-muted p-2 rounded-md">
                  <p className="text-sm flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    {receiptFile.name} ({(receiptFile.size / 1024).toFixed(2)} KB)
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                type="button" 
                className="bg-harmonia-green hover:bg-harmonia-green/90"
                onClick={handleUploadSubmit}
              >
                <Upload className="h-4 w-4 mr-2" />
                Enviar Nota Fiscal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminInvoices;
