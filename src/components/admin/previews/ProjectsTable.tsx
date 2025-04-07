
import React, { useState } from 'react';
import { 
  Eye, RefreshCw, Copy, ExternalLink, Calendar, AlertTriangle, 
  CheckCircle2, MessageCircle, Clock, MoreHorizontal 
} from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

interface ProjectItem {
  id: string;
  clientName: string;
  clientEmail: string;
  packageType: string;
  createdAt: string;
  status: string;
  versions: number;
  previewUrl: string;
  expirationDate: string;
}

interface ProjectsTableProps {
  projects: ProjectItem[];
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects }) => {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'waiting':
        return { 
          label: 'Aguardando Avaliação', 
          color: 'bg-yellow-500 text-white',
          icon: <Clock className="w-4 h-4 mr-1" />
        };
      case 'feedback':
        return { 
          label: 'Feedback Recebido', 
          color: 'bg-blue-500 text-white',
          icon: <MessageCircle className="w-4 h-4 mr-1" />
        };
      case 'approved':
        return { 
          label: 'Música Aprovada', 
          color: 'bg-green-500 text-white',
          icon: <CheckCircle2 className="w-4 h-4 mr-1" />
        };
      default:
        return { 
          label: status, 
          color: 'bg-gray-500 text-white',
          icon: null
        };
    }
  };
  
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    toast({
      title: "Link copiado",
      description: "O link da prévia foi copiado para a área de transferência."
    });
  };
  
  const handleSendReminder = (project: ProjectItem) => {
    toast({
      title: "Email enviado",
      description: `Um lembrete foi enviado para ${project.clientEmail}`
    });
  };
  
  const isExpiring = (dateStr: string) => {
    const today = new Date();
    const parts = dateStr.split('/');
    const expDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays > 0;
  };
  
  const isExpired = (dateStr: string) => {
    const today = new Date();
    const parts = dateStr.split('/');
    const expDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    return today > expDate;
  };
  
  const showFeedback = (project: ProjectItem) => {
    setSelectedProject(project);
    setShowFeedbackDialog(true);
  };

  return (
    <>
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
            const expiring = isExpiring(project.expirationDate);
            const expired = isExpired(project.expirationDate);
            
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
                <TableCell>
                  <div className="flex items-center gap-1">
                    {expiring && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                    {expired && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    <span className={expired ? "text-red-500" : (expiring ? "text-amber-500" : "")}>
                      {project.expirationDate}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${status.color} flex items-center w-fit`}>
                    {status.icon}
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell>{project.versions}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="outline" 
                            onClick={() => window.open(project.previewUrl, '_blank')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Visualizar prévia</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleCopyLink(project.previewUrl)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(project.previewUrl, '_blank')}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Abrir prévia
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendReminder(project)}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Enviar lembrete
                        </DropdownMenuItem>
                        {project.status === 'feedback' && (
                          <DropdownMenuItem onClick={() => showFeedback(project)}>
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Ver feedback
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled>
                          <Calendar className="w-4 h-4 mr-2" />
                          Estender prazo
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Feedback do Cliente</DialogTitle>
            <DialogDescription>
              {selectedProject && `${selectedProject.clientName} (${selectedProject.clientEmail})`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="border rounded-lg p-4 bg-blue-50">
            <h3 className="font-medium mb-2">Versão selecionada: Versão Acústica</h3>
            <p className="text-gray-700">
              "Eu gostei muito da melodia e da progressão de acordes. No entanto, gostaria que o violão 
              estivesse um pouco mais alto no mix e que talvez pudéssemos adicionar uma leve reverberação 
              na voz principal. Também seria bom se o andamento fosse um pouco mais rápido."
            </p>
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Próximos passos recomendados:</h3>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li>Fazer os ajustes solicitados na versão selecionada</li>
              <li>Criar uma nova versão com as modificações</li>
              <li>Enviar a nova versão para o cliente através de um novo projeto</li>
            </ol>
          </div>
          
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectsTable;
