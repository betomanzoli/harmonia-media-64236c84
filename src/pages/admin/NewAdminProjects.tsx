import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProjects } from '@/hooks/admin/useProjects';
import { useClients } from '@/hooks/admin/useClients';

const NewAdminProjects: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projects, loading: projectsLoading, createProject } = useProjects();
  const { clients, isLoading: clientsLoading } = useClients();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientId: '',
    packageType: 'essencial',
    deadline: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateProject = async () => {
    if (!formData.title || !formData.clientId) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e cliente são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const selectedClient = clients.find(c => c.id === formData.clientId);
    if (!selectedClient) {
      toast({
        title: "Cliente não encontrado",
        description: "Cliente selecionado não foi encontrado.",
        variant: "destructive"
      });
      return;
    }

    const projectData = {
      title: formData.title,
      description: formData.description,
      client_id: formData.clientId,
      client_name: selectedClient.name,
      client_email: selectedClient.email,
      package_type: formData.packageType,
      status: 'waiting' as const,
      deadline: formData.deadline || undefined,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    const newProject = await createProject(projectData);
    
    if (newProject) {
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        clientId: '',
        packageType: 'essencial',
        deadline: ''
      });
      
      toast({
        title: "Projeto criado",
        description: "Projeto criado com sucesso!"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Aguardando</Badge>;
      case 'feedback':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Feedback</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Aprovado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (projectsLoading || clientsLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Carregando projetos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Projetos Musicais</h1>
          <p className="text-gray-600 mt-1">Gerencie todos os projetos de música personalizada</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Projeto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Título do Projeto *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Música para Casamento"
                />
              </div>
              
              <div>
                <Label htmlFor="client">Cliente *</Label>
                <Select value={formData.clientId} onValueChange={(value) => handleInputChange('clientId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="packageType">Tipo de Pacote</Label>
                <Select value={formData.packageType} onValueChange={(value) => handleInputChange('packageType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="essencial">Essencial</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="completo">Completo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="deadline">Prazo (Opcional)</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descreva o projeto..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={handleCreateProject}>
                Criar Projeto
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="waiting">Aguardando</SelectItem>
            <SelectItem value="feedback">Feedback</SelectItem>
            <SelectItem value="approved">Aprovado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Nenhum projeto encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                      {getStatusBadge(project.status)}
                    </div>
                    <p className="text-gray-600 mb-2">{project.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Cliente: {project.client_name}</span>
                      <span>Pacote: {project.package_type}</span>
                      <span>Criado: {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
                      {project.deadline && (
                        <span>Prazo: {new Date(project.deadline).toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/projects/${project.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NewAdminProjects;
