
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Folder, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectPhases from '@/components/admin/projects/ProjectPhases';
import { useToast } from '@/hooks/use-toast';

const AdminProjects: React.FC = () => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<'all' | 'inProgress' | 'completed'>('all');

  const handleViewProjects = (view: 'all' | 'inProgress' | 'completed') => {
    setActiveView(view);
    
    const viewLabels = {
      all: 'todos os projetos',
      inProgress: 'projetos em andamento',
      completed: 'projetos concluídos'
    };
    
    toast({
      title: `Visualizando ${viewLabels[view]}`,
      description: "Esta funcionalidade será expandida em breve."
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">Projetos</h1>
            <p className="text-muted-foreground">
              Gerencie os projetos musicais em andamento
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="border-harmonia-green text-harmonia-green hover:bg-harmonia-green/10"
          >
            <Link to="/admin-j28s7d1k/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className={activeView === 'all' ? 'border-harmonia-green' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Folder className="mr-2 h-5 w-5 text-harmonia-green" />
                Todos os Projetos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualize e gerencie todos os projetos musicais em andamento.
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleViewProjects('all')}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Ver Projetos
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className={activeView === 'inProgress' ? 'border-harmonia-green' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Folder className="mr-2 h-5 w-5 text-amber-500" />
                Projetos em Andamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Projetos que estão atualmente em desenvolvimento ativo.
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleViewProjects('inProgress')}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Ver Andamento
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className={activeView === 'completed' ? 'border-harmonia-green' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Folder className="mr-2 h-5 w-5 text-green-500" />
                Projetos Concluídos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Projetos que foram finalizados e entregues aos clientes.
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleViewProjects('completed')}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Ver Concluídos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {activeView === 'all' && (
          <ProjectPhases 
            projectId="PROJ-2023-01" 
            projectType="Música Personalizada - Pacote Premium" 
            currentPhase="producao" 
          />
        )}
        
        {activeView === 'inProgress' && (
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-medium mb-4">Projetos em Andamento</h3>
            <p className="text-muted-foreground">Visualização de projetos em andamento será implementada em breve.</p>
          </div>
        )}
        
        {activeView === 'completed' && (
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-medium mb-4">Projetos Concluídos</h3>
            <p className="text-muted-foreground">Visualização de projetos concluídos será implementada em breve.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
