
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, RefreshCcw, Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import contractAcceptanceLogger from '@/services/contractAcceptanceLogger';

interface ContractLog {
  packageId: string;
  customerName: string;
  customerEmail: string;
  acceptanceDate: string;
  ipAddress?: string;
  userAgent?: string;
  contractVersion: string;
  source: string;
}

const ContractAcceptanceLogs: React.FC = () => {
  const [logs, setLogs] = useState<ContractLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const fetchedLogs = await contractAcceptanceLogger.getAllLogs();
      setLogs(fetchedLogs);
    } catch (error) {
      console.error('Error fetching contract logs:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLogs();
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getPackageBadge = (packageId: string) => {
    switch (packageId) {
      case 'essencial':
        return <Badge className="bg-blue-500">Essencial</Badge>;
      case 'profissional':
        return <Badge className="bg-purple-500">Profissional</Badge>;
      case 'premium':
        return <Badge className="bg-amber-500">Premium</Badge>;
      default:
        return <Badge>{packageId}</Badge>;
    }
  };
  
  const filteredLogs = logs.filter(log => 
    log.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.packageId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.source.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleExport = () => {
    try {
      // Create CSV content
      const headers = ["Package", "Customer Name", "Customer Email", "Acceptance Date", "IP Address", "Source", "Contract Version"];
      const csvContent = [
        headers.join(','),
        ...filteredLogs.map(log => [
          log.packageId,
          `"${log.customerName.replace(/"/g, '""')}"`, // Escape quotes
          log.customerEmail,
          log.acceptanceDate,
          log.ipAddress || 'N/A',
          log.source,
          log.contractVersion
        ].join(','))
      ].join('\n');
      
      // Create Blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `contract_acceptance_logs_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  };
  
  return (
    <Card className="shadow-md border-harmonia-green/20">
      <CardHeader className="bg-gradient-to-r from-harmonia-light-green to-harmonia-green/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CardTitle className="text-harmonia-green">Registros de Aceitação de Contratos</CardTitle>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar registro..."
              className="pl-8 w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={fetchLogs}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-harmonia-green border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pacote</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Data de Aceitação</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Versão do Contrato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{getPackageBadge(log.packageId)}</TableCell>
                      <TableCell>{log.customerName}</TableCell>
                      <TableCell>{log.customerEmail}</TableCell>
                      <TableCell>{formatDate(log.acceptanceDate)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {log.source}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.contractVersion}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      Nenhum registro de aceitação de contrato encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Total de registros: {filteredLogs.length}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractAcceptanceLogs;
