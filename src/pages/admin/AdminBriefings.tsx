
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, Filter, FilePlus, FileText, Eye, Pencil, Trash2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

// Mock data for briefings
const mockBriefings = [
  {
    id: 'briefing-1680123456',
    clientName: 'João Silva',
    clientEmail: 'joao.silva@email.com',
    packageType: 'essencial',
    submittedAt: '2025-03-29T14:30:00',
    status: 'new'
  },
  {
    id: 'briefing-1680234567',
    clientName: 'Maria Oliveira',
    clientEmail: 'maria.oliveira@email.com',
    packageType: 'profissional',
    submittedAt: '2025-03-30T09:15:00',
    status: 'in-progress'
  },
  {
    id: 'briefing-1680345678',
    clientName: 'Carlos Santos',
    clientEmail: 'carlos.santos@email.com',
    packageType: 'premium',
    submittedAt: '2025-03-31T11:45:00',
    status: 'completed'
  },
  {
    id: 'briefing-1680456789',
    clientName: 'Ana Ferreira',
    clientEmail: 'ana.ferreira@email.com',
    packageType: 'essencial',
    submittedAt: '2025-04-01T16:20:00',
    status: 'new'
  },
  {
    id: 'briefing-1680567890',
    clientName: 'Pedro Costa',
    clientEmail: 'pedro.costa@email.com',
    packageType: 'profissional',
    submittedAt: '2025-04-02T10:30:00',
    status: 'in-progress'
  }
];

// Mock data for briefing details
const mockBriefingDetail = {
  id: 'briefing-1680123456',
  clientName: 'João Silva',
  clientEmail: 'joao.silva@email.com',
  packageType: 'essencial',
  submittedAt: '2025-03-29T14:30:00',
  status: 'new',
  briefingData: {
    musicPreferences: 'Pop/Rock contemporâneo com elementos acústicos',
    storyDescription: 'Música para celebrar aniversário de casamento de 25 anos. Conhecemos em uma festa na faculdade e temos dois filhos.',
    emotionalGoals: 'Nostálgico, romântico, celebração',
    specificElements: 'Gostaria de mencionar os nomes Maria e José, e incluir referência à nossa música de casamento "Can\'t Help Falling in Love"',
    additionalNotes: 'Preferimos uma voz feminina para os vocais, se possível.'
  },
  files: [
    { id: 'file-1', name: 'referencia_musica.mp3', url: '#' },
    { id: 'file-2', name: 'foto_casal.jpg', url: '#' }
  ]
};

const AdminBriefings: React.FC = () => {
  const [briefings, setBriefings] = useState(mockBriefings);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBriefing, setSelectedBriefing] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredBriefings = briefings.filter(briefing => 
    briefing.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    briefing.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    briefing.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewBriefing = (id: string) => {
    // In a real implementation, this would fetch the briefing data from API/storage
    setSelectedBriefing(mockBriefingDetail);
    setViewDialogOpen(true);
  };
  
  const handleDeleteBriefing = (id: string) => {
    setBriefings(briefings.filter(briefing => briefing.id !== id));
    toast({
      title: "Briefing removido",
      description: `O briefing ${id} foi removido com sucesso.`
    });
  };

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">Novo</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-500">Em Andamento</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Concluído</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const getPackageLabel = (packageType: string) => {
    switch (packageType) {
      case 'essencial':
        return 'Essencial';
      case 'profissional':
        return 'Profissional';
      case 'premium':
        return 'Premium';
      default:
        return packageType;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">Briefings</h1>
            <p className="text-muted-foreground">
              Gerencie os formulários de briefing enviados pelos clientes
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
        
        <Tabs defaultValue="all">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="new">Novos</TabsTrigger>
              <TabsTrigger value="in-progress">Em Andamento</TabsTrigger>
              <TabsTrigger value="completed">Concluídos</TabsTrigger>
            </TabsList>
            
            <div className="flex w-full md:w-auto items-center gap-2">
              <div className="relative flex-grow md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar briefing..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              
              <Button className="bg-harmonia-green hover:bg-harmonia-green/90">
                <FilePlus className="mr-2 h-4 w-4" />
                Novo Briefing
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Lista de Briefings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Pacote</TableHead>
                    <TableHead>Data de Envio</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBriefings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">Nenhum briefing encontrado</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBriefings.map((briefing) => (
                      <TableRow key={briefing.id}>
                        <TableCell className="font-medium">{briefing.id}</TableCell>
                        <TableCell>{briefing.clientName}</TableCell>
                        <TableCell>{briefing.clientEmail}</TableCell>
                        <TableCell>{getPackageLabel(briefing.packageType)}</TableCell>
                        <TableCell>{formatDate(briefing.submittedAt)}</TableCell>
                        <TableCell>{getStatusBadge(briefing.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewBriefing(briefing.id)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Visualizar</span>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Excluir</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. Isso excluirá permanentemente o briefing {briefing.id}.
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Tabs>
      </div>
      
      {/* Briefing View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Briefing</DialogTitle>
            <DialogDescription>
              Informações completas do briefing {selectedBriefing?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBriefing && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Informações do Cliente</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 border-b pb-1">
                      <span className="text-muted-foreground">Nome:</span>
                      <span className="col-span-2 font-medium">{selectedBriefing.clientName}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-b pb-1">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="col-span-2 font-medium">{selectedBriefing.clientEmail}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-b pb-1">
                      <span className="text-muted-foreground">Pacote:</span>
                      <span className="col-span-2 font-medium">{getPackageLabel(selectedBriefing.packageType)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-b pb-1">
                      <span className="text-muted-foreground">Enviado em:</span>
                      <span className="col-span-2 font-medium">{formatDate(selectedBriefing.submittedAt)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-b pb-1">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="col-span-2 font-medium">{getStatusBadge(selectedBriefing.status)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Arquivos Anexados</h3>
                  {selectedBriefing.files.length === 0 ? (
                    <p className="text-muted-foreground">Nenhum arquivo anexado</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedBriefing.files.map((file: any) => (
                        <div key={file.id} className="flex items-center justify-between border rounded-md p-2">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{file.name}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Detalhes do Briefing</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Preferências Musicais</h4>
                    <p>{selectedBriefing.briefingData.musicPreferences}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">História/Descrição</h4>
                    <p>{selectedBriefing.briefingData.storyDescription}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Objetivos Emocionais</h4>
                    <p>{selectedBriefing.briefingData.emotionalGoals}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Elementos Específicos</h4>
                    <p>{selectedBriefing.briefingData.specificElements}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Notas Adicionais</h4>
                    <p>{selectedBriefing.briefingData.additionalNotes}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar Briefing
                </Button>
                <Button className="bg-harmonia-green hover:bg-harmonia-green/90">
                  <FileText className="h-4 w-4 mr-2" />
                  Iniciar Projeto
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminBriefings;
