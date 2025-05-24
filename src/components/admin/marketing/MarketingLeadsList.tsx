
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface MarketingLead {
  id: string;
  name: string;
  email: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'unqualified';
  responses?: Record<string, any>;
  lead_source?: string;
  lead_medium?: string;
  lead_campaign?: string;
  created_at: string;
}

interface MarketingLeadsListProps {
  leads: MarketingLead[];
  isLoading: boolean;
  onUpdateStatus: (id: string, status: 'new' | 'contacted' | 'qualified' | 'converted' | 'unqualified') => void;
  onDelete: (id: string) => void;
}

const MarketingLeadsList: React.FC<MarketingLeadsListProps> = ({
  leads,
  isLoading,
  onUpdateStatus,
  onDelete
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">Novo</Badge>;
      case 'contacted':
        return <Badge className="bg-yellow-500">Contactado</Badge>;
      case 'qualified':
        return <Badge className="bg-green-500">Qualificado</Badge>;
      case 'converted':
        return <Badge className="bg-purple-500">Convertido</Badge>;
      case 'unqualified':
        return <Badge variant="outline" className="text-gray-500">Não qualificado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando leads...</div>;
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-gray-500">Nenhum lead encontrado</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Origem</TableHead>
          <TableHead>Data</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map(lead => (
          <TableRow key={lead.id}>
            <TableCell className="font-medium">{lead.name}</TableCell>
            <TableCell>{lead.email}</TableCell>
            <TableCell>{getStatusBadge(lead.status)}</TableCell>
            <TableCell>{lead.lead_source || 'Desconhecido'}</TableCell>
            <TableCell>{lead.created_at}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MarketingLeadsList;
