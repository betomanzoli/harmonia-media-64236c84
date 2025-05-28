
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit, Trash2, Phone, Mail, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NewAdminLayout from '@/components/admin/layout/NewAdminLayout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import PhoneInput, { PhoneWithCountryCode } from '@/components/PhoneInput';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: PhoneWithCountryCode;
  company?: string;
  createdAt: string;
  projectsCount: number;
}

const NewAdminClients: React.FC = () => {
  const { toast } = useToast();
  
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      phone: { fullNumber: '+5511999999999', countryCode: '55', nationalNumber: '11999999999' },
      company: 'Empresa A',
      createdAt: '15/01/2024',
      projectsCount: 2
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      phone: { fullNumber: '+5511888888888', countryCode: '55', nationalNumber: '11888888888' },
      createdAt: '10/01/2024',
      projectsCount: 1
    }
  ]);
  
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: { fullNumber: '', countryCode: '55', nationalNumber: '' } as PhoneWithCountryCode,
    company: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: { fullNumber: '', countryCode: '55', nationalNumber: '' },
      company: ''
    });
  };

  const handleAddClient = () => {
    // Validação
    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira o nome do cliente.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira o email do cliente.",
        variant: "destructive"
      });
      return;
    }

    // Validação de telefone
    if (!formData.phone.nationalNumber || formData.phone.nationalNumber.length < 10) {
      toast({
        title: "Telefone obrigatório",
        description: "Por favor, insira um telefone válido no formato internacional.",
        variant: "destructive"
      });
      return;
    }

    const newClient: Client = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      projectsCount: 0
    };

    if (editingClient) {
      // Editando cliente existente
      setClients(clients.map(client => 
        client.id === editingClient.id ? { ...newClient, id: editingClient.id } : client
      ));
      toast({
        title: "Cliente atualizado",
        description: `${formData.name} foi atualizado com sucesso.`
      });
      setEditingClient(null);
    } else {
      // Adicionando novo cliente
      setClients([newClient, ...clients]);
      toast({
        title: "Cliente adicionado",
        description: `${formData.name} foi adicionado com sucesso.`
      });
    }

    setShowNewClientDialog(false);
    resetForm();
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company || ''
    });
    setShowNewClientDialog(true);
  };

  const handleDeleteClient = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client && client.projectsCount > 0) {
      toast({
        title: "Não é possível excluir",
        description: "Este cliente possui projetos ativos. Finalize os projetos antes de excluir.",
        variant: "destructive"
      });
      return;
    }

    setClients(clients.filter(c => c.id !== clientId));
    toast({
      title: "Cliente removido",
      description: "O cliente foi removido com sucesso.",
      variant: "destructive"
    });
  };

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDialogClose = () => {
    setShowNewClientDialog(false);
    setEditingClient(null);
    resetForm();
  };

  // Filtrar clientes
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatPhoneDisplay = (phone: PhoneWithCountryCode) => {
    if (!phone.nationalNumber) return '';
    const digits = phone.nationalNumber;
    if (digits.length === 11) {
      return `+55 (${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`;
    } else if (digits.length === 10) {
      return `+55 (${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}`;
    }
    return `+55 ${digits}`;
  };

  return (
    <NewAdminLayout>
      <div className="p-6 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Clientes</h1>
          <Button 
            onClick={() => setShowNewClientDialog(true)} 
            className="bg-harmonia-green hover:bg-harmonia-green/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        {/* Stats Card */}
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-gray-600">Total de Clientes</p>
          </CardContent>
        </Card>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, email ou empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Projetos</TableHead>
                  <TableHead>Cadastrado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <div>
                            <div className="font-medium">{client.name}</div>
                            <div className="text-sm text-gray-500">{client.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm">{formatPhoneDisplay(client.phone)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{client.company || '-'}</TableCell>
                      <TableCell>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {client.projectsCount} projetos
                        </span>
                      </TableCell>
                      <TableCell>{client.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClient(client)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o cliente "{client.name}"? 
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteClient(client.id)}
                                  className="bg-red-600 hover:bg-red-700"
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
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {clients.length === 0 
                        ? 'Nenhum cliente cadastrado ainda.' 
                        : 'Nenhum cliente encontrado com os filtros aplicados.'
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* New/Edit Client Dialog */}
        <Dialog open={showNewClientDialog} onOpenChange={handleDialogClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingClient ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="Nome do cliente"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
              
              <PhoneInput
                label="Telefone"
                value={formData.phone}
                onChange={(phone) => handleChange('phone', phone)}
                required
                placeholder="(11) 99999-9999"
              />
              
              <div>
                <Label htmlFor="company">Empresa (Opcional)</Label>
                <Input
                  id="company"
                  placeholder="Nome da empresa"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleDialogClose}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddClient} 
                  className="bg-harmonia-green hover:bg-harmonia-green/90"
                >
                  {editingClient ? 'Atualizar' : 'Adicionar'} Cliente
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </NewAdminLayout>
  );
};

export default NewAdminClients;
