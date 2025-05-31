
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
import ProjectCard from '@/components/admin/projects/ProjectCard';

interface Project {
  id: string;
  clientName: string;
  title: string;
  status: 'waiting' | 'feedback' | 'approved';
  versionsCount: number;
  createdAt: string;
  lastActivity: string;
}

const NewAdminProjects: React.FC = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      clientName: 'João Silva',
      title: 'Música Personalizada - João Silva',
      status: 'waiting',
      versionsCount: 2,
      createdAt: '15/01/2024',
      lastActivity: '20/01/2024'
    },
    {
      id: '2',
      clientName: 'Maria Santos',
      title: 'Trilha Sonora - Casamento',
      status: 'feedback',
      versionsCount: 1,
      createdAt: '10/01/2024',
      lastActivity: '18/01/2024'
    },
    {
      id: '3',
      clientName: 'Pedro Oliveira',
      title: 'Jingle Comercial',
      status: 'approved',
      versionsCount: 3,
      createdAt: '05/01/2024',
      lastActivity: '15/01/2024'
    }
  ]);
  
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    clientName: '',
    title: '',
    packageType: ''
  });

  const mockClients = [
    { id: '1', name: 'João Silva' },
    { id: '2', name: 'Maria Santos' },
    { id: '3', name: 'Pedro Oliveira' }
  ];

  const handleAddProject = () => {
    if (!formData.clientName || !formData.title) {
      toast({
        title: "Dados incompletos",
        description: "Cliente e título são campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      clientName: formData.clientName,
      title: formData.title,
      status: 'waiting',
      versionsCount: 0,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      lastActivity: new Date().toLocaleDateString('pt-BR')
    };

    setProjects([newProject, ...projects]);
    
    toast({
      title: "Projeto criado",
      description: `O projeto "${formData.title}" foi criado com sucesso.`
    });

    setShowNewProjectDialog(false);
    setFormData({ clientName: '', title: '', packageType: '' });
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const projectStats = {
    total: projects.length,
    waiting: projects.filter(p => p.status === 'waiting').length,
    feedback: projects.filter(p => p.status === 'feedback').length,
    approved: projects.filter(p => p.status === 'approved').length
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
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
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
                <Label htmlFor="clientName">Cliente</Label>
                <Select onValueChange={(value) => handleChange('clientName', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClients.map((client) => (
                      <SelectItem key={client.id} value={client.name}>
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
                <Select onValueChange={(value) => handleChange('packageType', value)}>
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
