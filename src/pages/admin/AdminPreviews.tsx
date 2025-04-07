
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Plus, Eye, Upload, X, Check, RefreshCw, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const AdminPreviews: React.FC = () => {
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([
    {
      id: 'HAR-2025-0001',
      clientName: 'João Silva',
      clientEmail: 'joao.silva@email.com',
      packageType: 'Profissional',
      createdAt: '05/04/2025',
      status: 'waiting',
      versions: 3,
      previewUrl: '/previews/preview123',
      expirationDate: '12/04/2025'
    },
    {
      id: 'HAR-2025-0002',
      clientName: 'Maria Oliveira',
      clientEmail: 'maria.oliveira@email.com',
      packageType: 'Premium',
      createdAt: '06/04/2025',
      status: 'feedback',
      versions: 5,
      previewUrl: '/previews/preview456',
      expirationDate: '13/04/2025'
    },
    {
      id: 'HAR-2025-0003',
      clientName: 'Carlos Mendes',
      clientEmail: 'carlos.mendes@email.com',
      packageType: 'Essencial',
      createdAt: '07/04/2025',
      status: 'approved',
      versions: 2,
      previewUrl: '/previews/preview789',
      expirationDate: '14/04/2025'
    }
  ]);
  
  const [newProject, setNewProject] = useState({
    clientName: '',
    clientEmail: '',
    packageType: 'Essencial',
    expirationDays: '7',
    versions: [
      { title: '', description: '', audioFile: null }
    ]
  });
  
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleAddVersion = () => {
    setNewProject(prev => ({
      ...prev,
      versions: [
        ...prev.versions,
        { title: '', description: '', audioFile: null }
      ]
    }));
  };
  
  const handleRemoveVersion = (indexToRemove: number) => {
    if (newProject.versions.length <= 1) {
      toast({
        title: "Operação não permitida",
        description: "É necessário pelo menos uma versão musical.",
        variant: "destructive"
      });
      return;
    }
    
    setNewProject(prev => ({
      ...prev,
      versions: prev.versions.filter((_, index) => index !== indexToRemove)
    }));
  };
  
  const handleVersionChange = (index: number, field: 'title' | 'description', value: string) => {
    const updatedVersions = [...newProject.versions];
    updatedVersions[index] = {
      ...updatedVersions[index],
      [field]: value
    };
    
    setNewProject(prev => ({
      ...prev,
      versions: updatedVersions
    }));
  };
  
  const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const updatedVersions = [...newProject.versions];
    updatedVersions[index] = {
      ...updatedVersions[index],
      audioFile: file
    };
    
    setNewProject(prev => ({
      ...prev,
      versions: updatedVersions
    }));
  };
  
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    // Validação básica
    const hasEmptyFields = newProject.versions.some(v => !v.title || !v.description || !v.audioFile);
    
    if (hasEmptyFields) {
      toast({
        title: "Campos incompletos",
        description: "Preencha todos os campos e anexe arquivos de áudio para todas as versões.",
        variant: "destructive"
      });
      setIsCreating(false);
      return;
    }
    
    // Simular upload de arquivos
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      
      // Simular criação bem-sucedida
      const newId = `HAR-2025-000${projects.length + 1}`;
      const today = new Date();
      const expirationDate = new Date();
      expirationDate.setDate(today.getDate() + parseInt(newProject.expirationDays));
      
      setProjects(prev => [
        {
          id: newId,
          clientName: newProject.clientName,
          clientEmail: newProject.clientEmail,
          packageType: newProject.packageType,
          createdAt: today.toLocaleDateString('pt-BR'),
          status: 'waiting',
          versions: newProject.versions.length,
          previewUrl: `/previews/${newId.toLowerCase().replace(/-/g, '')}`,
          expirationDate: expirationDate.toLocaleDateString('pt-BR')
        },
        ...prev
      ]);
      
      // Resetar formulário
      setNewProject({
        clientName: '',
        clientEmail: '',
        packageType: 'Essencial',
        expirationDays: '7',
        versions: [
          { title: '', description: '', audioFile: null }
        ]
      });
      
      toast({
        title: "Projeto criado com sucesso!",
        description: `O projeto ${newId} foi criado e o cliente será notificado.`,
      });
      
      setIsCreating(false);
    }, 2000);
  };
  
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'waiting':
        return { label: 'Aguardando Avaliação', color: 'bg-yellow-500 text-white' };
      case 'feedback':
        return { label: 'Feedback Recebido', color: 'bg-blue-500 text-white' };
      case 'approved':
        return { label: 'Música Aprovada', color: 'bg-green-500 text-white' };
      default:
        return { label: status, color: 'bg-gray-500 text-white' };
    }
  };
  
  return (
    <AdminLayout>
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Prévias Musicais</h1>
            <p className="text-gray-500">Crie e gerencie versões musicais para avaliação dos clientes</p>
          </div>
          <Button 
            className="bg-harmonia-green hover:bg-harmonia-green/90"
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>
        </div>
        
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Projetos de Prévias</CardTitle>
            <CardDescription>
              Lista de projetos ativos para avaliação dos clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Pacote</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Expira em</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Versões</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map(project => {
                  const status = getStatusDisplay(project.status);
                  return (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.id}</TableCell>
                      <TableCell>
                        <div>
                          <p>{project.clientName}</p>
                          <p className="text-sm text-gray-500">{project.clientEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>{project.packageType}</TableCell>
                      <TableCell>{project.createdAt}</TableCell>
                      <TableCell>{project.expirationDate}</TableCell>
                      <TableCell>
                        <Badge className={status.color}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>{project.versions}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" 
                            onClick={() => window.open(project.previewUrl, '_blank')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline"
                            onClick={() => toast({
                              title: "Email enviado",
                              description: `Um lembrete foi enviado para ${project.clientEmail}`
                            })}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card id="new-project-form">
          <CardHeader>
            <CardTitle>Criar Novo Projeto de Prévias</CardTitle>
            <CardDescription>
              Preencha os dados do cliente e faça upload das versões musicais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateProject}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome do Cliente</label>
                  <Input
                    value={newProject.clientName}
                    onChange={e => setNewProject(prev => ({ ...prev, clientName: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email do Cliente</label>
                  <Input
                    type="email"
                    value={newProject.clientEmail}
                    onChange={e => setNewProject(prev => ({ ...prev, clientEmail: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pacote</label>
                  <Select
                    value={newProject.packageType}
                    onValueChange={value => setNewProject(prev => ({ ...prev, packageType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o pacote" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Essencial">Essencial</SelectItem>
                      <SelectItem value="Profissional">Profissional</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prazo para Avaliação</label>
                  <Select
                    value={newProject.expirationDays}
                    onValueChange={value => setNewProject(prev => ({ ...prev, expirationDays: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o prazo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 dias</SelectItem>
                      <SelectItem value="7">7 dias</SelectItem>
                      <SelectItem value="10">10 dias</SelectItem>
                      <SelectItem value="15">15 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Versões Musicais</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddVersion}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Versão
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {newProject.versions.map((version, index) => (
                    <Card key={index} className="p-4 border-l-4 border-l-harmonia-green/60">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Versão {index + 1}</h4>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveVersion(index)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-100/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Título da Versão</label>
                          <Input
                            value={version.title}
                            onChange={e => handleVersionChange(index, 'title', e.target.value)}
                            placeholder="Ex: Versão Acústica"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Arquivo de Áudio</label>
                          <div className="flex items-center">
                            <Input
                              type="file"
                              accept="audio/*"
                              onChange={e => handleFileChange(index, e)}
                              className="hidden"
                              id={`audio-file-${index}`}
                              required={!version.audioFile}
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => document.getElementById(`audio-file-${index}`)?.click()}
                              className="w-full flex items-center justify-center"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              {version.audioFile ? version.audioFile.name : "Selecionar Arquivo"}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Descrição da Versão</label>
                        <Textarea
                          value={version.description}
                          onChange={e => handleVersionChange(index, 'description', e.target.value)}
                          placeholder="Descreva as características desta versão musical..."
                          required
                          className="min-h-[120px]"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-harmonia-green hover:bg-harmonia-green/90"
                  disabled={isCreating || isUploading}
                >
                  {isCreating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      {isUploading ? 'Enviando arquivos...' : 'Criando projeto...'}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Criar Projeto e Notificar Cliente
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPreviews;
