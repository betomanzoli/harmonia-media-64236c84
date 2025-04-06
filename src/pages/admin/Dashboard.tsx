
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Database, Music, Users, FileAudio, BarChart, Settings, LogOut, Home } from 'lucide-react';
import { siteConfig } from '@/config/site';

const AdminDashboard: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="flex items-center justify-center py-4">
            <h2 className="text-xl font-bold text-harmonia-green">harmonIA Admin</h2>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Principal</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/admin-j28s7d1k/dashboard">
                      <Home className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to={siteConfig.urls.admin.audioDatabase}>
                      <FileAudio className="w-4 h-4" />
                      <span>Banco de Áudios</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to={siteConfig.urls.admin.portfolio}>
                      <Music className="w-4 h-4" />
                      <span>Portfólio</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Gestão</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Em desenvolvimento">
                    <Link to="#">
                      <Users className="w-4 h-4" />
                      <span>Clientes</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Em desenvolvimento">
                    <Link to="#">
                      <Database className="w-4 h-4" />
                      <span>Pedidos</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Em desenvolvimento">
                    <Link to="#">
                      <BarChart className="w-4 h-4" />
                      <span>Estatísticas</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Em desenvolvimento">
                  <Link to="#">
                    <Settings className="w-4 h-4" />
                    <span>Configurações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <LogOut className="w-4 h-4" />
                    <span>Voltar ao Site</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-grow p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Dashboard Administrativo</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">Áudios</CardTitle>
                  <CardDescription>Total de áudios no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">23</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" asChild>
                    <Link to={siteConfig.urls.admin.audioDatabase}>Gerenciar áudios</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">Portfólio</CardTitle>
                  <CardDescription>Itens no portfólio</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">15</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" asChild>
                    <Link to={siteConfig.urls.admin.portfolio}>Gerenciar portfólio</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">Pedidos</CardTitle>
                  <CardDescription>Pedidos ativos</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">8</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" asChild>
                    <Link to="#">Ver pedidos</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <Tabs defaultValue="atividades">
              <TabsList className="mb-4">
                <TabsTrigger value="atividades">Atividades Recentes</TabsTrigger>
                <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="atividades">
                <Card>
                  <CardHeader>
                    <CardTitle>Atividades Recentes</CardTitle>
                    <CardDescription>Últimas ações no sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <p className="text-sm text-gray-500">Hoje, 14:30</p>
                        <p className="ml-4">Novo áudio adicionado: "Aniversário de 15 Anos - Julia"</p>
                      </div>
                      <Separator />
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <p className="text-sm text-gray-500">Hoje, 11:15</p>
                        <p className="ml-4">Pedido atualizado: #2023-056 "Música Corporativa - Tech Inovação"</p>
                      </div>
                      <Separator />
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <p className="text-sm text-gray-500">Ontem, 16:45</p>
                        <p className="ml-4">Novo item adicionado ao portfólio: "Casamento - Pedro e Maria"</p>
                      </div>
                      <Separator />
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <p className="text-sm text-gray-500">Ontem, 10:20</p>
                        <p className="ml-4">Novo cliente registrado: João Silva</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="estatisticas">
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas</CardTitle>
                    <CardDescription>Dados de desempenho do sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-12 text-gray-400">Gráficos de estatísticas serão implementados em breve</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
