
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus, Mail, Phone, Calendar, MoreHorizontal } from 'lucide-react';
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

// Mock client data
const mockClients = [
  {
    id: 'C001',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    createdAt: '12/04/2023',
    projects: 3,
    status: 'active'
  },
  {
    id: 'C002',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@email.com',
    phone: '(11) 91234-5678',
    createdAt: '23/05/2023',
    projects: 1,
    status: 'active'
  },
  {
    id: 'C003',
    name: 'Carlos Santos',
    email: 'carlos.santos@email.com',
    phone: '(21) 99876-5432',
    createdAt: '07/06/2023',
    projects: 2,
    status: 'inactive'
  },
  {
    id: 'C004',
    name: 'Ana Pereira',
    email: 'ana.pereira@email.com',
    phone: '(31) 98765-1234',
    createdAt: '18/07/2023',
    projects: 0,
    status: 'active'
  },
  {
    id: 'C005',
    name: 'Roberto Almeida',
    email: 'roberto.almeida@email.com',
    phone: '(41) 99988-7766',
    createdAt: '29/08/2023',
    projects: 5,
    status: 'active'
  }
];

const AdminClients: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulação de carregamento de clientes da API
    const loadClients = () => {
      setTimeout(() => {
        setClients(mockClients);
        setLoading(false);
      }, 800);
    };
    
    loadClients();
  }, []);

  const handleNewClientClick = () => {
    setIsNewClientDialogOpen(true);
  };
  
  const handleNewClientChange = (field: string, value: string) => {
    setNewClient({
      ...newClient,
      [field]: value
    });
  };
  
  const handleNewClientSubmit = () => {
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
    const newId = `C00${clients.length + 1}`;
    const currentDate = new Date().toLocaleDateString('pt-BR');
    const createdClient = {
      id: newId,
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone || '-',
      company: newClient.company,
      createdAt: currentDate,
      projects: 0,
      status: 'active'
    };
    
    // Adicionar à lista de clientes
    setClients([...clients, createdClient]);
    
    // Fechar o diálogo e resetar o formulário
    setIsNewClientDialogOpen(false);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      company: ''
    });
    
    toast({
      title: "Cliente adicionado",
      description: `O cliente ${newClient.name} foi adicionado com sucesso.`
    });
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
            {loading ? (
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
                      <TableHead>Projetos</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.id}</TableCell>
                        <TableCell>{client.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center text-sm">
                              <Mail className="mr-1 h-3 w-3 text-gray-500" />
                              {client.email}
                            </div>
                            <div className="flex items-center text-sm mt-1">
                              <Phone className="mr-1 h-3 w-3 text-gray-500" />
                              {client.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4 text-gray-500" />
                            {client.createdAt}
                          </div>
                        </TableCell>
                        <TableCell>{client.projects}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {client.status === 'active' ? 'Ativo' : 'Inativo'}
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
                              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                              <DropdownMenuItem>Editar cliente</DropdownMenuItem>
                              <DropdownMenuItem>Ver projetos</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                Desativar cliente
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
      </div>
    </AdminLayout>
  );
};

export default AdminClients;
