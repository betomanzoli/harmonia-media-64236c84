import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from 'uuid'; // Make sure uuid is installed

interface NewProjectFormProps {
  onSubmit: (project: any) => void;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    packageType: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      clientEmail: '',
      packageType: '',
      description: ''
    });
  };

  // In the submit handler function, add an ID to the new project
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a unique ID for the project
    const projectId = `P${Math.floor(1000 + Math.random() * 9000)}`; // Or use uuidv4()
    
    const newProject = {
      id: projectId, // Add this line to include an ID
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      packageType: formData.packageType,
      createdAt: new Date().toISOString(),
      status: 'waiting' as const,
      versions: 0,
      previewUrl: `${window.location.origin}/preview/${projectId}`,
      expirationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivityDate: new Date().toLocaleDateString('pt-BR'),
      description: formData.description
    };
    
    onSubmit(newProject);
    resetForm();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Novo Projeto</CardTitle>
        <CardDescription>
          Adicione um novo projeto para gerenciamento de prévias.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="clientName">Nome do Cliente</Label>
          <Input 
            type="text" 
            id="clientName" 
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="clientEmail">Email do Cliente</Label>
          <Input 
            type="email" 
            id="clientEmail" 
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="packageType">Tipo de Pacote</Label>
          <Input 
            type="text" 
            id="packageType" 
            name="packageType"
            value={formData.packageType}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea 
            id="description" 
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="resize-none"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit}>Criar Projeto</Button>
      </CardFooter>
    </Card>
  );
};

export default NewProjectForm;
