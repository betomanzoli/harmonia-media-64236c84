
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RecentProjectsList from './RecentProjectsList';
import ProjectStatusCard from './ProjectStatusCard';
import { ArrowRight, Music, Users, FileText, CreditCard, Calendar, BarChart3, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DashboardContent: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    totalCompletedProjects: 0,
    totalPendingProjects: 0,
    totalInProgressProjects: 0,
    totalPortfolioItems: 0,
    totalInvoices: 0,
    recentProjects: []
  });

  useEffect(() => {
    // In a real application, this would fetch data from your API
    // For now, we'll simulate loading and set some sample data
    const loadDashboardData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDashboardStats({
        totalClients: 0,
        totalProjects: 0,
        totalCompletedProjects: 0,
        totalPendingProjects: 0, 
        totalInProgressProjects: 0,
        totalPortfolioItems: 0,
        totalInvoices: 0,
        recentProjects: []
      });
      
      setIsLoading(false);
    };
    
    loadDashboardData();
  }, []);

  const handleModuleClick = (path: string, isImplemented = true) => {
    if (isImplemented) {
      navigate(path);
    } else {
      toast({
        title: "Módulo em desenvolvimento",
        description: "Este módulo está sendo implementado e estará disponível em breve."
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao painel administrativo da harmonIA. Gerencie seus projetos, clientes e pagamentos.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleModuleClick('/admin-j28s7d1k/settings', true)}>
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Clientes registrados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projetos Ativos
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.totalCompletedProjects} concluídos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Portfólio
            </CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalPortfolioItems}</div>
            <p className="text-xs text-muted-foreground">
              Músicas no portfólio
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturas
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              Faturas emitidas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentProjectsList 
          projects={dashboardStats.recentProjects as any[]} 
        />
        
        <ProjectStatusCard 
          statusData={{
            total: dashboardStats.totalProjects,
            pending: dashboardStats.totalPendingProjects,
            inProgress: dashboardStats.totalInProgressProjects,
            completed: dashboardStats.totalCompletedProjects,
            feedback: 0
          }} 
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Módulos Administrativos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:border-harmonia-green transition-colors" 
            onClick={() => handleModuleClick('/admin-j28s7d1k/previews', true)}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Music className="mr-2 h-5 w-5 text-harmonia-green" />
                Prévias Musicais
              </CardTitle>
              <CardDescription>
                Gerenciar prévias de músicas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Envie, edite e acompanhe as prévias enviadas aos clientes.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-between">
                Acessar <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="cursor-pointer hover:border-harmonia-green transition-colors"
            onClick={() => handleModuleClick('/admin-j28s7d1k/briefings', true)}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="mr-2 h-5 w-5 text-harmonia-green" />
                Briefings
              </CardTitle>
              <CardDescription>
                Gerenciar briefings de clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Visualize e responda aos briefings enviados pelos clientes.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-between">
                Acessar <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="cursor-pointer hover:border-harmonia-green transition-colors"
            onClick={() => handleModuleClick('/admin-j28s7d1k/portfolio', true)}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BarChart3 className="mr-2 h-5 w-5 text-harmonia-green" />
                Portfólio
              </CardTitle>
              <CardDescription>
                Gerenciar o portfólio público
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Adicione e edite as músicas exibidas no portfólio do site.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-between">
                Acessar <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="cursor-pointer hover:border-harmonia-green transition-colors"
            onClick={() => handleModuleClick('/admin-j28s7d1k/invoices', true)}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <CreditCard className="mr-2 h-5 w-5 text-harmonia-green" />
                Faturas
              </CardTitle>
              <CardDescription>
                Gerenciar faturas e pagamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Visualize e gerencie as faturas emitidas para os clientes.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-between">
                Acessar <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="cursor-pointer hover:border-harmonia-green transition-colors"
            onClick={() => handleModuleClick('/admin-j28s7d1k/clients', true)}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="mr-2 h-5 w-5 text-harmonia-green" />
                Clientes
              </CardTitle>
              <CardDescription>
                Gerenciar cadastro de clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Visualize e edite as informações dos clientes cadastrados.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-between">
                Acessar <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="cursor-pointer hover:border-harmonia-green transition-colors"
            onClick={() => handleModuleClick('/admin-j28s7d1k/projects', true)}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Calendar className="mr-2 h-5 w-5 text-harmonia-green" />
                Projetos
              </CardTitle>
              <CardDescription>
                Gerenciar projetos e prazos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Acompanhe o andamento e os prazos dos projetos em produção.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-between">
                Acessar <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
