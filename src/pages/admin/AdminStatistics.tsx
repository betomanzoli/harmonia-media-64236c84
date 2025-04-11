
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart2, PieChart, LineChart, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const AdminStatistics: React.FC = () => {
  // Mock data for charts
  const monthlyOrdersData = [
    { name: 'Jan', pedidos: 4 },
    { name: 'Fev', pedidos: 7 },
    { name: 'Mar', pedidos: 5 },
    { name: 'Abr', pedidos: 9 },
    { name: 'Mai', pedidos: 6 },
    { name: 'Jun', pedidos: 10 },
    { name: 'Jul', pedidos: 8 },
    { name: 'Ago', pedidos: 12 },
    { name: 'Set', pedidos: 14 },
    { name: 'Out', pedidos: 11 },
    { name: 'Nov', pedidos: 9 },
    { name: 'Dez', pedidos: 15 },
  ];

  const portfolioViewsData = [
    { id: '1', title: 'Tema Comercial', views: 156 },
    { id: '2', title: 'Soundtrack Documentário', views: 98 },
    { id: '3', title: 'Jingle Lançamento', views: 213 },
    { id: '4', title: 'Música para Podcast', views: 87 },
  ];

  const genreDistributionData = [
    { name: 'Pop/Eletrônico', value: 35 },
    { name: 'Orquestral', value: 25 },
    { name: 'Ambiental', value: 20 },
    { name: 'Corporativo', value: 15 },
    { name: 'Outros', value: 5 },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">Estatísticas</h1>
            <p className="text-muted-foreground">
              Visualize relatórios e métricas de desempenho
            </p>
          </div>
          <div className="flex gap-2">
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
            <Button 
              variant="outline" 
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar Dados
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
            <TabsTrigger value="financials">Financeiro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5" />
                  Pedidos por Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyOrdersData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="pedidos" fill="#8884d8" name="Quantidade de Pedidos" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2 h-5 w-5" />
                    Distribuição por Gênero
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={genreDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {genreDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="mr-2 h-5 w-5" />
                    Visualizações do Portfólio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={portfolioViewsData}
                        layout="vertical"
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="title" type="category" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="views" fill="#82ca9d" name="Visualizações" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas detalhadas do Portfólio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-12">
                  Estatísticas detalhadas do portfólio em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="financials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Financeiros</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-12">
                  Relatórios financeiros em desenvolvimento...
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
