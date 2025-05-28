
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Upload, Eye, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import NewAdminLayout from '@/components/admin/layout/NewAdminLayout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      waiting: { label: 'Aguardando', color: 'bg-yellow-500' },
      feedback: { label: 'Feedback', color: 'bg-blue-500' },
      approved: { label: 'Aprovado', color: 'bg-green-500' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: 'bg-gray-500' };
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

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

    setProjects([...projects, newProject]);
    
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

  return (
    <NewAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Projetos</h1>
          <Button onClick={() => setShowNewProjectDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Projetos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Versões</TableHead>
                  <TableHead>Criado</TableHead>
                  <TableHead>Última Atividade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum projeto criado ainda.
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.clientName}</TableCell>
                      <TableCell>{project.title}</TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Upload className="w-4 h-4 text-gray-400" />
                          {project.versionsCount}
                        </div>
                      </TableCell>
                      <TableCell>{project.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {project.lastActivity}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
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
