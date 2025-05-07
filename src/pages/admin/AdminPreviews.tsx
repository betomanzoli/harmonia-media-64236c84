import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Calendar } from 'lucide-react';
import { DatePicker } from "@/components/ui/date-picker"
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { generatePreviewLink } from '@/utils/previewLinkUtils';
import NewProjectForm from '@/components/admin/previews/NewProjectForm';

const AdminPreviews: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [newProject, setNewProject] = useState({
    id: uuidv4(),
    clientName: '',
    projectTitle: '',
    packageType: '',
    status: 'waiting',
    createdAt: new Date().toLocaleDateString('pt-BR'),
    lastActivityDate: new Date().toLocaleDateString('pt-BR'),
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    versions: 0,
    versionsList: [],
    feedbackHistory: [],
    history: [],
    preview_code: ''
  });
  const [isAddingProject, setIsAddingProject] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  useEffect(() => {
    // Load projects from localStorage on component mount
    const storedProjects = localStorage.getItem('harmonIA_preview_projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
  }, []);

  useEffect(() => {
    // Save projects to localStorage whenever the projects state changes
    localStorage.setItem('harmonIA_preview_projects', JSON.stringify(projects));
  }, [projects]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      setNewProject(prev => ({
        ...prev,
        expirationDate: date.toLocaleDateString('pt-BR')
      }));
    }
  };

  const handleAddProject = (project: any) => {
    const newProjectWithId = { ...project, id: uuidv4() };
    setProjects(prev => [...prev, newProjectWithId]);
    setNewProject({
      id: uuidv4(),
      clientName: '',
      projectTitle: '',
      packageType: '',
      status: 'waiting',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      lastActivityDate: new Date().toLocaleDateString('pt-BR'),
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      versions: 0,
      versionsList: [],
      feedbackHistory: [],
      history: [],
      preview_code: ''
    });
    setIsAddingProject(false);
    toast({
      title: "Projeto adicionado",
      description: `O projeto para ${project.clientName} foi adicionado com sucesso.`
    });
  };

  const handleEditProject = (id: string) => {
    navigate(`/admin-j28s7d1k/previews/${id}`);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    toast({
      title: "Projeto removido",
      description: "O projeto foi removido com sucesso."
    });
  };

  const handleGeneratePreviewLink = (projectId: string, clientName: string) => {
    const previewLink = generatePreviewLink(projectId, clientName);
    navigator.clipboard.writeText(`${window.location.origin}/preview/${previewLink}`);
    toast({
      title: "Link de prévia copiado",
      description: "O link de prévia foi copiado para a área de transferência."
    });
  };

  const formatDate = (dateString: string): string => {
    try {
      const dateParts = dateString.split('/');
      if (dateParts.length === 3) {
        const [day, month, year] = dateParts;
        const date = new Date(`${year}-${month}-${day}`);
        return format(date, 'PPP', { locale: ptBR });
      }
      return 'Data inválida';
    } catch (error) {
      console.error("Erro ao formatar a data:", error);
      return 'Data inválida';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Projetos de Prévia</h1>
          <Button onClick={() => setIsAddingProject(true)}>Adicionar Projeto</Button>
        </div>

        {isAddingProject ? (
          <Card className="mb-4">
            <CardContent className="p-4">
              <NewProjectForm />
            </CardContent>
          </Card>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <Card key={project.id} className="shadow-sm">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-2">{project.projectTitle}</h2>
                <p className="text-gray-500 mb-1">Cliente: {project.clientName}</p>
                <p className="text-gray-500 mb-1">Status: {project.status}</p>
                <p className="text-gray-500 mb-1">Criado em: {formatDate(project.createdAt)}</p>
                <p className="text-gray-500 mb-2">Expira em: {formatDate(project.expirationDate)}</p>
                <div className="flex justify-end gap-2">
                  <Button size="sm" onClick={() => handleGeneratePreviewLink(project.id, project.clientName)}>
                    Copiar Link
                  </Button>
                  <Button size="sm" onClick={() => handleEditProject(project.id)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteProject(project.id)}>
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPreviews;
