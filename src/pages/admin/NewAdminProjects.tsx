import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NewAdminLayout from '@/components/admin/layout/NewAdminLayout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProjectCard from '@/components/admin/projects/ProjectCard';
import { useClients, type Client } from '@/hooks/admin/useClients';
import { useProjects, type Project } from '@/hooks/admin/useProjects';

interface DisplayProject {
  id: string;
  clientName: string;
  clientId?: string;
  title: string;
  status: 'waiting' | 'feedback' | 'approved';
  versionsCount: number;
  createdAt: string;
  lastActivity: string;
}

const NewAdminProjects: React.FC = () => {
  const { toast } = useToast();
  const { clients, isLoading: clientsLoading } = useClients();
  const { projects: fetchedProjects, isLoading: projectsLoading, createProject, deleteProject } = useProjects();

  const [displayProjects, setDisplayProjects] = useState<DisplayProject[]>([]);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    packageType: ''
  });

  useEffect(() => {
    const formatted = (fetchedProjects || []).map(p => ({
      id: p.id,
      clientName: p.client_name || 'Cliente Desconhecido',
      clientId: p.client_name,
      title: p.title,
      status: p.status,
      versionsCount: p.versions?.length || 0,
      createdAt: new Date(p.created_at).toLocaleDateString('pt-BR'),
      lastActivity: new Date(p.created_at).toLocaleDateString('pt-BR')
    }));
    setDisplayProjects(formatted);
  }, [fetchedProjects]);

  const handleAddProject = async () => {
    const selectedClient = clients.find(c => c.id === formData.clientId);

    if (!selectedClient || !formData.title) {
      toast({
        title: "Dados incompletos",
        description: "Cliente e título são campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const projectDataForHook = {
        title: formData.title,
        client_name: selectedClient.name,
        client_email: selectedClient.email,
        package_type: formData.packageType,
        status: 'waiting' as 'waiting',
      };

      const result = await createProject(projectDataForHook);

      if (result.success) {
        toast({
          title: "Projeto criado",
          description: `O projeto "${formData.title}" para ${selectedClient.name} foi criado com sucesso.`
        });
        setShowNewProjectDialog(false);
        setFormData({ clientId: '', title: '', packageType: '' });
      }
    } catch (error) {
      console.error("Error in handleAddProject:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredProjects = displayProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const projectStats = {
    total: displayProjects.length,
    waiting: displayProjects.filter(p => p.status === 'waiting').length,
    feedback: displayProjects.filter(p => p.status === 'feedback').length,
    approved: displayProjects.filter(p => p.status === 'approved').length
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
              <div className="text-2xl font-bold">{projectsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : projectStats.total}</div>
              <p className="text-gray-600">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{projectsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : projectStats.waiting}</div>
              <p className="text-gray-600">Aguardando</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{projectsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : projectStats.feedback}</div>
              <p className="text-gray-600">Feedback</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{projectsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : projectStats.approved}</div>
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
          {projectsLoading ? (
            <div className="col-span-full flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-harmonia-green" />
              <span className="ml-2">Carregando projetos...</span>
            </div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project as any} 
                onDelete={deleteProject}
              />
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    {displayProjects.length === 0
                      ? 'Nenhum projeto criado ainda.'
                      : 'Nenhum projeto encontrado com os filtros aplicados.'
                    }
                  </p>
                  {displayProjects.length === 0 && (
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
                <Label htmlFor="clientId">Cliente</Label>
                <Select
                  onValueChange={(value) => handleChange('clientId', value)}
                  value={formData.clientId}
                  disabled={clientsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={clientsLoading ? "Carregando clientes..." : "Selecione um cliente"} />
                  </SelectTrigger>
                  <SelectContent>
                    {!clientsLoading && clients.length === 0 && (
                      <SelectItem value="no-clients" disabled>
                        Nenhum cliente encontrado
                      </SelectItem>
                    )}
                    {!clientsLoading && clients.map((client: Client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">Título do Projeto</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ex: Música de Aniversário - João"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="packageType">Tipo de Pacote</Label>
                <Select
                  onValueChange={(value) => handleChange('packageType', value)}
                  value={formData.packageType}
                >
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
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowNewProjectDialog(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddProject}
                  className="bg-harmonia-green hover:bg-harmonia-green/90"
                  disabled={clientsLoading || !formData.clientId || isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isSubmitting ? "Criando..." : "Criar Projeto"}
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
