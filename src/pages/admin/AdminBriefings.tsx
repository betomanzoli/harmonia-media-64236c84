
import React, { useState, useEffect } from 'react';
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
  Package,
  Plus
} from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useBriefings } from '@/hooks/admin/useBriefings';
import CreateBriefingForm from '@/components/admin/briefings/CreateBriefingForm';
import BriefingDetailForm from '@/components/admin/briefings/BriefingDetailForm';

const AdminBriefings: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { briefings, addBriefing, updateBriefingStatus, deleteBriefing, createProjectFromBriefing, updateBriefing } = useBriefings();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // State to track which briefing is selected for actions
  const [briefingToDelete, setBriefingToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // State for view/edit briefing
  const [selectedBriefing, setSelectedBriefing] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  // Load briefings from localStorage on component mount
  useEffect(() => {
    const storedBriefings = localStorage.getItem('harmonIA_briefings');
    if (storedBriefings) {
      // We're using the hook's state, just log for debug
      console.log('Loaded briefings from localStorage:', JSON.parse(storedBriefings));
    }
  }, []);

  // Filter briefings based on search term
  const filteredBriefings = briefings.filter(
    (briefing) =>
      briefing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      briefing.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      briefing.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBriefing = (briefingData: any) => {
    const newBriefing = {
      name: briefingData.name,
      email: briefingData.email,
      phone: briefingData.phone,
      packageType: briefingData.packageType,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      status: 'pending',
      description: briefingData.description || 'Novo briefing',
      projectCreated: false,
      formData: briefingData.formData || {}
    };
    
    const id = addBriefing(newBriefing);
    
    setShowCreateDialog(false);
    toast({
      title: "Briefing criado",
      description: `O briefing ${id} foi criado com sucesso.`
    });
  };

  const handleViewBriefing = (briefing: any) => {
    setSelectedBriefing(briefing);
    setShowViewDialog(true);
  };

  const handleEditBriefing = (briefing: any) => {
    setSelectedBriefing(briefing);
    setShowEditDialog(true);
  };

  const handleBriefingUpdate = (updatedBriefing: any) => {
    updateBriefing(updatedBriefing.id, updatedBriefing);
    setShowEditDialog(false);
    
    toast({
      title: "Briefing atualizado",
      description: `O briefing foi atualizado com sucesso.`
    });
  };

  const openDeleteDialog = (id: string) => {
    setBriefingToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteBriefing = () => {
    if (!briefingToDelete) return;
    
    deleteBriefing(briefingToDelete);
    
    toast({
      title: "Briefing excluído",
      description: `O briefing ${briefingToDelete} foi excluído com sucesso.`,
      variant: "destructive"
    });
    
    setBriefingToDelete(null);
    setShowDeleteDialog(false);
  };

  const handleCreateProject = (briefingId: string) => {
    // Criar projeto a partir do briefing
    const briefing = briefings.find(b => b.id === briefingId);
    if (!briefing) return;
    
    const projectId = createProjectFromBriefing(briefing);
    
    toast({
      title: "Projeto criado",
      description: `Projeto ${projectId} criado com sucesso a partir do briefing ${briefingId}.`
    });
    
    // Redirecionar para página de previews
    setTimeout(() => {
      navigate('/admin-j28s7d1k/previews');
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-blue-500">Novo</Badge>;
      case 'completed':
        return <Badge className="bg-yellow-500">Analisado</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Aprovado</Badge>;
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
          <div className="flex space-x-2">
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
            
            <Button 
              onClick={() => setShowCreateDialog(true)}
              size="sm"
              className="bg-harmonia-green hover:bg-harmonia-green/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Briefing
            </Button>
          </div>
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
                              <div className="font-medium">{briefing.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {briefing.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{briefing.createdAt}</TableCell>
                          <TableCell>{briefing.packageType}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleViewBriefing(briefing)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Visualizar
                                </DropdownMenuItem>
                                
                                {!briefing.projectCreated && (
                                  <DropdownMenuItem onClick={() => handleCreateProject(briefing.id)}>
                                    <Play className="mr-2 h-4 w-4" />
                                    Iniciar Projeto
                                  </DropdownMenuItem>
                                )}
                                
                                <DropdownMenuItem onClick={() => handleEditBriefing(briefing)}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem onSelect={(e) => {
                                  e.preventDefault();
                                  openDeleteDialog(briefing.id);
                                }}>
                                  <Trash className="mr-2 h-4 w-4" />
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este briefing? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBriefingToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteBriefing}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create briefing dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <CreateBriefingForm onClose={() => setShowCreateDialog(false)} onSubmit={handleCreateBriefing} />
        </DialogContent>
      </Dialog>

      {/* View briefing dialog */}
      {selectedBriefing && (
        <>
          <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
            <DialogContent className="sm:max-w-[700px]">
              <h2 className="text-xl font-semibold mb-4">Detalhes do Briefing</h2>
              <BriefingDetailForm 
                briefing={selectedBriefing}
                isEditing={false}
                onClose={() => setShowViewDialog(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="sm:max-w-[700px]">
              <h2 className="text-xl font-semibold mb-4">Editar Briefing</h2>
              <BriefingDetailForm 
                briefing={selectedBriefing}
                isEditing={true}
                onClose={() => setShowEditDialog(false)}
                onUpdate={handleBriefingUpdate}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminBriefings;
