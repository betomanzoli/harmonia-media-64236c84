import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download, Filter, Printer, Calendar, Search, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
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
import { format } from 'date-fns';

interface Invoice {
  id: string;
  clientName: string;
  clientId: string;
  value: string;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  dueDate: string;
  projectId: string;
  hasDocument: boolean;
}

const AdminInvoices: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  const [invoices] = useState<Invoice[]>([
    { 
      id: 'FAT-2023-001',
      clientName: 'João Silva',
      clientId: 'CLI-001',
      value: 'R$ 997,00',
      status: 'paid',
      date: '10/04/2023',
      dueDate: '17/04/2023',
      projectId: 'HAR-2023-001',
      hasDocument: true
    },
    { 
      id: 'FAT-2023-002',
      clientName: 'Maria Oliveira',
      clientId: 'CLI-002',
      value: 'R$ 1.497,00',
      status: 'pending',
      date: '15/04/2023',
      dueDate: '22/04/2023',
      projectId: 'HAR-2023-002',
      hasDocument: true
    },
    { 
      id: 'FAT-2023-003',
      clientName: 'Carlos Santos',
      clientId: 'CLI-003',
      value: 'R$ 2.997,00',
      status: 'overdue',
      date: '20/04/2023',
      dueDate: '27/04/2023',
      projectId: 'HAR-2023-003',
      hasDocument: false
    }
  ]);

  const handleGenerateReport = () => {
    toast({
      title: "Gerando relatório",
      description: "O relatório de faturas está sendo gerado e estará disponível em breve."
    });
    
    // Simulate report generation
    setTimeout(() => {
      const today = format(new Date(), 'dd-MM-yyyy');
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('download', `relatorio-faturas-${today}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Relatório gerado",
        description: "O relatório de faturas foi gerado com sucesso."
      });
    }, 2000);
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    if (!invoice.hasDocument) {
      setSelectedInvoice(invoice);
      return;
    }
    
    toast({
      title: "Preparando impressão",
      description: `Preparando a impressão da fatura ${invoice.id}`
    });
    
    // Simulate print preparation
    setTimeout(() => {
      // In a real app, this would open a print dialog
      window.print();
      
      toast({
        title: "Fatura enviada para impressão",
        description: `A fatura ${invoice.id} foi enviada para impressão.`
      });
    }, 1000);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    if (!invoice.hasDocument) {
      setSelectedInvoice(invoice);
      return;
    }
    
    toast({
      title: "Preparando download",
      description: `Preparando o download da fatura ${invoice.id}`
    });
    
    // Simulate download preparation
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('download', `fatura-${invoice.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download concluído",
        description: `A fatura ${invoice.id} foi baixada com sucesso.`
      });
    }, 1000);
  };

  const filteredInvoices = invoices.filter(invoice => {
    // Filtrar por termo de pesquisa
    const matchesSearch = searchTerm === '' || 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.projectId.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por status
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid':
        return (
          <Badge className="bg-green-500">
            Pago
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500">
            Pendente
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-red-500">
            Atrasado
          </Badge>
        );
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">Faturas</h1>
            <p className="text-muted-foreground">
              Gerencie as faturas emitidas para os clientes
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="border-harmonia-green text-harmonia-green hover:bg-harmonia-green/10"
            >
              <Link to="/admin-j28s7d1k/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Dashboard
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Card className="w-full sm:w-1/2">
            <CardHeader>
              <CardTitle className="text-lg">Filtrar Faturas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Pesquisar por ID ou cliente..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="w-full sm:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filtrar por status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="paid">Pago</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="overdue">Atrasado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="w-full sm:w-1/2">
            <CardHeader>
              <CardTitle className="text-lg">Relatórios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleGenerateReport}
                  className="w-full sm:w-auto bg-harmonia-green hover:bg-harmonia-green/90"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
                
                <Button variant="outline" className="w-full sm:w-auto">
                  <Calendar className="mr-2 h-4 w-4" />
                  Período Personalizado
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Faturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>Lista de faturas emitidas para os clientes</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Projeto</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Emissão</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          Nenhuma fatura encontrada com os filtros atuais
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{invoice.clientName}</div>
                            <div className="text-xs text-gray-500">{invoice.clientId}</div>
                          </TableCell>
                          <TableCell>{invoice.projectId}</TableCell>
                          <TableCell>{invoice.value}</TableCell>
                          <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                          <TableCell>{invoice.date}</TableCell>
                          <TableCell>{invoice.dueDate}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handlePrintInvoice(invoice)}
                                className={!invoice.hasDocument ? "text-gray-400" : ""}
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDownloadInvoice(invoice)}
                                className={!invoice.hasDocument ? "text-gray-400" : ""}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Alert dialog for missing documents */}
      <AlertDialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Documento não disponível
            </AlertDialogTitle>
            <AlertDialogDescription>
              O documento para a fatura {selectedInvoice?.id} ainda não foi gerado. Você precisa gerar o documento antes de imprimi-lo ou baixá-lo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-harmonia-green hover:bg-harmonia-green/90"
              onClick={() => {
                toast({
                  title: "Gerando documento",
                  description: `O documento para a fatura ${selectedInvoice?.id} será gerado em breve.`
                });
                setSelectedInvoice(null);
              }}
            >
              Gerar Documento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminInvoices;
