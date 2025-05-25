
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MessageCircle, Trash2, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import type { MarketingLead } from '@/pages/admin/AdminMarketing';

interface MarketingLeadsListProps {
  leads: MarketingLead[];
  isLoading: boolean;
  onUpdateStatus: (id: string, status: 'new' | 'contacted' | 'qualified' | 'converted' | 'unqualified') => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-green-100 text-green-800",
  converted: "bg-purple-100 text-purple-800",
  unqualified: "bg-gray-100 text-gray-800"
};

const statusLabels = {
  new: "Novo",
  contacted: "Contactado",
  qualified: "Qualificado",
  converted: "Convertido",
  unqualified: "Não qualificado"
};

interface LeadDetailsDialogProps {
  lead: MarketingLead | null;
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: 'new' | 'contacted' | 'qualified' | 'converted' | 'unqualified') => void;
}

const LeadDetailsDialog: React.FC<LeadDetailsDialogProps> = ({
  lead,
  open,
  onClose,
  onUpdateStatus
}) => {
  const [status, setStatus] = useState<'new' | 'contacted' | 'qualified' | 'converted' | 'unqualified'>(
    lead?.status || 'new'
  );
  
  if (!lead) return null;
  
  const handleUpdateStatus = () => {
    onUpdateStatus(lead.id, status);
    onClose();
  };
  
  // Format the responses for display
  const formatResponseLabel = (key: string): string => {
    switch (key) {
      case 'q1': return 'Tipo de projeto';
      case 'q2': return 'Estilo musical';
      case 'q3': return 'Preferência de valor';
      case 'project_type': return 'Tipo de projeto';
      case 'music_style': return 'Estilo musical';
      case 'value_preference': return 'Preferência de valor';
      default: return key;
    }
  };
  
  const getOptionText = (key: string, value: string): string => {
    // This would ideally reference the options from ConversationalLandingPage,
    // but for simplicity we'll handle a few common responses here
    const optionMappings: Record<string, Record<string, string>> = {
      q1: {
        'personal_event': 'Evento pessoal',
        'business': 'Negócio/Marca',
        'gift': 'Presente especial'
      },
      q2: {
        'pop': 'Pop',
        'classical': 'Clássico',
        'electronic': 'Eletrônico',
        'acoustic': 'Acústico',
        'other': 'Outro'
      },
      q3: {
        'lyrics': 'Letra marcante',
        'melody': 'Melodia única',
        'arrangement': 'Arranjo sofisticado',
        'production': 'Qualidade de produção'
      }
    };
    
    return optionMappings[key]?.[value] || value;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalhes do Lead</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Nome</h3>
              <p>{lead.name}</p>
            </div>
            
            <div>
              <h3 className="font-medium">Email</h3>
              <p>{lead.email}</p>
            </div>
            
            <div>
              <h3 className="font-medium">Data</h3>
              <p>{new Date(lead.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div>
              <h3 className="font-medium">Status</h3>
              <div className="flex items-center gap-2">
                <Badge className={statusColors[lead.status]}>
                  {statusLabels[lead.status]}
                </Badge>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Fonte</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-gray-500">Origem:</span> {lead.lead_source || 'Direta'}
              </div>
              {lead.lead_medium && (
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Meio:</span> {lead.lead_medium}
                </div>
              )}
              {lead.lead_campaign && (
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Campanha:</span> {lead.lead_campaign}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Respostas</h3>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {lead.responses && Object.entries(lead.responses).map(([key, value]) => {
                  if (typeof value !== 'string') return null;
                  
                  return (
                    <div key={key} className="bg-gray-50 p-3 rounded">
                      <span className="text-gray-500">{formatResponseLabel(key)}:</span>{' '}
                      {key.startsWith('q') ? getOptionText(key, value) : value}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Atualizar status</h3>
            <Select value={status} onValueChange={(value) => setStatus(value as 'new' | 'contacted' | 'qualified' | 'converted' | 'unqualified')}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Novo</SelectItem>
                <SelectItem value="contacted">Contatado</SelectItem>
                <SelectItem value="qualified">Qualificado</SelectItem>
                <SelectItem value="converted">Convertido</SelectItem>
                <SelectItem value="unqualified">Não qualificado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => window.open(`mailto:${lead.email}?subject=Olá ${lead.name}, sobre seu interesse em música personalizada`, '_blank')}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Enviar Email
            </Button>
            
            <Button 
              variant="default"
              className="flex-1" 
              onClick={handleUpdateStatus}
            >
              <Check className="w-4 h-4 mr-2" />
              Atualizar Status
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const MarketingLeadsList: React.FC<MarketingLeadsListProps> = ({
  leads,
  isLoading,
  onUpdateStatus,
  onDelete
}) => {
  const [selectedLead, setSelectedLead] = useState<MarketingLead | null>(null);
  
  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
        </div>
        <p className="text-center mt-4 text-gray-500">Carregando leads...</p>
      </div>
    );
  }
  
  if (leads.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">Nenhum lead encontrado.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fonte</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedLead(lead)}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>
                  <Badge className={statusColors[lead.status]}>
                    {statusLabels[lead.status]}
                  </Badge>
                </TableCell>
                <TableCell>{lead.lead_source || 'Direta'}</TableCell>
                <TableCell>{new Date(lead.created_at).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setSelectedLead(lead)}>
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`mailto:${lead.email}`, '_blank')}>
                          Enviar email
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => onDelete(lead.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <LeadDetailsDialog 
        lead={selectedLead} 
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdateStatus={onUpdateStatus}
      />
    </>
  );
};

export default MarketingLeadsList;
