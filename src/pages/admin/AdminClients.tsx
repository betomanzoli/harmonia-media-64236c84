
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus, Mail, Phone, Calendar, MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { useSupabaseData } from '@/hooks/use-supabase-data';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  created_at: string;
  projects?: number;
  status?: string;
}

const AdminClients: React.FC = () => {
  const { data: clients, isLoading, addItem, updateItem, deleteItem } = useSupabaseData<Client>('clients');
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  const { toast } = useToast();
  
  const handleNewClientClick = () => {
    setIsNewClientDialogOpen(true);
  };
  
  const handleNewClientChange = (field: string, value: string) => {
    setNewClient({
      ...newClient,
      [field]: value
    });
  };
  
  const handleNewClientSubmit = async () => {
    // Validar campos obrigatórios
    if (!newClient.name || !newClient.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e email são campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newClient.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }
    
    // Criar novo cliente
    await addItem({
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone || '',
      company: newClient.company
    });
    
    // Fechar o diálogo e resetar o formulário
    setIsNewClientDialogOpen(false);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      company: ''
    });
  };

  const handleEditClientClick = (client: Client) => {
    setCurrentClient(client);
    setIsEditClientDialogOpen(true);
  };

  const handleEditClientChange = (field: string, value: string) => {
    if (!currentClient) return;

    setCurrentClient({
      ...currentClient,
      [field]: value
    });
  };

  const handleEditClientSubmit = async () => {
    if (!currentClient) return;

    // Validar campos obrigatórios
    if (!currentClient.name || !currentClient.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e email são campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!currentClient.email && !emailRegex.test(currentClient.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }
    
    // Atualizar cliente
    await updateItem(currentClient.id, {
      name: currentClient.name,
      email: currentClient.email,
      phone: currentClient.phone || '',
      company: currentClient.company
    });
    
    // Fechar o diálogo
    setIsEditClientDialogOpen(false);
    setCurrentClient(null);
  };

  const handleDeleteClick = (client: Client) => {
    setCurrentClient(client);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!currentClient) return;
    
    await deleteItem(currentClient.id);
    
    setIsDeleteDialogOpen(false);
    setCurrentClient(null);
  };
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      return dateStr;
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciamento de Clientes</h1>
          <Button onClick={handleNewClientClick}>
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200"></div>
                <p className="mt-2 text-sm text-gray-500">Carregando clientes...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.id.substring(0, 6)}</TableCell>
                        <TableCell>{client.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center text-sm">
                              <Mail className="mr-1 h-3 w-3 text-gray-500" />
                              {client.email}
                            </div>
                            {client.phone && (
                              <div className="flex items-center text-sm mt-1">
                                <Phone className="mr-1 h-3 w-3 text-gray-500" />
                                {client.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4 text-gray-500" />
                            {formatDate(client.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Ativo
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditClientClick(client)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar cliente
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver projetos
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteClick(client)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir cliente
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Dialog open={isNewClientDialogOpen} onOpenChange={setIsNewClientDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo cliente.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client-name" className="text-right">
                  Nome*
                </Label>
                <Input
                  id="client-name"
                  className="col-span-3"
                  value={newClient.name}
                  onChange={(e) => handleNewClientChange('name', e.target.value)}
                  placeholder="Nome completo"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client-email" className="text-right">
                  Email*
                </Label>
                <Input
                  id="client-email"
                  type="email"
                  className="col-span-3"
                  value={newClient.email}
                  onChange={(e) => handleNewClientChange('email', e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client-phone" className="text-right">
                  Telefone
                </Label>
                <Input
                  id="client-phone"
                  className="col-span-3"
                  value={newClient.phone}
                  onChange={(e) => handleNewClientChange('phone', e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client-company" className="text-right">
                  Empresa
                </Label>
                <Input
                  id="client-company"
                  className="col-span-3"
                  value={newClient.company}
                  onChange={(e) => handleNewClientChange('company', e.target.value)}
                  placeholder="Nome da empresa (opcional)"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" onClick={handleNewClientSubmit}>
                Adicionar Cliente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditClientDialogOpen} onOpenChange={setIsEditClientDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription>
                Atualize os dados do cliente.
              </DialogDescription>
            </DialogHeader>
            
            {currentClient && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-client-name" className="text-right">
                    Nome*
                  </Label>
                  <Input
                    id="edit-client-name"
                    className="col-span-3"
                    value={currentClient.name}
                    onChange={(e) => handleEditClientChange('name', e.target.value)}
                    placeholder="Nome completo"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-client-email" className="text-right">
                    Email*
                  </Label>
                  <Input
                    id="edit-client-email"
                    type="email"
                    className="col-span-3"
                    value={currentClient.email}
                    onChange={(e) => handleEditClientChange('email', e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-client-phone" className="text-right">
                    Telefone
                  </Label>
                  <Input
                    id="edit-client-phone"
                    className="col-span-3"
                    value={currentClient.phone}
                    onChange={(e) => handleEditClientChange('phone', e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-client-company" className="text-right">
                    Empresa
                  </Label>
                  <Input
                    id="edit-client-company"
                    className="col-span-3"
                    value={currentClient.company || ''}
                    onChange={(e) => handleEditClientChange('company', e.target.value)}
                    placeholder="Nome da empresa (opcional)"
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button type="submit" onClick={handleEditClientSubmit}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Você tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminClients;
