
import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import PhoneInput, { PhoneWithCountryCode } from '@/components/PhoneInput';
import { useCustomers } from '@/hooks/admin/useCustomers';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useSupabaseData } from '@/hooks/use-supabase-data';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  client_id: string;
  title: string;
  status: string;
  [key: string]: any; // For any other properties
}

const ClientsList = () => {
  const { customers, isLoading, addCustomer, updateCustomer, deleteCustomer, refreshCustomers } = useCustomers();
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [projectCounts, setProjectCounts] = useState<{[clientId: string]: number}>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: { fullNumber: '+55', countryCode: '55', nationalNumber: '' } as PhoneWithCountryCode
  });
  const { toast } = useToast();

  // Fetch projects from supabase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data: projects, error } = await supabase
          .from('projects')
          .select('id, client_id');
        
        if (error) {
          throw error;
        }

        if (projects) {
          // Count projects for each client
          const counts: {[clientId: string]: number} = {};
          projects.forEach((project: Project) => {
            if (project.client_id) {
              counts[project.client_id] = (counts[project.client_id] || 0) + 1;
            }
          });
          setProjectCounts(counts);
          console.log("Project counts:", counts);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  // Get project count for a client
  const getProjectCount = useCallback((clientId: string) => {
    return projectCounts[clientId] || 0;
  }, [projectCounts]);

  useEffect(() => {
    if (selectedClient && showEditDialog) {
      setFormData({
        name: selectedClient.name,
        email: selectedClient.email,
        phone: { 
          fullNumber: selectedClient.phone || '+55',
          countryCode: '55',
          nationalNumber: selectedClient.phone?.replace('+55', '') || ''
        }
      });
    }
  }, [selectedClient, showEditDialog]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value: PhoneWithCountryCode) => {
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleAddClient = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Dados incompletos",
        description: "Nome e email são campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    addCustomer({
      name: formData.name,
      email: formData.email,
      phone: formData.phone.fullNumber,
      status: 'active',
      projects: 0,
      createdAt: new Date().toISOString()
    });

    toast({
      title: "Cliente adicionado",
      description: `O cliente ${formData.name} foi adicionado com sucesso.`
    });

    setShowNewClientDialog(false);
    setFormData({
      name: '',
      email: '',
      phone: { fullNumber: '+55', countryCode: '55', nationalNumber: '' }
    });
  };

  const handleEditClient = () => {
    if (!selectedClient) return;

    updateCustomer(selectedClient.id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone.fullNumber
    });

    toast({
      title: "Cliente atualizado",
      description: `As informações do cliente ${formData.name} foram atualizadas.`
    });

    setShowEditDialog(false);
    setSelectedClient(null);
  };

  const handleDeleteClient = () => {
    if (!selectedClient) return;

    deleteCustomer(selectedClient.id);

    toast({
      title: "Cliente excluído",
      description: `O cliente ${selectedClient.name} foi excluído.`,
      variant: "destructive"
    });

    setShowDeleteDialog(false);
    setSelectedClient(null);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <Button onClick={() => setShowNewClientDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Projetos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Carregando clientes...
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone || "Não informado"}</TableCell>
                  <TableCell>{getProjectCount(customer.id)}</TableCell>
                  <TableCell>
                    <Badge 
                      className={customer.status === 'active' ? "bg-green-500" : "bg-red-500"}
                    >
                      {customer.status === 'active' ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(customer.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedClient(customer);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedClient(customer);
                            setShowDeleteDialog(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
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

      {/* New Client Dialog */}
      <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium" htmlFor="name">
                Nome do Cliente
              </label>
              <input
                id="name"
                name="name"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="Nome completo"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <PhoneInput
                label="Telefone"
                value={formData.phone}
                onChange={handlePhoneChange}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowNewClientDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddClient}>Adicionar Cliente</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium" htmlFor="edit-name">
                Nome do Cliente
              </label>
              <input
                id="edit-name"
                name="name"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="Nome completo"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="edit-email">
                Email
              </label>
              <input
                id="edit-email"
                name="email"
                type="email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <PhoneInput
                label="Telefone"
                value={formData.phone}
                onChange={handlePhoneChange}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditClient}>Salvar Alterações</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente "{selectedClient?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteClient}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientsList;
