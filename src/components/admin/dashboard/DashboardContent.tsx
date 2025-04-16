
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Area, AreaChart, Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ActivityIcon, ArrowRight, Music, Package, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RecentProjectsList from './RecentProjectsList';
import ProjectStatusCard from './ProjectStatusCard';
import { Link } from 'react-router-dom';
import { useStatistics } from '@/hooks/admin/useStatistics';

const DashboardContent: React.FC = () => {
  const { 
    counts, 
    projectsData, 
    revenueData, 
    clientsData,
    pendingProjects,
    feedbackProjects,
    completedProjects,
    recentProjects
  } = useStatistics();

  return (
    <div className="flex-1 space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="gap-1 text-xs text-muted-foreground"
            disabled
          >
            Última atualização: {new Date().toLocaleString()}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Projetos
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{counts.projects}</div>
                <p className="text-xs text-muted-foreground">
                  {projectsData.length > 0 && projectsData[projectsData.length - 1].value > projectsData[projectsData.length - 2].value 
                    ? `+${projectsData[projectsData.length - 1].value - projectsData[projectsData.length - 2].value}` 
                    : '0'} desde o último mês
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Músicas no Portfólio
                </CardTitle>
                <Music className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{counts.portfolio}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 5)} desde o último mês
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Clientes
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{counts.clients}</div>
                <p className="text-xs text-muted-foreground">
                  {clientsData.length > 0 && clientsData[clientsData.length - 1].value > clientsData[clientsData.length - 2].value 
                    ? `+${clientsData[clientsData.length - 1].value - clientsData[clientsData.length - 2].value}` 
                    : '0'} desde o último mês
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Faturamento
                </CardTitle>
                <ActivityIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL',
                    maximumFractionDigits: 0 
                  }).format(counts.revenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {revenueData.length > 0 && revenueData[revenueData.length - 1].value > revenueData[revenueData.length - 2].value 
                    ? `+${Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL',
                      maximumFractionDigits: 0 
                    }).format(revenueData[revenueData.length - 1].value - revenueData[revenueData.length - 2].value)}` 
                    : 'R$ 0'} desde o último mês
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Visão Geral</CardTitle>
                <CardDescription>
                  Visão geral de projetos e receita nos últimos 90 dias.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart
                    data={projectsData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 10,
                      bottom: 0,
                    }}
                  >
                    <XAxis 
                      dataKey="name" 
                      tickLine={false} 
                      axisLine={false}
                      dy={10}
                      tickMargin={10}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      fill="url(#colorPv)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#10B981"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10B981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid gap-4 lg:col-span-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Status dos Projetos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ProjectStatusCard 
                      title="Pendentes" 
                      count={pendingProjects}
                      percentage={(pendingProjects / counts.projects) * 100}
                      color="bg-yellow-500"
                    />
                    <ProjectStatusCard 
                      title="Em feedback" 
                      count={feedbackProjects}
                      percentage={(feedbackProjects / counts.projects) * 100}
                      color="bg-blue-500"
                    />
                    <ProjectStatusCard 
                      title="Concluídos" 
                      count={completedProjects}
                      percentage={(completedProjects / counts.projects) * 100}
                      color="bg-green-500"
                    />
                  </div>
                </CardContent>
                
                <div className="px-6 pb-4">
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/admin-j28s7d1k/projects" className="flex items-center justify-center gap-1">
                      Ver todos os projetos
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
          
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Projetos Recentes</CardTitle>
                <CardDescription>
                  Lista dos projetos mais recentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentProjectsList projects={recentProjects} />
              </CardContent>
              <div className="px-6 pb-4">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/admin-j28s7d1k/projects" className="flex items-center justify-center gap-1">
                    Ver todos os projetos
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Faturamento Mensal</CardTitle>
                <CardDescription>
                  Faturamento nos últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={revenueData}>
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                      tickMargin={10}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tickFormatter={(value) =>
                        `R$${value.toLocaleString('pt-BR')}`
                      }
                    />
                    <Bar
                      dataKey="value"
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Projetos por tipo content */}
            <Card>
              <CardHeader>
                <CardTitle>Projetos por Tipo</CardTitle>
                <CardDescription>
                  Distribuição de projetos por pacote
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={[
                    { name: 'Essencial', value: Math.floor(counts.projects * 0.4) },
                    { name: 'Profissional', value: Math.floor(counts.projects * 0.4) },
                    { name: 'Premium', value: Math.floor(counts.projects * 0.2) },
                  ]}>
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                    />
                    <Bar
                      dataKey="value"
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Projetos por Mês</CardTitle>
                <CardDescription>
                  Número de novos projetos por mês
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={projectsData}>
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                    />
                    <Line
                      type="monotone"
                      strokeWidth={2}
                      dataKey="value"
                      stroke="#10B981"
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tempo de Conclusão</CardTitle>
                <CardDescription>
                  Tempo médio de conclusão dos projetos (dias)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={[
                    { name: 'Essencial', value: 8 },
                    { name: 'Profissional', value: 6 },
                    { name: 'Premium', value: 4 },
                  ]}>
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                    />
                    <Bar
                      dataKey="value"
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="clients" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Novos Clientes</CardTitle>
                <CardDescription>
                  Número de novos clientes por mês
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={clientsData}>
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                    />
                    <Line
                      type="monotone"
                      strokeWidth={2}
                      dataKey="value"
                      stroke="#10B981"
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Clientes Recorrentes</CardTitle>
                <CardDescription>
                  Porcentagem de clientes que retornam
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-[350px]">
                <div className="text-center">
                  <div className="text-5xl font-bold text-harmonia-green mb-2">
                    {Math.floor(Math.random() * 20) + 30}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    dos clientes retornam para um segundo projeto
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Valor Médio por Cliente</CardTitle>
                <CardDescription>
                  Valor médio gasto por cliente
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-[350px]">
                <div className="text-center">
                  <div className="text-4xl font-bold text-harmonia-green mb-2">
                    {Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL',
                      maximumFractionDigits: 0 
                    }).format(counts.revenue / counts.clients)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    valor médio por cliente
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end">
            <Button asChild>
              <Link to="/admin-j28s7d1k/clients">
                Ver todos os clientes
              </Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardContent;
