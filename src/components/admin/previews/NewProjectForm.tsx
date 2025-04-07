
import React from 'react';
import { Plus, Check, RefreshCw, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProjectVersionItem from './ProjectVersionItem';
import { useNewProjectForm } from '@/hooks/admin/useNewProjectForm';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
        <CardTitle className="flex items-center gap-2">
          Criar Novo Projeto de Prévias
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-sm">
                <p>Crie um novo projeto para enviar versões musicais para avaliação do cliente.
                O cliente receberá um email com um link para a página de avaliação.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
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
                placeholder="Ex: João Silva"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email do Cliente</label>
              <Input
                type="email"
                value={newProject.clientEmail}
                onChange={e => newProject.setClientEmail(e.target.value)}
                required
                placeholder="Ex: cliente@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Pacote</label>
              <Select
                value={newProject.packageType}
                onValueChange={value => newProject.setPackageType(value)}
                required
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
                required
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
                disabled={newProject.versions.length >= 5}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Versão
              </Button>
            </div>
            
            {newProject.versions.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                <p>Adicione pelo menos uma versão musical para este projeto.</p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddVersion}
                  className="mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeira Versão
                </Button>
              </div>
            ) : (
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
            )}
            
            {newProject.versions.length >= 5 && (
              <p className="text-sm text-amber-600 mt-4">
                Limite máximo de 5 versões atingido. Recomendamos limitar o número de opções para facilitar a decisão do cliente.
              </p>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-harmonia-green hover:bg-harmonia-green/90"
              disabled={isCreating || isUploading || newProject.versions.length === 0}
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
      <CardFooter className="flex-col items-start text-sm text-gray-500 border-t pt-4">
        <h4 className="font-medium text-gray-600 mb-2">Informações importantes:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>O cliente receberá um email automático com um link único para acessar as prévias</li>
          <li>As prévias ficam disponíveis pelo período selecionado, após esse prazo o link expira</li>
          <li>Você será notificado quando o cliente enviar feedback ou aprovar uma versão</li>
          <li>Arquivos de áudio devem ser em formato MP3 e não devem ultrapassar 20MB cada</li>
        </ul>
      </CardFooter>
    </Card>
  );
};

export default NewProjectForm;
