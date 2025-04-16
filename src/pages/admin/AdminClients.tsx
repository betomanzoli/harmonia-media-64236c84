
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus, Filter, Search, MoreHorizontal, Mail, Package, CalendarClock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Client {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  projectsCount: number;
  totalSpent: string;
  lastPurchase: string;
}

const AdminClients: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Mock client data - in a real implementation, this would come from the database
  const [clients] = useState<Client[]>([
    {
      id: 'CLI-001',
      name: 'João Silva',
      email: 'joao.silva@email.com',
      status: 'active',
      projectsCount: 2,
      totalSpent: 'R$ 2.994,00',
      lastPurchase: '10/04/2025'
    },
    {
      id: 'CLI-002',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@email.com',
      status: 'active',
      projectsCount: 1,
      totalSpent: 'R$ 1.997,00',
      lastPurchase: '15/04/2025'
    },
    {
      id: 'CLI-003',
      name: 'Carlos Santos',
      email: 'carlos.santos@email.com',
      status: 'inactive',
      projectsCount: 1,
      totalSpent: 'R$ 997,00',
      lastPurchase: '20/03/2025'
    }
  ]);

  const filteredClients = clients.filter(client => {
    // Filter by search term
    const matchesSearch = searchTerm === '' || 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewProjects = (clientId: string) => {
    navigate(`/admin-j28s7d1k/projects?client=${clientId}`);
  };

  const handleSendEmail = (email: string) => {
    toast({
      title: "Enviar email",
      description: `Preparando para enviar email para ${email}`
    });
  };

  const handleExportData = (clientId: string) => {
    toast({
      title: "Exportar dados",
      description: `Exportando dados do cliente ${clientId}`
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie os clientes e visualize informações sobre seus projetos
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
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Filtrar Clientes</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-harmonia-green"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
              >
                Limpar Filtros
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar por nome, email ou ID..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="w-full sm:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="inactive">Inativos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="sm:w-auto bg-harmonia-green hover:bg-harmonia-green/90 flex items-center gap-2"
                  onClick={() => {
                    toast({
                      title: "Adicionar cliente",
                      description: "Funcionalidade de adicionar cliente será implementada em breve"
                    });
                  }}
                >
                  <UserPlus className="h-4 w-4" />
                  Adicionar Cliente
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Projetos</TableHead>
                      <TableHead>Total Gasto</TableHead>
                      <TableHead>Última Compra</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                          Nenhum cliente encontrado com os filtros atuais
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{client.name}</p>
                              <p className="text-sm text-gray-500">{client.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={client.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                              {client.status === 'active' ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                          <TableCell>{client.projectsCount}</TableCell>
                          <TableCell>{client.totalSpent}</TableCell>
                          <TableCell>{client.lastPurchase}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleViewProjects(client.id)}>
                                  <Package className="mr-2 h-4 w-4" />
                                  Ver Projetos
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSendEmail(client.email)}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Enviar Email
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExportData(client.id)}>
                                  <CalendarClock className="mr-2 h-4 w-4" />
                                  Exportar Histórico
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
    </AdminLayout>
  );
};

export default AdminClients;
