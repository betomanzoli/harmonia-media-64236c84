import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogAction, AlertDialogCancel, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Trash, Search, Plus, CheckCircle, XCircle } from "lucide-react";
import { useCustomers, Customer } from '@/hooks/admin/useCustomers';
import { useToast } from '@/hooks/use-toast';
import PhoneInput, { PhoneWithCountryCode } from '@/components/PhoneInput';

const ClientsList: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, refreshCustomers } = useCustomers();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: {
      fullNumber: '',
      countryCode: '55',
      nationalNumber: ''
    },
    status: 'active' as 'active' | 'inactive',
  });
  
  // Load customers on component mount
  useEffect(() => {
    const loadData = async () => {
      await refreshCustomers();
      setIsLoading(false);
    };
    
    loadData();
  }, [refreshCustomers]);
  
  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle opening edit dialog
  const handleEdit = (customer: Customer) => {
    let phoneData: PhoneWithCountryCode = {
      fullNumber: '',
      countryCode: '55',
      nationalNumber: ''
    };
    
    // Format phone if it exists
    if (customer.phone) {
      // Fixed: Using a new variable instead of trying to reassign phoneNumber
      const cleanPhoneNumber = customer.phone.replace(/\D/g, '');
      
      phoneData = {
        fullNumber: `+${cleanPhoneNumber}`,
        countryCode: cleanPhoneNumber.substring(0, 2),
        nationalNumber: cleanPhoneNumber.substring(2)
      };
    }
    
    setFormData({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: phoneData,
      status: customer.status
    });
    
    setShowEditDialog(true);
  };
  
  // Handle opening delete dialog
  const handleDeleteClick = (customer: Customer) => {
    setFormData({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: {
        fullNumber: customer.phone || '',
        countryCode: '55',
        nationalNumber: ''
      },
      status: customer.status
    });
    
    setShowDeleteDialog(true);
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      phone: {
        fullNumber: '',
        countryCode: '55',
        nationalNumber: ''
      },
      status: 'active'
    });
  };
  
  // Handle form submission for adding a new customer
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e email são obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate phone format if provided
    if (formData.phone.nationalNumber && !formData.phone.fullNumber.startsWith('+')) {
      toast({
        title: "Formato de telefone inválido",
        description: "O telefone deve estar no formato internacional (ex: +5511999999999)",
        variant: "destructive"
      });
      return;
    }
    
    // Create new customer
    addCustomer({
      name: formData.name,
      email: formData.email,
      phone: formData.phone.fullNumber,
      status: formData.status,
      projects: 0,
      createdAt: new Date().toISOString()
    });
    
    toast({
      title: "Cliente adicionado",
      description: `O cliente ${formData.name} foi adicionado com sucesso.`
    });
    
    resetForm();
    setShowAddDialog(false);
  };
  
  // Handle form submission for editing a customer
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e email são obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate phone format if provided
    if (formData.phone.nationalNumber && !formData.phone.fullNumber.startsWith('+')) {
      toast({
        title: "Formato de telefone inválido",
        description: "O telefone deve estar no formato internacional (ex: +5511999999999)",
        variant: "destructive"
      });
      return;
    }
    
    // Update customer
    updateCustomer(formData.id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone.fullNumber,
      status: formData.status
    });
    
    toast({
      title: "Cliente atualizado",
      description: `As informações do cliente ${formData.name} foram atualizadas.`
    });
    
    resetForm();
    setShowEditDialog(false);
  };
  
  // Handle customer deletion
  const handleDelete = () => {
    deleteCustomer(formData.id);
    
    toast({
      title: "Cliente excluído",
      description: `O cliente ${formData.name} foi excluído.`
    });
    
    resetForm();
    setShowDeleteDialog(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar por nome ou email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button
          onClick={() => {
            resetForm();
            setShowAddDialog(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>
    
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Projetos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Carregando clientes...
                </TableCell>
              </TableRow>
            ) : filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone || '—'}</TableCell>
                  <TableCell>{customer.projects}</TableCell>
                  <TableCell>
                    {customer.status === 'active' ? (
                      <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-500/20 text-red-600 hover:bg-red-500/30">
                        <XCircle className="w-3 h-3 mr-1" />
                        Inativo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(customer)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteClick(customer)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Add Client Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Cliente</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome completo"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (WhatsApp)</Label>
                <PhoneInput
                  id="phone"
                  value={formData.phone}
                  onChange={(value) => setFormData({ ...formData, phone: value })}
                  label=""
                />
                <p className="text-xs text-muted-foreground">
                  Formato internacional necessário para funcionar com WhatsApp (ex: +5511999999999)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="status-active"
                      value="active"
                      checked={formData.status === 'active'}
                      onChange={() => setFormData({ ...formData, status: 'active' })}
                      className="mr-2"
                    />
                    <Label htmlFor="status-active" className="cursor-pointer">Ativo</Label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="status-inactive"
                      value="inactive"
                      checked={formData.status === 'inactive'}
                      onChange={() => setFormData({ ...formData, status: 'inactive' })}
                      className="mr-2"
                    />
                    <Label htmlFor="status-inactive" className="cursor-pointer">Inativo</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)} className="mr-2">
                Cancelar
              </Button>
              <Button type="submit">Adicionar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Client Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome *</Label>
                <Input 
                  id="edit-name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome completo"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input 
                  id="edit-email" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Telefone (WhatsApp)</Label>
                <PhoneInput
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(value) => setFormData({ ...formData, phone: value })}
                  label=""
                />
                <p className="text-xs text-muted-foreground">
                  Formato internacional necessário para funcionar com WhatsApp (ex: +5511999999999)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="edit-status-active"
                      value="active"
                      checked={formData.status === 'active'}
                      onChange={() => setFormData({ ...formData, status: 'active' })}
                      className="mr-2"
                    />
                    <Label htmlFor="edit-status-active" className="cursor-pointer">Ativo</Label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="edit-status-inactive"
                      value="inactive"
                      checked={formData.status === 'inactive'}
                      onChange={() => setFormData({ ...formData, status: 'inactive' })}
                      className="mr-2"
                    />
                    <Label htmlFor="edit-status-inactive" className="cursor-pointer">Inativo</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)} className="mr-2">
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente <strong>{formData.name}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
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
