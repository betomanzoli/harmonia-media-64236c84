
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart, LineChart, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminStatistics: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">Estatísticas</h1>
            <p className="text-muted-foreground">
              Visualize dados e métricas do seu negócio
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
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Vendas</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center">
              <BarChart className="h-32 w-32 text-harmonia-green opacity-50" />
              <p className="text-center mt-4 text-gray-400">Dados de vendas serão exibidos aqui</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Projetos</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center">
              <LineChart className="h-32 w-32 text-harmonia-green opacity-50" />
              <p className="text-center mt-4 text-gray-400">Estatísticas de projetos serão exibidas aqui</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Clientes</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center">
              <PieChart className="h-32 w-32 text-harmonia-green opacity-50" />
              <p className="text-center mt-4 text-gray-400">Dados de clientes serão exibidos aqui</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-8 text-yellow-800">
          <p className="font-medium">Módulo em desenvolvimento</p>
          <p className="text-sm">O módulo de estatísticas está em desenvolvimento e estará disponível em breve.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStatistics;
