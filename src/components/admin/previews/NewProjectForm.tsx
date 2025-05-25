import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { useNavigate } from 'react-router-dom';

const NewProjectForm: React.FC = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    packageType: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addProject } = usePreviewProjects();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      packageType: value
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!formData.clientName || !formData.clientEmail || !formData.packageType) {
    toast({
      title: "Campos obrigatórios",
      description: "Por favor, preencha todos os campos obrigatórios.",
      variant: "destructive"
    });
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    const newProject = {
      client_name: formData.clientName,
      client_email: formData.clientEmail,
      client_phone: formData.clientPhone,
      package_type: formData.packageType,
      created_at: new Date().toLocaleDateString('pt-BR'),
      status: 'waiting' as const,
      versions: 0,
      preview_url: `${window.location.origin}/preview/NEW_ID`,
      expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      last_activity_date: new Date().toLocaleDateString('pt-BR'),
      description: formData.description,
      versions_list: []
    };
    
    const { data, error } = await addProject(newProject);
    
    if (error) {
      console.error("Erro ao adicionar projeto:", error);
      toast({
        title: "Erro ao adicionar projeto",
        description: "Ocorreu um erro ao adicionar o projeto. Por favor, tente novamente.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Projeto adicionado",
        description: "O projeto foi adicionado com sucesso!",
        duration: 3000
      });
      
      // Redirecionar para a página de detalhes do projeto
      if (data && data[0] && data[0].id) {
        navigate(`/admin-j28s7d1k/previews/${data[0].id}`);
      } else {
        // Se o ID não estiver disponível, redirecionar para a lista de projetos
        navigate('/admin-j28s7d1k/previews');
      }
    }
  } catch (error) {
    console.error("Erro ao adicionar projeto:", error);
    toast({
      title: "Erro ao adicionar projeto",
      description: "Ocorreu um erro ao adicionar o projeto. Por favor, tente novamente.",
      variant: "destructive"
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Novo Projeto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="clientName">Nome do Cliente</Label>
            <Input 
              type="text" 
              id="clientName" 
              name="clientName" 
              value={formData.clientName} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div>
            <Label htmlFor="clientEmail">Email do Cliente</Label>
            <Input 
              type="email" 
              id="clientEmail" 
              name="clientEmail" 
              value={formData.clientEmail} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div>
            <Label htmlFor="clientPhone">Telefone do Cliente</Label>
            <Input 
              type="tel" 
              id="clientPhone" 
              name="clientPhone" 
              value={formData.clientPhone} 
              onChange={handleChange} 
            />
          </div>
          <div>
            <Label htmlFor="packageType">Tipo de Pacote</Label>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um pacote" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Essencial">Essencial</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Profissional">Profissional</SelectItem>
                <SelectItem value="Personalizado">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Descrição do Projeto</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detalhes adicionais sobre o projeto..."
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Criando...' : 'Criar Projeto'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewProjectForm;
