
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download, Filter, Printer, Calendar, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

const AdminInvoices: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [invoices] = useState([
    { 
      id: 'FAT-2023-001',
      clientName: 'João Silva',
      value: 'R$ 997,00',
      status: 'paid',
      date: '10/04/2023'
    },
    { 
      id: 'FAT-2023-002',
      clientName: 'Maria Oliveira',
      value: 'R$ 1.497,00',
      status: 'pending',
      date: '15/04/2023'
    },
    { 
      id: 'FAT-2023-003',
      clientName: 'Carlos Santos',
      value: 'R$ 2.997,00',
      status: 'overdue',
      date: '20/04/2023'
    }
  ]);

  const handleGenerateReport = () => {
    toast({
      title: "Gerando relatório",
      description: "O relatório de faturas está sendo gerado e estará disponível em breve."
    });
  };

  const handlePrintInvoice = (id: string) => {
    toast({
      title: "Imprimir fatura",
      description: `A impressão da fatura ${id} será implementada em breve.`
    });
  };

  const handleDownloadInvoice = (id: string) => {
    toast({
      title: "Download de fatura",
      description: `O download da fatura ${id} será implementado em breve.`
    });
  };

  const filteredInvoices = invoices.filter(invoice => {
    // Filtrar por termo de pesquisa
    const matchesSearch = searchTerm === '' || 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
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
            <Table>
              <TableCaption>Lista de faturas emitidas para os clientes</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.clientName}</TableCell>
                    <TableCell>{invoice.value}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePrintInvoice(invoice.id)}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminInvoices;
