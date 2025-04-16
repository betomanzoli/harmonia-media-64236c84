
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  MoreHorizontal, 
  Eye, 
  FileText, 
  Trash, 
  Play,
  PackageCheck,
  Package
} from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

interface Briefing {
  id: string;
  clientName: string;
  clientEmail: string;
  submittedDate: string;
  status: 'new' | 'reviewed' | 'in-progress' | 'completed';
  package: string;
  projectCreated?: boolean;
}

const AdminBriefings: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [briefingsData, setBriefingsData] = useState<Briefing[]>([
    {
      id: 'BRF-001',
      clientName: 'João Silva',
      clientEmail: 'joao.silva@email.com',
      submittedDate: '10/04/2025',
      status: 'new',
      package: 'Profissional'
    },
    {
      id: 'BRF-002',
      clientName: 'Maria Oliveira',
      clientEmail: 'maria.oliveira@email.com',
      submittedDate: '12/04/2025',
      status: 'reviewed',
      package: 'Premium'
    },
    {
      id: 'BRF-003',
      clientName: 'Carlos Santos',
      clientEmail: 'carlos.santos@email.com',
      submittedDate: '15/04/2025',
      status: 'in-progress',
      package: 'Essencial',
      projectCreated: true
    },
    {
      id: 'BRF-004',
      clientName: 'Ana Souza',
      clientEmail: 'ana.souza@email.com',
      submittedDate: '05/04/2025',
      status: 'completed',
      package: 'Premium',
      projectCreated: true
    }
  ]);

  // Filter briefings based on search term
  const filteredBriefings = briefingsData.filter(
    (briefing) =>
      briefing.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      briefing.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      briefing.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewBriefing = (id: string) => {
    // In a real implementation, this would navigate to a briefing detail page
    toast({
      title: "Visualizar Briefing",
      description: `Visualizando briefing ${id}`
    });
  };

  const handleDeleteBriefing = (id: string) => {
    setBriefingsData(briefingsData.filter(briefing => briefing.id !== id));
    toast({
      title: "Briefing excluído",
      description: `O briefing ${id} foi excluído com sucesso.`,
      variant: "destructive"
    });
  };

  const handleCreateProject = (briefingId: string) => {
    // Update the briefing status and set projectCreated to true
    setBriefingsData(
      briefingsData.map(briefing => 
        briefing.id === briefingId 
          ? { ...briefing, status: 'in-progress' as const, projectCreated: true } 
          : briefing
      )
    );
    
    toast({
      title: "Projeto criado",
      description: `Um novo projeto foi criado a partir do briefing ${briefingId}.`
    });
    
    // Redirect to the new project page
    setTimeout(() => {
      navigate('/admin-j28s7d1k/previews');
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">Novo</Badge>;
      case 'reviewed':
        return <Badge className="bg-yellow-500">Analisado</Badge>;
      case 'in-progress':
        return <Badge className="bg-green-500">Em andamento</Badge>;
      case 'completed':
        return <Badge className="bg-purple-500">Concluído</Badge>;
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
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Briefings Recebidos</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar briefing..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Pacote</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[120px]">Projeto</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBriefings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Nenhum briefing encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBriefings.map((briefing) => (
                        <TableRow key={briefing.id}>
                          <TableCell className="font-medium">{briefing.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{briefing.clientName}</div>
                              <div className="text-sm text-muted-foreground">
                                {briefing.clientEmail}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{briefing.submittedDate}</TableCell>
                          <TableCell>{briefing.package}</TableCell>
                          <TableCell>{getStatusBadge(briefing.status)}</TableCell>
                          <TableCell>
                            {briefing.projectCreated ? (
                              <Badge variant="outline" className="border-green-500 text-green-500">
                                <PackageCheck className="mr-1 h-3 w-3" />
                                Criado
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-gray-500 text-gray-500">
                                <Package className="mr-1 h-3 w-3" />
                                Pendente
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Abrir menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleViewBriefing(briefing.id)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Visualizar
                                </DropdownMenuItem>
                                
                                {!briefing.projectCreated && (
                                  <DropdownMenuItem onClick={() => handleCreateProject(briefing.id)}>
                                    <Play className="mr-2 h-4 w-4" />
                                    Iniciar Projeto
                                  </DropdownMenuItem>
                                )}
                                
                                <DropdownMenuItem onClick={() => handleViewBriefing(briefing.id)}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                      <Trash className="mr-2 h-4 w-4" />
                                      Excluir
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja excluir este briefing? Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteBriefing(briefing.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
    </AdminLayout>
  );
};

export default AdminBriefings;
