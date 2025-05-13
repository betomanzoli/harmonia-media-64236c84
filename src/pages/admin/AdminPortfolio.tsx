import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, RefreshCw, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from '@/components/ui/separator';
import AddPortfolioItemForm from '@/components/admin/portfolio/AddPortfolioItemForm';
interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  fileId?: string;
  type: 'example' | 'comparison' | 'stem';
  dateAdded: string;
  featured?: boolean;
}
const AdminPortfolio: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const {
    toast
  } = useToast();
  useEffect(() => {
    loadPortfolioItems();
  }, []);
  const loadPortfolioItems = async () => {
    setIsLoading(true);
    try {
      // Load from localStorage for now
      const storedItems = localStorage.getItem('harmonIA_portfolio_items');
      if (storedItems) {
        setPortfolioItems(JSON.parse(storedItems));
      } else {
        // Sample items for testing
        const sampleItems = [{
          id: 'p1',
          title: 'Aniversário de Casamento',
          description: 'Composição romântica para comemorar 10 anos de casamento',
          audioUrl: 'https://drive.google.com/uc?export=download&id=1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl',
          fileId: '1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl',
          type: 'example' as const,
          dateAdded: new Date().toLocaleDateString('pt-BR'),
          featured: true
        }, {
          id: 'p2',
          title: 'Comparação: AI vs Versão Finalizada',
          description: 'Demonstração da diferença entre a versão inicial gerada por IA e a versão finalizada',
          audioUrl: 'https://drive.google.com/uc?export=download&id=11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a',
          fileId: '11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a',
          type: 'comparison' as const,
          dateAdded: new Date().toLocaleDateString('pt-BR')
        }];
        setPortfolioItems(sampleItems);
        localStorage.setItem('harmonIA_portfolio_items', JSON.stringify(sampleItems));
      }
    } catch (error) {
      console.error('Erro ao carregar itens do portfólio:', error);
      toast({
        title: "Erro ao carregar portfólio",
        description: "Ocorreu um erro ao carregar os itens do portfólio",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddItem = (item: Omit<PortfolioItem, 'id'>) => {
    const newItem = {
      ...item,
      id: `p${Date.now()}`,
      dateAdded: new Date().toLocaleDateString('pt-BR')
    };
    const updatedItems = [...portfolioItems, newItem];
    setPortfolioItems(updatedItems);
    localStorage.setItem('harmonIA_portfolio_items', JSON.stringify(updatedItems));
    toast({
      title: "Item adicionado",
      description: "Item adicionado ao portfólio com sucesso."
    });
    setShowAddForm(false);
    return newItem.id;
  };
  const confirmDeleteItem = (id: string) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };
  const handleDeleteItem = () => {
    if (!itemToDelete) return;
    const updatedItems = portfolioItems.filter(item => item.id !== itemToDelete);
    setPortfolioItems(updatedItems);
    localStorage.setItem('harmonIA_portfolio_items', JSON.stringify(updatedItems));
    toast({
      title: "Item removido",
      description: "Item removido do portfólio com sucesso."
    });
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };
  const handleToggleFeatured = (id: string) => {
    const updatedItems = portfolioItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          featured: !item.featured
        };
      }
      return item;
    });
    setPortfolioItems(updatedItems);
    localStorage.setItem('harmonIA_portfolio_items', JSON.stringify(updatedItems));
    toast({
      title: "Item atualizado",
      description: "Status de destaque atualizado com sucesso."
    });
  };
  const getFilteredItems = () => {
    if (activeTab === 'all') return portfolioItems;
    return portfolioItems.filter(item => item.type === activeTab);
  };
  const getItemTypeLabel = (type: string) => {
    switch (type) {
      case 'example':
        return 'Exemplo';
      case 'comparison':
        return 'Comparação';
      case 'stem':
        return 'Stem';
      default:
        return type;
    }
  };
  return <AdminLayout>
      <div className="flex flex-col h-full bg-gray-100">
        <div className="flex justify-between items-center p-6 border-b bg-white">
          <div className="flex items-center">
            <Button variant="outline" size="sm" asChild className="mr-4">
              <Link to="/admin-j28s7d1k/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Gerenciador de Portfólio</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={loadPortfolioItems}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            
            <Button size="sm" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </div>
        </div>
        
        <div className="p-6 flex-1 overflow-auto">
          <Card className="bg-white shadow mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Itens do Portfólio</CardTitle>
              <CardDescription>
                Gerencie os exemplos de músicas exibidos no site.
              </CardDescription>
              
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList>
                  <TabsTrigger value="all">Todos ({portfolioItems.length})</TabsTrigger>
                  <TabsTrigger value="example">Exemplos ({portfolioItems.filter(i => i.type === 'example').length})</TabsTrigger>
                  <TabsTrigger value="comparison">Comparações ({portfolioItems.filter(i => i.type === 'comparison').length})</TabsTrigger>
                  <TabsTrigger value="stem">Stems ({portfolioItems.filter(i => i.type === 'stem').length})</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="">
              {isLoading ? <div className="flex justify-center py-20">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div> : getFilteredItems().length > 0 ? <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredItems().map(item => <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getItemTypeLabel(item.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.dateAdded}</TableCell>
                        <TableCell>
                          {item.featured ? <Badge className="bg-green-500">Em destaque</Badge> : <Badge variant="outline">Normal</Badge>}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Ações
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Opções</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleToggleFeatured(item.id)}>
                                {item.featured ? 'Remover destaque' : 'Marcar como destaque'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => confirmDeleteItem(item.id)} className="text-red-600">
                                Remover
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table> : <div className="text-center py-10 text-gray-500">
                  Nenhum item encontrado.
                </div>}
            </CardContent>
          </Card>
        </div>
        
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Item ao Portfólio</DialogTitle>
            </DialogHeader>
            <Separator className="my-4" />
            <AddPortfolioItemForm onAdd={handleAddItem} onCancel={() => setShowAddForm(false)} />
          </DialogContent>
        </Dialog>
        
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Você tem certeza que deseja excluir este item do portfólio? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDeleteItem}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>;
};
export default AdminPortfolio;