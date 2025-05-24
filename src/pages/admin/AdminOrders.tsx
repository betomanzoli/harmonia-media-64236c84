
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Filter, ArrowRight, Search, CheckSquare, 
  Calendar, Clock, Package, MoreHorizontal, BookOpen
} from 'lucide-react';
import { DeliverableChecklist } from '@/components/order/DeliverableChecklist';
import { 
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, 
  DropdownMenuItem, DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

// Sample order data
const mockOrders = [
  {
    id: 'ORD-001',
    customerName: 'Roberto Silva',
    packageType: 'premium',
    orderDate: '2025-04-01T14:30:00',
    deadline: '2025-04-15T23:59:59',
    status: 'em-andamento',
    progress: 70,
  },
  {
    id: 'ORD-002',
    customerName: 'Maria Pereira',
    packageType: 'essencial',
    orderDate: '2025-04-05T10:15:00',
    deadline: '2025-04-19T23:59:59',
    status: 'aguardando-briefing',
    progress: 20,
  },
  {
    id: 'ORD-003',
    customerName: 'Carlos Santos',
    packageType: 'profissional',
    orderDate: '2025-04-03T09:45:00',
    deadline: '2025-04-17T23:59:59',
    status: 'em-andamento',
    progress: 50,
  },
  {
    id: 'ORD-004',
    customerName: 'Ana Oliveira',
    packageType: 'premium',
    orderDate: '2025-03-28T16:20:00',
    deadline: '2025-04-11T23:59:59',
    status: 'aprovado',
    progress: 100,
  },
];

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'aguardando-briefing':
      return 'bg-amber-100 text-amber-700';
    case 'em-andamento':
      return 'bg-blue-100 text-blue-700';
    case 'aprovado':
      return 'bg-green-100 text-green-700';
    case 'cancelado':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'aguardando-briefing':
      return 'Aguardando briefing';
    case 'em-andamento':
      return 'Em andamento';
    case 'aprovado':
      return 'Aprovado';
    case 'cancelado':
      return 'Cancelado';
    default:
      return 'Desconhecido';
  }
};

const AdminOrders: React.FC = () => {
  const [activeTab, setActiveTab] = useState('todos');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredOrders = mockOrders.filter(order => {
    // Filter by search term
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tab
    if (activeTab === 'todos') return matchesSearch;
    if (activeTab === 'briefing') return order.status === 'aguardando-briefing' && matchesSearch;
    if (activeTab === 'andamento') return order.status === 'em-andamento' && matchesSearch;
    if (activeTab === 'aprovados') return order.status === 'aprovado' && matchesSearch;
    
    return matchesSearch;
  });
  
  const selectedOrderData = mockOrders.find(order => order.id === selectedOrder);
  
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">Pedidos e Entregas</h1>
            <p className="text-muted-foreground">
              Gerencie os pedidos de clientes e acompanhe as entregas
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID ou nome do cliente..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>
        
        <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="briefing">Aguardando Briefing</TabsTrigger>
            <TabsTrigger value="andamento">Em Andamento</TabsTrigger>
            <TabsTrigger value="aprovados">Aprovados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="todos" className="mt-4">
            <OrdersTable 
              orders={filteredOrders} 
              onSelectOrder={setSelectedOrder} 
              selectedOrderId={selectedOrder}
            />
          </TabsContent>
          
          <TabsContent value="briefing" className="mt-4">
            <OrdersTable 
              orders={filteredOrders} 
              onSelectOrder={setSelectedOrder} 
              selectedOrderId={selectedOrder}
            />
          </TabsContent>
          
          <TabsContent value="andamento" className="mt-4">
            <OrdersTable 
              orders={filteredOrders} 
              onSelectOrder={setSelectedOrder} 
              selectedOrderId={selectedOrder}
            />
          </TabsContent>
          
          <TabsContent value="aprovados" className="mt-4">
            <OrdersTable 
              orders={filteredOrders} 
              onSelectOrder={setSelectedOrder} 
              selectedOrderId={selectedOrder}
            />
          </TabsContent>
        </Tabs>
        
        {selectedOrderData && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Pedido: {selectedOrderData.id}</CardTitle>
                  <CardDescription>
                    Cliente: {selectedOrderData.customerName} | Pacote: {selectedOrderData.packageType.charAt(0).toUpperCase() + selectedOrderData.packageType.slice(1)}
                  </CardDescription>
                </div>
                <Button variant="outline" className="text-harmonia-green" size="sm">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Ver Briefing
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informações do Pedido</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Data do Pedido</p>
                        <p className="text-sm text-gray-500">
                          {new Date(selectedOrderData.orderDate).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Prazo de Entrega</p>
                        <p className="text-sm text-gray-500">
                          {new Date(selectedOrderData.deadline).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Status do Pedido</p>
                        <div className={`inline-block px-2 py-1 rounded text-xs mt-1 ${getStatusBadgeClass(selectedOrderData.status)}`}>
                          {getStatusLabel(selectedOrderData.status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckSquare className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Progresso da Entrega</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div 
                            className="bg-harmonia-green h-2.5 rounded-full" 
                            style={{ width: `${selectedOrderData.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{selectedOrderData.progress}% concluído</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <DeliverableChecklist 
                    packageType={selectedOrderData.packageType} 
                    orderId={selectedOrderData.id}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

interface OrdersTableProps {
  orders: typeof mockOrders;
  onSelectOrder: (id: string) => void;
  selectedOrderId: string | null;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onSelectOrder, selectedOrderId }) => {
  return (
    <Table>
      <TableCaption>Lista de pedidos e entregas</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Pacote</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Prazo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Progresso</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8">
              Nenhum pedido encontrado
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => (
            <TableRow 
              key={order.id} 
              className={selectedOrderId === order.id ? 'bg-harmonia-green/5' : ''}
              onClick={() => onSelectOrder(order.id)}
            >
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell className="capitalize">{order.packageType}</TableCell>
              <TableCell>
                {new Date(order.orderDate).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </TableCell>
              <TableCell>
                {new Date(order.deadline).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </TableCell>
              <TableCell>
                <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusBadgeClass(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-harmonia-green h-2 rounded-full" 
                      style={{ width: `${order.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{order.progress}%</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onSelectOrder(order.id)}>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Ver entregáveis
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Ver briefing
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      Cancelar pedido
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default AdminOrders;
