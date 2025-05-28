
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NewAdminLayout from '@/components/admin/layout/NewAdminLayout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectsCount: number;
  createdAt: string;
}

const NewAdminClients: React.FC = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleAddClient = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Dados incompletos",
        description: "Nome e email são campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newClient: Client = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      projectsCount: 0,
      createdAt: new Date().toLocaleDateString('pt-BR')
    };

    setClients([...clients, newClient]);
    
    toast({
      title: "Cliente adicionado",
      description: `O cliente ${formData.name} foi adicionado com sucesso.`
    });

    setShowNewClientDialog(false);
    setFormData({ name: '', email: '', phone: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <NewAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Clientes</h1>
          <Button onClick={() => setShowNewClientDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Projetos</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum cliente cadastrado ainda.
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone || "Não informado"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <FolderOpen className="w-4 h-4 text-gray-400" />
                          {client.projectsCount}
                        </div>
                      </TableCell>
                      <TableCell>{client.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* New Client Dialog */}
        <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="name">Nome do Cliente</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nome completo"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowNewClientDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddClient} className="bg-harmonia-green hover:bg-harmonia-green/90">
                  Adicionar Cliente
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
