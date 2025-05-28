
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NewAdminLayout from '@/components/admin/layout/NewAdminLayout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import AdminAuth from '@/components/admin/AdminAuth';
import { useProjectManagement } from '@/hooks/useProjectManagement';

const NewAdminProjects: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const { projects, loading, createProject } = useProjectManagement();
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    package_type: 'essencial',
    title: '',
    description: ''
  });

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const handleAddProject = async () => {
    if (!formData.client_name || !formData.title || !formData.client_email) {
      toast({
        title: "Dados incompletos",
        description: "Nome do cliente, email e título são campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      await createProject({
        title: formData.title,
        description: formData.description,
        client_name: formData.client_name,
        client_email: formData.client_email,
        package_type: formData.package_type,
        status: 'waiting'
      });

      toast({
        title: "Projeto criado",
        description: `O projeto "${formData.title}" foi criado com sucesso.`
      });

      setShowNewProjectDialog(false);
      setFormData({ client_name: '', client_email: '', package_type: 'essencial', title: '', description: '' });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Houve um erro ao criar o projeto. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.client_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const projectStats = {
    total: projects.length,
    waiting: projects.filter(p => p.status === 'waiting').length,
    feedback: projects.filter(p => p.status === 'feedback').length,
    approved: projects.filter(p => p.status === 'approved').length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge className="bg-yellow-500">Aguardando</Badge>;
      case 'feedback':
        return <Badge className="bg-blue-500">Feedback</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Aprovado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <NewAdminLayout>
      <div className="p-6 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Projetos</h1>
          <Button onClick={() => setShowNewProjectDialog(true)} className="bg-harmonia-green hover:bg-harmonia-green/90">
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{projectStats.total}</div>
              <p className="text-gray-600">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{projectStats.waiting}</div>
              <p className="text-gray-600">Aguardando</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{projectStats.feedback}</div>
              <p className="text-gray-600">Feedback</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{projectStats.approved}</div>
              <p className="text-gray-600">Aprovados</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por projeto ou cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="waiting">Aguardando</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <p>Carregando projetos...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{project.client_name}</span>
                    {getStatusBadge(project.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Criado: {new Date(project.created_at).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Email: {project.client_email}
                    </p>
                    <p className="text-sm text-gray-600">
                      Pacote: {project.package_type || 'Não definido'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Versões: {project.versions.length}
                    </p>
                    <div className="pt-2 space-y-2">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link to={`/client-preview/preview_${project.id}`}>
                          Ver Preview Cliente
                        </Link>
                      </Button>
                      <Button asChild size="sm" className="w-full bg-harmonia-green hover:bg-harmonia-green/90">
                        <Link to={`/admin-j28s7d1k/previews?project=${project.id}`}>
                          Gerenciar Projeto
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    {projects.length === 0 
                      ? 'Nenhum projeto criado ainda.' 
                      : 'Nenhum projeto encontrado com os filtros aplicados.'
                    }
                  </p>
                  {projects.length === 0 && (
                    <Button onClick={() => setShowNewProjectDialog(true)}>
                      Criar Primeiro Projeto
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* New Project Dialog */}
        <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Projeto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="client_name">Nome do Cliente</Label>
                <Input
                  id="client_name"
                  placeholder="Nome completo do cliente"
                  value={formData.client_name}
                  onChange={(e) => handleChange('client_name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="client_email">Email do Cliente</Label>
                <Input
                  id="client_email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.client_email}
                  onChange={(e) => handleChange('client_email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="title">Título do Projeto</Label>
                <Input
                  id="title"
                  placeholder="Ex: Música de Aniversário - João"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="package_type">Tipo de Pacote</Label>
                <Select onValueChange={(value) => handleChange('package_type', value)} value={formData.package_type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o pacote" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="essencial">Essencial</SelectItem>
                    <SelectItem value="profissional">Profissional</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Descrição (Opcional)</Label>
                <Input
                  id="description"
                  placeholder="Detalhes do projeto..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowNewProjectDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddProject} className="bg-harmonia-green hover:bg-harmonia-green/90">
                  Criar Projeto
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </NewAdminLayout>
  );
};

export default NewAdminProjects;
