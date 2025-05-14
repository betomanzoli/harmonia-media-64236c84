
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Search, Plus } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCustomers } from '@/hooks/admin/useCustomers';
import PhoneInput, { PhoneWithCountryCode } from '@/components/PhoneInput';

const dummyProjects = [
  {
    id: "P001",
    title: "Música Personalizada - Aniversário",
    client: "João Silva",
    dateCreated: "15/03/2025",
    status: "Em andamento",
    deadline: "30/03/2025",
  },
  {
    id: "P002",
    title: "Jingle Comercial - Loja XYZ",
    client: "Maria Oliveira",
    dateCreated: "10/03/2025",
    status: "Concluído",
    deadline: "22/03/2025",
  },
  {
    id: "P003",
    title: "Trilha Sonora - Vídeo Institucional",
    client: "Empresa ABC",
    dateCreated: "05/03/2025",
    status: "Aguardando aprovação",
    deadline: "28/03/2025",
  }
];

const ProjectsList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { customers } = useCustomers();
  
  // Form state
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [packageType, setPackageType] = useState("");
  const [phone, setPhone] = useState<PhoneWithCountryCode>({
    fullNumber: '',
    countryCode: '55',
    nationalNumber: ''
  });
  
  const handleSelectClient = (clientId: string) => {
    const customer = customers.find(c => c.id === clientId);
    if (!customer) return;
    
    setSelectedClientId(customer.id);
    setClientName(customer.name);
    setClientEmail(customer.email);
    
    if (customer.phone) {
      const phoneNumber = customer.phone.replace(/\D/g, '');
      const countryCode = phoneNumber.substring(0, 2);
      const nationalNumber = phoneNumber.substring(2);
      
      setPhone({
        fullNumber: customer.phone,
        countryCode,
        nationalNumber
      });
    }
  };
  
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectTitle || !clientName || !packageType) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate phone format
    if (!phone.fullNumber || !phone.fullNumber.startsWith('+')) {
      toast({
        title: "Formato de telefone inválido",
        description: "O telefone deve estar no formato internacional (ex: +5511999999999)",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Projeto criado",
      description: "O projeto foi criado com sucesso!"
    });
    
    setIsDialogOpen(false);
    
    // Reset form fields
    setProjectTitle("");
    setProjectDescription("");
    setSelectedClientId("");
    setClientName("");
    setClientEmail("");
    setPackageType("");
    setPhone({
      fullNumber: '',
      countryCode: '55',
      nationalNumber: ''
    });
  };
  
  // Filter projects based on search term
  const filteredProjects = dummyProjects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Projetos</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar projeto..."
                className="pl-8 w-[260px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-harmonia-green hover:bg-harmonia-green/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prazo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-5">
                      Nenhum projeto encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{project.id}</TableCell>
                      <TableCell>{project.title}</TableCell>
                      <TableCell>{project.client}</TableCell>
                      <TableCell>{project.dateCreated}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            project.status === "Em andamento"
                              ? "bg-blue-500"
                              : project.status === "Concluído"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                          }
                        >
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{project.deadline}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* New Project Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <form onSubmit={handleCreateProject}>
            <h2 className="text-xl font-bold mb-4">Novo Projeto</h2>
            
            <div className="space-y-4">
              <div className="mb-4">
                <Label htmlFor="clientSelect">Cliente Existente</Label>
                <Select onValueChange={handleSelectClient} value={selectedClientId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um cliente existente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectTitle">Título do Projeto *</Label>
                  <Input
                    id="projectTitle"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="Título do projeto"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="packageType">Pacote *</Label>
                  <Select onValueChange={setPackageType} value={packageType}>
                    <SelectTrigger id="packageType">
                      <SelectValue placeholder="Selecione o pacote" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Essencial">Essencial</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Profissional">Profissional</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nome do Cliente *</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nome do cliente"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">E-mail do Cliente *</Label>
                  <Input
                    id="clientEmail"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="Email do cliente"
                    type="email"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (WhatsApp) *</Label>
                <PhoneInput
                  id="phone"
                  value={phone}
                  onChange={setPhone}
                  label=""
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Formato internacional necessário para WhatsApp
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectDescription">Descrição</Label>
                <Textarea
                  id="projectDescription"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Descreva o projeto"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Criar Projeto
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsList;
