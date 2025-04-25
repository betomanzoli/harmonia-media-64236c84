
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Search, Eye, Pencil, Trash, Upload, Music, Play, MoreHorizontal, X } from 'lucide-react';

// Mock portfolio items
const mockPortfolioItems = [
  {
    id: 'PF001',
    title: 'Amor Eterno',
    description: 'Balada romântica para casamento, com piano e violino.',
    category: 'Romântica',
    status: 'published',
    addedAt: '15/05/2023',
    projectId: 'P045'
  },
  {
    id: 'PF002',
    title: 'Jingle ModaStyle',
    description: 'Jingle comercial com ritmo animado e voz feminina.',
    category: 'Comercial',
    status: 'published',
    addedAt: '28/05/2023',
    projectId: 'P046'
  },
  {
    id: 'PF003',
    title: 'Crescimento Empresarial',
    description: 'Trilha instrumental motivacional para vídeo corporativo.',
    category: 'Corporativa',
    status: 'draft',
    addedAt: '10/06/2023',
    projectId: 'P050'
  },
  {
    id: 'PF004',
    title: 'Unidos pela Medicina',
    description: 'Música para formatura com elementos épicos e emocionantes.',
    category: 'Comemorativa',
    status: 'published',
    addedAt: '22/06/2023',
    projectId: 'P051'
  }
];

const AdminPortfolio: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state for new item
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    category: 'Romântica',
    projectId: '',
    audioFile: null as File | null,
    imageFile: null as File | null
  });
  
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setPortfolioItems(mockPortfolioItems);
      setLoading(false);
    }, 800);
  }, []);
  
  const filteredItems = portfolioItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Publicado</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Rascunho</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setNewItem(prev => ({ ...prev, category: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'audio' | 'image') => {
    if (e.target.files && e.target.files[0]) {
      setNewItem(prev => ({ 
        ...prev, 
        [fileType === 'audio' ? 'audioFile' : 'imageFile']: e.target.files![0]
      }));
    }
  };
  
  const handleAddItem = () => {
    const newItemId = `PF${String(portfolioItems.length + 1).padStart(3, '0')}`;
    
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${
      (today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    
    const item = {
      id: newItemId,
      title: newItem.title,
      description: newItem.description,
      category: newItem.category,
      status: 'draft',
      addedAt: formattedDate,
      projectId: newItem.projectId || `P${Math.floor(Math.random() * 900) + 100}`
    };
    
    setPortfolioItems([...portfolioItems, item]);
    setIsAddDialogOpen(false);
    
    // Reset form
    setNewItem({
      title: '',
      description: '',
      category: 'Romântica',
      projectId: '',
      audioFile: null,
      imageFile: null
    });
  };
  
  const handleDeleteItem = (id: string) => {
    setPortfolioItems(portfolioItems.filter(item => item.id !== id));
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciamento do Portfólio</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar ao Portfólio
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Adicionar Item ao Portfólio</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes para adicionar uma nova música ao portfólio.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Título
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={newItem.title}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Categoria
                  </Label>
                  <Select value={newItem.category} onValueChange={handleSelectChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Romântica">Romântica</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                      <SelectItem value="Corporativa">Corporativa</SelectItem>
                      <SelectItem value="Comemorativa">Comemorativa</SelectItem>
                      <SelectItem value="Podcast">Tema para Podcast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="projectId" className="text-right">
                    ID do Projeto
                  </Label>
                  <Input
                    id="projectId"
                    name="projectId"
                    value={newItem.projectId}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Opcional - ex: P123"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Descrição
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newItem.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="audioFile" className="text-right">
                    Áudio
                  </Label>
                  <div className="col-span-3">
                    <div className="flex items-center space-x-2">
                      <Input
                        id="audioFile"
                        type="file"
                        onChange={(e) => handleFileChange(e, 'audio')}
                        accept="audio/*"
                        className="hidden"
                      />
                      <Label
                        htmlFor="audioFile"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Selecionar áudio
                      </Label>
                      {newItem.audioFile && (
                        <span className="text-sm text-gray-500">
                          {newItem.audioFile.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageFile" className="text-right">
                    Imagem
                  </Label>
                  <div className="col-span-3">
                    <div className="flex items-center space-x-2">
                      <Input
                        id="imageFile"
                        type="file"
                        onChange={(e) => handleFileChange(e, 'image')}
                        accept="image/*"
                        className="hidden"
                      />
                      <Label
                        htmlFor="imageFile"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Selecionar imagem
                      </Label>
                      {newItem.imageFile && (
                        <span className="text-sm text-gray-500">
                          {newItem.imageFile.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddItem}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Músicas do Portfólio</CardTitle>
            <CardDescription>
              Gerencie as músicas exibidas no portfólio público do site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar no portfólio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200"></div>
                <p className="mt-2 text-sm text-gray-500">Carregando itens do portfólio...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Adicionado</TableHead>
                      <TableHead>Projeto</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>{item.addedAt}</TableCell>
                        <TableCell>{item.projectId}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm">
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          <div className="flex flex-col items-center">
                            <Music className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-gray-500">Nenhum item encontrado no portfólio.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolio;
