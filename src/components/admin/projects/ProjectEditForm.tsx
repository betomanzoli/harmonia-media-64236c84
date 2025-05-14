
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface Project {
  id: string;
  title: string;
  clientName: string;
  status: string;
  deadline: string;
  createdAt: string;
  packageType?: string;
}

interface ProjectEditFormProps {
  project: Project;
  onSubmit: (updatedProject: Project) => void;
  onCancel: () => void;
}

const ProjectEditForm: React.FC<ProjectEditFormProps> = ({ project, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Project>({ ...project });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handlePackageChange = (value: string) => {
    setFormData(prev => ({ ...prev, packageType: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Nome do Projeto</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="clientName">Nome do Cliente</Label>
          <Input
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="packageType">Pacote</Label>
          <Select 
            value={formData.packageType || ''} 
            onValueChange={handlePackageChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um pacote" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Essencial">Essencial</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Profissional">Profissional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="em_andamento">Em andamento</SelectItem>
              <SelectItem value="aguardando_aprovacao">Aguardando aprovação</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="deadline">Prazo</Label>
          <Input
            id="deadline"
            name="deadline"
            type="date"
            value={formData.deadline.split('T')[0] || ''}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar Alterações</Button>
      </div>
    </form>
  );
};

export default ProjectEditForm;
