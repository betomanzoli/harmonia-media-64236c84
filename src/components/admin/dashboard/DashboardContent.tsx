
import React from 'react';
import StatsSummary from './StatsSummary';
import StatisticsCharts from './StatisticsCharts';
import RecentActivities from './RecentActivities';
import DashboardPreviewsCard from './DashboardPreviewsCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Music, FileText, PackageOpen, HelpCircle, ArrowRight, FolderOpen } from 'lucide-react';

const DashboardContent: React.FC = () => {
  return (
    <div className="flex-1 space-y-6 p-6 pt-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
        <div className="flex items-center space-x-2">
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
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-gray-400">+2 desde ontem</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/60 border-gray-700 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Músicas em Produção</CardTitle>
            <Music className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8</div>
            <p className="text-xs text-gray-400">3 em fase final</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/60 border-gray-700 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Contratos Pendentes</CardTitle>
            <FileText className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <p className="text-xs text-gray-400">+1 desde ontem</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/60 border-gray-700 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Total Portfólio</CardTitle>
            <FolderOpen className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">42</div>
            <p className="text-xs text-gray-400">+7 este mês</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <StatisticsCharts />
        </div>
        <div className="col-span-3">
          <StatsSummary />
        </div>
      </div>
      
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RecentActivities />
        </div>
        <div className="col-span-3 grid gap-5">
          <DashboardPreviewsCard />
          <Card className="bg-gray-800/60 border-gray-700 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium text-gray-200">Banco de Áudio</CardTitle>
              <Music className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-white">248</span>
                    <span className="text-xs text-gray-400">Amostras de áudio</span>
                  </div>
                  <div className="flex items-center justify-end">
                    <div className="text-sm text-gray-400">
                      15 categorias
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-gray-700 text-gray-200 hover:bg-gray-700/50"
                  asChild
                >
                  <Link to="/admin-j28s7d1k/audio-database">
                    Gerenciar Banco de Áudio
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
