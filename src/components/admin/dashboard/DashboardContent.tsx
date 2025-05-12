
import React, { useEffect, useState } from 'react';
import StatsSummary from './StatsSummary';
import StatisticsCharts from './StatisticsCharts';
import RecentActivities from './RecentActivities';
import DashboardPreviewsCard from './DashboardPreviewsCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Music, FileText, PackageOpen, HelpCircle, ArrowRight, 
  FolderOpen, BarChart2, Database, Settings, Box, 
  Users, FileSpreadsheet, HardDrive, Briefcase
} from 'lucide-react';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { usePortfolioItems } from '@/hooks/usePortfolioItems';

// Type for dashboard metrics
interface DashboardMetrics {
  newOrders: number;
  musicInProduction: number;
  pendingContracts: number;
  portfolioTotal: number;
  portfolioViews: number;
  activeClients: number;
  previewProjects: number;
  audioSamples: number;
}

const DashboardContent: React.FC = () => {
  const { projects } = usePreviewProjects();
  const { portfolioItems } = usePortfolioItems();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    newOrders: 0,
    musicInProduction: 0,
    pendingContracts: 0,
    portfolioTotal: 0,
    portfolioViews: 0,
    activeClients: 0,
    previewProjects: 0,
    audioSamples: 0
  });

  // Update metrics when data changes
  useEffect(() => {
    // Calculate metrics based on actual data
    setMetrics({
      newOrders: 12, // This would come from an orders API in a real app
      musicInProduction: projects.filter(p => p.status === 'in_progress').length,
      pendingContracts: 3, // This would come from a contracts API in a real app
      portfolioTotal: portfolioItems.length,
      portfolioViews: portfolioItems.reduce((total, item) => total + (item.views || 0), 0),
      activeClients: [...new Set(projects.map(p => p.clientId || p.clientEmail))].length,
      previewProjects: projects.length,
      audioSamples: 248 // This would come from an audio database API in a real app
    });
  }, [projects, portfolioItems]);

  return (
    <div className="flex-1 space-y-6 p-6 pt-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild className="text-gray-300 border-gray-700 hover:bg-gray-800">
            <Link to="/admin-j28s7d1k/statistics">
              <BarChart2 className="h-4 w-4 mr-2" />
              Estatísticas Detalhadas
            </Link>
          </Button>
          <Button variant="outline" size="icon" className="text-gray-300 border-gray-700 hover:bg-gray-800">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-800/60 border-gray-700 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Novas Encomendas</CardTitle>
            <PackageOpen className="h-4 w-4 text-harmonia-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.newOrders}</div>
            <p className="text-xs text-gray-400">+2 desde ontem</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/60 border-gray-700 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Músicas em Produção</CardTitle>
            <Music className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.musicInProduction}</div>
            <p className="text-xs text-gray-400">3 em fase final</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/60 border-gray-700 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Contratos Pendentes</CardTitle>
            <FileText className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.pendingContracts}</div>
            <p className="text-xs text-gray-400">+1 desde ontem</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/60 border-gray-700 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Total Portfólio</CardTitle>
            <FolderOpen className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.portfolioTotal}</div>
            <p className="text-xs text-gray-400">+7 este mês</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-5 md:grid-cols-7">
        <div className="col-span-7 md:col-span-4">
          <StatisticsCharts />
        </div>
        <div className="col-span-7 md:col-span-3">
          <div className="grid gap-5">
            <DashboardPreviewsCard />
            <Card className="bg-gray-800/60 border-gray-700 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-md font-medium text-gray-200">Módulos Administrativos</CardTitle>
                <Settings className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start border-gray-700 text-gray-300 hover:bg-gray-700/50"
                    asChild
                  >
                    <Link to="/admin-j28s7d1k/portfolio">
                      <FileText className="mr-2 h-4 w-4 text-purple-400" />
                      Portfólio
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start border-gray-700 text-gray-300 hover:bg-gray-700/50"
                    asChild
                  >
                    <Link to="/admin-j28s7d1k/customers">
                      <Users className="mr-2 h-4 w-4 text-blue-400" />
                      Clientes
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start border-gray-700 text-gray-300 hover:bg-gray-700/50"
                    asChild
                  >
                    <Link to="/admin-j28s7d1k/audio-database">
                      <Database className="mr-2 h-4 w-4 text-green-400" />
                      Banco de Áudio
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start border-gray-700 text-gray-300 hover:bg-gray-700/50"
                    asChild
                  >
                    <Link to="/admin-j28s7d1k/orders">
                      <Box className="mr-2 h-4 w-4 text-amber-400" />
                      Pedidos
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start border-gray-700 text-gray-300 hover:bg-gray-700/50"
                    asChild
                  >
                    <Link to="/admin-j28s7d1k/invoices">
                      <FileSpreadsheet className="mr-2 h-4 w-4 text-red-400" />
                      Faturas
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start border-gray-700 text-gray-300 hover:bg-gray-700/50"
                    asChild
                  >
                    <Link to="/admin-j28s7d1k/storage">
                      <HardDrive className="mr-2 h-4 w-4 text-indigo-400" />
                      Armazenamento
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start border-gray-700 text-gray-300 hover:bg-gray-700/50"
                    asChild
                  >
                    <Link to="/admin-j28s7d1k/briefings">
                      <Briefcase className="mr-2 h-4 w-4 text-orange-400" />
                      Briefings
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start border-gray-700 text-gray-300 hover:bg-gray-700/50"
                    asChild
                  >
                    <Link to="/admin-j28s7d1k/settings">
                      <Settings className="mr-2 h-4 w-4 text-gray-400" />
                      Configurações
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="grid gap-5 md:grid-cols-7">
        <div className="col-span-7 md:col-span-4">
          <RecentActivities />
        </div>
        <div className="col-span-7 md:col-span-3">
          <StatsSummary />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
