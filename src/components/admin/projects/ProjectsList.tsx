
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSupabaseData } from '@/hooks/use-supabase-data';
import { PlusCircle, Pencil, Trash2, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';

interface Client {
  id: string;
  name: string;
  email: string;
}

interface Project {
  id: string;
  title: string;
  client: string;
  client_id: string;
  status: string;
  progress: number;
  deadline?: string;
  type: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export default function ProjectsList() {
  const navigate = useNavigate();
  const { data: projects, isLoading, addItem, updateItem, deleteItem } = useSupabaseData<Project>('projects', {
    orderBy: { column: 'created_at', ascending: false }
  });
  
  const { data: clients } = useSupabaseData<Client>('clients', {
    orderBy: { column: 'name', ascending: true }
  });
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    client: '',
    client_id: '',
    status: 'pending',
    progress: 0,
    deadline: '',
    type: 'custom',
    description: ''
  });
  
  const { toast } = useToast();
  const projectTypes = [
    { value: 'custom', label: 'Personalizado' },
    { value: 'essential', label: 'Pacote Essencial' },
    { value: 'professional', label: 'Pacote Profissional' },
    { value: 'premium', label: 'Pacote Premium' }
  ];
  
  const statusTypes = [
    { value: 'pending', label: 'Pendente' },
    { value: 'in_progress', label: 'Em Progresso' },
    { value: 'waiting_approval', label: 'Aguardando Aprovação' },
    { value: 'completed', label: 'Concluído' },
    { value: 'canceled', label: 'Cancelado' }
  ];

  const handleAddProject = async () => {
    if (!formData.title || !formData.client_id) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e cliente são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Get client name from the selected client_id
    const selectedClient = clients.find(c => c.id === formData.client_id);
    if (!selectedClient) return;

    await addItem({
      ...formData,
      client: selectedClient.name,
      progress: formData.progress || 0,
      type: formData.type || 'custom'
    });
    
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleUpdateProject = async () => {
    if (!formData.title || !formData.client_id) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e cliente são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Get client name from the selected client_id if it was changed
    if (formData.client_id !== currentProject?.client_id) {
      const selectedClient = clients.find(c => c.id === formData.client_id);
      if (selectedClient) {
        formData.client = selectedClient.name;
      }
    }

    if (currentProject) {
      await updateItem(currentProject.id, formData);
      setIsEditDialogOpen(false);
      resetForm();
    }
  };

  const handleDeleteProject = async () => {
    if (currentProject) {
      await deleteItem(currentProject.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (project: Project) => {
    setCurrentProject(project);
    setFormData({
      title: project.title,
      client: project.client,
      client_id: project.client_id,
      status: project.status,
      progress: project.progress,
      deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
      type: project.type,
      description: project.description || ''
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (project: Project) => {
    setCurrentProject(project);
    setIsDeleteDialogOpen(true);
  };

  const navigateToPreview = (projectId: string) => {
    navigate(`/admin-j28s7d1k/previews/${projectId}`);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      client: '',
      client_id: '',
      status: 'pending',
      progress: 0,
      deadline: '',
      type: 'custom',
      description: ''
    });
    setCurrentProject(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, label: string }> = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pendente" },
      in_progress: { color: "bg-blue-100 text-blue-800", label: "Em Progresso" },
      waiting_approval: { color: "bg-purple-100 text-purple-800", label: "Aguardando Aprovação" },
      completed: { color: "bg-green-100 text-green-800", label: "Concluído" },
      canceled: { color: "bg-red-100 text-red-800", label: "Cancelado" }
    };

    const statusInfo = statusMap[status] || { color: "bg-gray-100 text-gray-800", label: status };

    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
      {statusInfo.label}
    </span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projetos</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Carregando projetos...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progresso</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-[120px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Nenhum projeto cadastrado
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell>
                    {projectTypes.find(t => t.value === project.type)?.label || project.type}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(project.status)}
                  </TableCell>
                  <TableCell>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-harmonia-green h-2.5 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs mt-1">{project.progress}%</span>
                  </TableCell>
                  <TableCell>
                    {project.created_at ? new Date(project.created_at).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(project)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => openDeleteDialog(project)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="default" size="icon" onClick={() => navigateToPreview(project.id)}>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Add Project Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Projeto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título*</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleInputChange} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client">Cliente*</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('client_id', value)} 
                value={formData.client_id}
              >
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
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Projeto*</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('type', value)} 
                value={formData.type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('status', value)} 
                value={formData.status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusTypes.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Prazo</Label>
              <Input 
                id="deadline" 
                name="deadline" 
                type="date" 
                value={formData.deadline} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                name="description" 
                rows={3} 
                value={formData.description} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddProject}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Projeto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título*</Label>
              <Input id="edit-title" name="title" value={formData.title} onChange={handleInputChange} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-client">Cliente*</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('client_id', value)} 
                value={formData.client_id}
              >
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
            
            <div className="space-y-2">
              <Label htmlFor="edit-type">Tipo de Projeto*</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('type', value)} 
                value={formData.type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('status', value)} 
                value={formData.status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusTypes.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-progress">Progresso (%)</Label>
              <Input 
                id="edit-progress" 
                name="progress" 
                type="number" 
                min="0" 
                max="100" 
                value={formData.progress} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-deadline">Prazo</Label>
              <Input 
                id="edit-deadline" 
                name="deadline" 
                type="date" 
                value={formData.deadline} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea 
                id="edit-description" 
                name="description" 
                rows={3} 
                value={formData.description} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateProject}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Tem certeza que deseja excluir o projeto {currentProject?.title}?</p>
            <p className="text-sm text-gray-500">Esta ação não pode ser desfeita.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteProject}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
