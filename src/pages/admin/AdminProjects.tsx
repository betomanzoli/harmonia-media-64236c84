import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  FileText, 
  MoreHorizontal, 
  RefreshCw,
  Music,
  XCircle,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
  ArrowUpDown,
  HelpCircle
} from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock data for projects
const projects = [
  {
    id: '0001',
    orderId: 'HAR-2025-0001',
    clientName: 'João Silva',
    clientEmail: 'joao.silva@email.com',
    packageType: 'Essencial',
    status: 'Em Andamento',
    progress: 40,
    startDate: '02/04/2025',
    deadline: '16/04/2025',
    currentPhase: 'Prévias'
  },
  {
    id: '0002',
    orderId: 'HAR-2025-0002',
    clientName: 'Maria Oliveira',
    clientEmail: 'maria.oliveira@email.com',
    packageType: 'Profissional',
    status: 'Aguardando Feedback',
    progress: 60,
    startDate: '04/04/2025',
    deadline: '25/04/2025',
    currentPhase: 'Avaliação'
  },
  {
    id: '0003',
    orderId: 'HAR-2025-0003',
    clientName: 'Carlos Mendes',
    clientEmail: 'carlos.mendes@email.com',
    packageType: 'Premium',
    status: 'Concluído',
    progress: 100,
    startDate: '01/03/2025',
    deadline: '01/04/2025',
    currentPhase: 'Entregue'
  },
  {
    id: '0004',
    orderId: 'HAR-2025-0004',
    clientName: 'Ana Sousa',
    clientEmail: 'ana.sousa@email.com',
    packageType: 'Profissional',
    status: 'Atrasado',
    progress: 30,
    startDate: '15/03/2025',
    deadline: '05/04/2025',
    currentPhase: 'Composição'
  },
  {
    id: '0005',
    orderId: 'HAR-2025-0005',
    clientName: 'Felipe Costa',
    clientEmail: 'felipe.costa@email.com',
    packageType: 'Essencial',
    status: 'Novo',
    progress: 10,
    startDate: '07/04/2025',
    deadline: '21/04/2025',
    currentPhase: 'Briefing'
  }
];

const ProjectsGuideDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="w-4 h-4" />
          Guia Rápido
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Guia Rápido - Gerenciamento de Projetos</DialogTitle>
          <DialogDescription>
            Navegue facilmente pelo sistema de gerenciamento de projetos
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Visão Geral das Páginas</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded border">
                <h4 className="font-medium">Lista de Projetos</h4>
                <p className="text-sm text-gray-600">
                  Esta página mostra todos os projetos em andamento, permitindo filtragem por status, prazo e tipo de pacote.
                  Você pode:
                </p>
                <ul className="list-disc pl-6 text-sm text-gray-600 mt-2">
                  <li>Ver uma visão geral de todos os projetos</li>
                  <li>Filtrar projetos por status, pacote, etc.</li>
                  <li>Acessar detalhes de um projeto específico</li>
                  <li>Gerenciar projetos em massa</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded border">
                <h4 className="font-medium">Gerenciamento de Projeto</h4>
                <p className="text-sm text-gray-600">
                  Ao clicar em um projeto, você acessa a página de gerenciamento detalhado, onde pode:
                </p>
                <ul className="list-disc pl-6 text-sm text-gray-600 mt-2">
                  <li>Visualizar e gerenciar as fases do projeto</li>
                  <li>Adicionar notas e documentos</li>
                  <li>Visualizar informações do cliente</li>
                  <li>Gerenciar prévias musicais</li>
                  <li>Acompanhar prazos e progresso</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded border">
                <h4 className="font-medium">Gerenciamento de Prévias</h4>
                <p className="text-sm text-gray-600">
                  Na página de prévias, você pode:
                </p>
                <ul className="list-disc pl-6 text-sm text-gray-600 mt-2">
                  <li>Criar novas prévias para enviar ao cliente</li>
                  <li>Gerenciar as prévias existentes</li>
                  <li>Ver o feedback do cliente</li>
                  <li>Implementar solicitações de ajustes</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Fluxo de Trabalho Recomendado</h3>
            <ol className="list-decimal pl-6 text-sm text-gray-600 space-y-2">
              <li>
                <strong>Acesse novos projetos diariamente</strong>
                <p>Verifique a aba "Novos" para identificar projetos recém-criados.</p>
              </li>
              <li>
                <strong>Analise o briefing e esclareça dúvidas</strong>
                <p>Caso haja qualquer ambiguidade no briefing, entre em contato com o cliente imediatamente.</p>
              </li>
              <li>
                <strong>Siga as fases do projeto</strong>
                <p>Sempre trabalhe seguindo a sequência de fases estabelecida para garantir um fluxo de trabalho organizado.</p>
              </li>
              <li>
                <strong>Mantenha a comunicação</strong>
                <p>Atualize o cliente sobre o progresso, especialmente ao mudar de fase.</p>
              </li>
              <li>
                <strong>Documente decisões e alterações</strong>
                <p>Adicione notas para a equipe sobre decisões importantes e mudanças feitas.</p>
              </li>
              <li>
                <strong>Gerencie prazos proativamente</strong>
                <p>Fique atento aos projetos próximos do prazo ou atrasados, tomando ações preventivas.</p>
              </li>
            </ol>
          </div>
          
          <div className="bg-amber-50 p-4 rounded border border-amber-200 text-amber-800">
            <h4 className="flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4" />
              Dicas Importantes
            </h4>
            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
              <li>Projetos com status "Atrasado" devem receber prioridade máxima</li>
              <li>Sempre verifique o tipo de pacote contratado para entender o escopo de trabalho</li>
              <li>Mantenha as prévias musicais limitadas a 30 segundos e sem permissão de download</li>
              <li>A entrega final deve ser feita apenas após a aprovação completa do cliente</li>
              <li>Em caso de dúvidas sobre o sistema, consulte a documentação detalhada em README.md</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProjectStatus: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'Novo':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Novo</Badge>;
    case 'Em Andamento':
      return <Badge variant="outline" className="bg-harmonia-green/10 text-harmonia-green border-harmonia-green/30">Em Andamento</Badge>;
    case 'Aguardando Feedback':
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Aguardando Feedback</Badge>;
    case 'Atrasado':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Atrasado</Badge>;
    case 'Concluído':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluído</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'Novo':
      return <FileText className="w-4 h-4 text-blue-500" />;
    case 'Em Andamento':
      return <RefreshCw className="w-4 h-4 text-harmonia-green" />;
    case 'Aguardando Feedback':
      return <Clock className="w-4 h-4 text-amber-500" />;
    case 'Atrasado':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case 'Concluído':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    default:
      return <Music className="w-4 h-4" />;
  }
};

const AdminProjects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPackage, setFilterPackage] = useState('all');
  
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesPackage = filterPackage === 'all' || project.packageType === filterPackage;
    
    return matchesSearch && matchesStatus && matchesPackage;
  });
  
  return (
    <AdminLayout>
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Projetos Musicais</h1>
            <p className="text-gray-500">Gerencie todos os projetos em andamento</p>
          </div>
          
          <div className="flex gap-2">
            <Link to="/admin-j28s7d1k/projects/new">
              <Button className="bg-harmonia-green hover:bg-harmonia-green/90 gap-2">
                <Plus className="w-4 h-4" />
                Novo Projeto
              </Button>
            </Link>
            
            <ProjectsGuideDialog />
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>Lista de Projetos</CardTitle>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar por cliente ou ID..."
                    className="pl-8 h-9 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="h-9 w-[130px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Status</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Novo">Novos</SelectItem>
                      <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                      <SelectItem value="Aguardando Feedback">Aguardando Feedback</SelectItem>
                      <SelectItem value="Atrasado">Atrasados</SelectItem>
                      <SelectItem value="Concluído">Concluídos</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterPackage} onValueChange={setFilterPackage}>
                    <SelectTrigger className="h-9 w-[130px]">
                      <div className="flex items-center gap-2">
                        <Music className="h-4 w-4" />
                        <span>Pacote</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Essencial">Essencial</SelectItem>
                      <SelectItem value="Profissional">Profissional</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all" className="text-sm">Todos os Projetos</TabsTrigger>
                <TabsTrigger value="active" className="text-sm">Ativos</TabsTrigger>
                <TabsTrigger value="pending" className="text-sm">Aguardando Ação</TabsTrigger>
                <TabsTrigger value="late" className="text-sm">Atrasados</TabsTrigger>
                <TabsTrigger value="completed" className="text-sm">Concluídos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Pacote</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1">
                            Status
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead>Prazo</TableHead>
                        <TableHead>Fase Atual</TableHead>
                        <TableHead>Progresso</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                            <div className="flex flex-col items-center gap-2">
                              <XCircle className="h-8 w-8 text-gray-300" />
                              <p>Nenhum projeto encontrado com os filtros selecionados</p>
                              <Button 
                                variant="link" 
                                className="text-harmonia-green"
                                onClick={() => {
                                  setSearchTerm('');
                                  setFilterStatus('all');
                                  setFilterPackage('all');
                                }}
                              >
                                Limpar filtros
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProjects.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell className="font-medium">
                              {project.orderId}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{project.clientName}</div>
                                <div className="text-xs text-gray-500">{project.clientEmail}</div>
                              </div>
                            </TableCell>
                            <TableCell>{project.packageType}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <StatusIcon status={project.status} />
                                <ProjectStatus status={project.status} />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className={`text-sm ${project.status === 'Atrasado' ? 'text-red-600 font-medium' : ''}`}>
                                {project.deadline}
                              </div>
                              <div className="text-xs text-gray-500">
                                Início: {project.startDate}
                              </div>
                            </TableCell>
                            <TableCell>{project.currentPhase}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className={`h-2.5 rounded-full ${project.status === 'Atrasado' ? 'bg-red-500' : 'bg-harmonia-green'}`}
                                    style={{ width: `${project.progress}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500">{project.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end">
                                <Link to={`/admin-j28s7d1k/projects/${project.id}`}>
                                  <Button size="sm">
                                    Gerenciar
                                  </Button>
                                </Link>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0 ml-2">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      Ver Detalhes
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      Enviar Email
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      Editar Projeto
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Mostrando {filteredProjects.length} de {projects.length} projetos
                  </p>
                  
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </TabsContent>
              
              {/* Other tab contents would be similar to 'all' */}
              <TabsContent value="active">
                <div className="p-8 text-center text-gray-500">
                  <p>Este conteúdo seria semelhante à aba "Todos", mas filtrando apenas projetos ativos.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="pending">
                <div className="p-8 text-center text-gray-500">
                  <p>Este conteúdo seria semelhante à aba "Todos", mas filtrando apenas projetos aguardando ação.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="late">
                <div className="p-8 text-center text-gray-500">
                  <p>Este conteúdo seria semelhante à aba "Todos", mas filtrando apenas projetos atrasados.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="completed">
                <div className="p-8 text-center text-gray-500">
                  <p>Este conteúdo seria semelhante à aba "Todos", mas filtrando apenas projetos concluídos.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
