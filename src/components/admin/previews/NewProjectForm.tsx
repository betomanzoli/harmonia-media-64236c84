
import React from 'react';
import { Plus, Check, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProjectVersionItem from './ProjectVersionItem';
import { useNewProjectForm } from '@/hooks/admin/useNewProjectForm';

const NewProjectForm: React.FC = () => {
  const {
    newProject,
    handleCreateProject,
    handleAddVersion,
    handleRemoveVersion,
    handleVersionChange,
    handleFileChange,
    isCreating,
    isUploading,
  } = useNewProjectForm();

  return (
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
                onChange={e => newProject.setClientName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email do Cliente</label>
              <Input
                type="email"
                value={newProject.clientEmail}
                onChange={e => newProject.setClientEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Pacote</label>
              <Select
                value={newProject.packageType}
                onValueChange={value => newProject.setPackageType(value)}
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
                onValueChange={value => newProject.setExpirationDays(value)}
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
                <ProjectVersionItem
                  key={index}
                  version={version}
                  index={index}
                  onRemove={handleRemoveVersion}
                  onTitleChange={(index, value) => handleVersionChange(index, 'title', value)}
                  onDescriptionChange={(index, value) => handleVersionChange(index, 'description', value)}
                  onFileChange={handleFileChange}
                />
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
  );
};

export default NewProjectForm;
