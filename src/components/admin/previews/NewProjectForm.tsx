
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const NewProjectForm: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Novo Projeto de Prévia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client-name">Nome do Cliente</Label>
              <Input id="client-name" placeholder="Nome completo" />
            </div>
            <div>
              <Label htmlFor="client-email">Email do Cliente</Label>
              <Input id="client-email" type="email" placeholder="email@exemplo.com" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project-title">Título do Projeto</Label>
              <Input id="project-title" placeholder="Ex: Música Comercial - Empresa ABC" />
            </div>
            <div>
              <Label htmlFor="package-type">Tipo de Pacote</Label>
              <Select>
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
          </div>

          <div>
            <Label htmlFor="project-description">Descrição do Projeto</Label>
            <textarea 
              id="project-description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-harmonia-green"
              rows={3}
              placeholder="Descreva os detalhes do projeto..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline">Cancelar</Button>
            <Button className="bg-harmonia-green hover:bg-harmonia-green/90">
              Criar Projeto
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewProjectForm;
