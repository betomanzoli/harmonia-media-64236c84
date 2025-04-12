
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Plus, Pencil, Eye, Trash2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const AdminBriefings: React.FC = () => {
  const { toast } = useToast();
  const [briefings] = useState([
    { 
      id: 'BRF-2023-001',
      clientName: 'João Silva',
      packageType: 'Essencial',
      status: 'pendente',
      submissionDate: '10/04/2023'
    },
    { 
      id: 'BRF-2023-002',
      clientName: 'Maria Oliveira',
      packageType: 'Profissional',
      status: 'em_analise',
      submissionDate: '15/04/2023'
    },
    { 
      id: 'BRF-2023-003',
      clientName: 'Carlos Santos',
      packageType: 'Premium',
      status: 'aprovado',
      submissionDate: '20/04/2023'
    }
  ]);

  const handleCreateNewBriefing = () => {
    toast({
      title: "Novo briefing",
      description: "Funcionalidade para criar novo briefing será implementada em breve."
    });
  };

  const handleEditBriefing = (id: string) => {
    toast({
      title: "Editar briefing",
      description: `Edição do briefing ${id} será implementada em breve.`
    });
  };

  const handleViewBriefing = (id: string) => {
    toast({
      title: "Visualizar briefing",
      description: `Visualização do briefing ${id} será implementada em breve.`
    });
  };

  const handleDeleteBriefing = (id: string) => {
    toast({
      title: "Excluir briefing",
      description: `Exclusão do briefing ${id} será implementada em breve.`
    });
  };

  const handleStartProject = (id: string) => {
    toast({
      title: "Iniciar projeto",
      description: `Projeto baseado no briefing ${id} será iniciado em breve.`
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pendente':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        );
      case 'em_analise':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Eye className="h-3 w-3 mr-1" />
            Em análise
          </Badge>
        );
      case 'aprovado':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <FileText className="h-3 w-3 mr-1" />
            Aprovado
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
            <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">Briefings</h1>
            <p className="text-muted-foreground">
              Gerencie os briefings enviados pelos clientes
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleCreateNewBriefing}
              className="bg-harmonia-green hover:bg-harmonia-green/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Briefing
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              asChild
              className="border-harmonia-green text-harmonia-green hover:bg-harmonia-green/10"
            >
              <Link to="/admin-j28s7d1k/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Briefings Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Lista de briefings enviados pelos clientes</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Pacote</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de envio</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {briefings.map((briefing) => (
                  <TableRow key={briefing.id}>
                    <TableCell className="font-medium">{briefing.id}</TableCell>
                    <TableCell>{briefing.clientName}</TableCell>
                    <TableCell>{briefing.packageType}</TableCell>
                    <TableCell>{getStatusBadge(briefing.status)}</TableCell>
                    <TableCell>{briefing.submissionDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewBriefing(briefing.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditBriefing(briefing.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteBriefing(briefing.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {briefing.status === 'aprovado' && (
                          <Button 
                            size="sm"
                            className="bg-harmonia-green hover:bg-harmonia-green/90"
                            onClick={() => handleStartProject(briefing.id)}
                          >
                            Iniciar Projeto
                          </Button>
                        )}
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

export default AdminBriefings;
