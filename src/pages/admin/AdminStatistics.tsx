
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { ArrowUpRight, ArrowDownRight, Users, Music, Clock, MessageSquare } from 'lucide-react';

const AdminStatistics: React.FC = () => {
  const { projects } = usePreviewProjects();
  
  // Calculate statistics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status !== 'approved').length;
  const approvedProjects = projects.filter(p => p.status === 'approved').length;
  const totalVersions = projects.reduce((sum, p) => sum + (p.versions || 0), 0);
  const uniqueClients = [...new Set(projects.map(p => p.clientEmail))].length;
  
  // Calculate average response time (mocked data)
  const avgResponseTime = "27 horas";
  
  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Estatísticas</h1>
          <p className="text-muted-foreground">
            Análise e métricas da plataforma de prévias
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Projetos
              </CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                Projetos gerenciados na plataforma
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Versões Enviadas
              </CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVersions}</div>
              <p className="text-xs text-muted-foreground">
                Total de prévias enviadas aos clientes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Aprovação
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalProjects > 0 ? Math.round((approvedProjects / totalProjects) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {approvedProjects} projetos aprovados
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tempo de Resposta
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgResponseTime}</div>
              <p className="text-xs text-muted-foreground">
                Média de tempo para feedback
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resumo de Atividades</CardTitle>
                <CardDescription>
                  Visão geral das atividades na plataforma no último mês.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Projetos Ativos
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{activeProjects}</div>
                        <p className="text-xs text-muted-foreground">
                          Projetos em andamento
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Clientes Únicos
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{uniqueClients}</div>
                        <p className="text-xs text-muted-foreground">
                          Clientes atendidos
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Informações da Demonstração</h3>
                  <p className="text-sm text-muted-foreground">
                    Esta é uma versão de demonstração do painel de estatísticas. Em uma versão real, 
                    você teria acesso a gráficos detalhados de atividade, métricas de engajamento e
                    relatórios personalizados.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dados de Clientes</CardTitle>
                <CardDescription>
                  Informações sobre os clientes que utilizam a plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Dados detalhados de clientes serão exibidos aqui na versão completa.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Status dos Projetos</CardTitle>
                <CardDescription>
                  Visão detalhada do andamento dos projetos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Estatísticas detalhadas de projetos serão exibidas aqui na versão completa.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminStatistics;
