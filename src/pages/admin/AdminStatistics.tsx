
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart, LineChart, PieChart, Calendar, DollarSign, Users, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminStatistics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'month' | 'year'>('month');
  
  // Dados simulados para os gráficos
  const salesData = [
    { name: 'Jan', valor: 4200 },
    { name: 'Fev', valor: 3800 },
    { name: 'Mar', valor: 5200 },
    { name: 'Abr', valor: 6800 },
    { name: 'Mai', valor: 5600 },
    { name: 'Jun', valor: 7800 },
    { name: 'Jul', valor: 8400 },
  ];
  
  const projectData = [
    { name: 'Jan', concluídos: 12, emAndamento: 8 },
    { name: 'Fev', concluídos: 9, emAndamento: 10 },
    { name: 'Mar', concluídos: 15, emAndamento: 7 },
    { name: 'Abr', concluídos: 18, emAndamento: 12 },
    { name: 'Mai', concluídos: 14, emAndamento: 9 },
    { name: 'Jun', concluídos: 21, emAndamento: 11 },
    { name: 'Jul', concluídos: 16, emAndamento: 14 },
  ];
  
  const clientData = [
    { name: 'Essencial', value: 45 },
    { name: 'Profissional', value: 35 },
    { name: 'Premium', value: 20 },
  ];
  
  const summaryData = [
    { title: 'Vendas Totais', value: 'R$ 142.580', icon: DollarSign, color: 'bg-green-500' },
    { title: 'Projetos Ativos', value: '24', icon: Music, color: 'bg-blue-500' },
    { title: 'Clientes Novos', value: '18', icon: Users, color: 'bg-purple-500' },
    { title: 'Taxa de Conversão', value: '68%', icon: BarChart, color: 'bg-amber-500' },
  ];
  
  const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042'];
  
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
          <div className="flex items-center gap-2">
            <Tabs 
              value={timeRange} 
              onValueChange={(v: string) => setTimeRange(v as 'month' | 'year')}
              className="mr-4"
            >
              <TabsList className="grid w-40 grid-cols-2">
                <TabsTrigger value="month">Mensal</TabsTrigger>
                <TabsTrigger value="year">Anual</TabsTrigger>
              </TabsList>
            </Tabs>
            
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {summaryData.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${item.color}`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{item.title}</p>
                    <h3 className="text-2xl font-bold">{item.value}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-harmonia-green" />
                Vendas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={salesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value}`, 'Valor']} />
                  <Legend />
                  <Bar dataKey="valor" name="Valor (R$)" fill="#22c55e" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Music className="h-5 w-5 mr-2 text-harmonia-green" />
                Projetos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={projectData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="concluídos"
                    name="Concluídos"
                    stroke="#22c55e"
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="emAndamento" 
                    name="Em Andamento" 
                    stroke="#3b82f6" 
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2 text-harmonia-green" />
                Clientes por Pacote
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={clientData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {clientData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} clientes`, '']} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-harmonia-green" />
                Estatísticas Temporais
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-80">
              <div className="h-full flex flex-col justify-center items-center">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="bg-gray-100 p-6 rounded-full">
                    <Calendar className="h-12 w-12 text-harmonia-green" />
                  </div>
                  <h3 className="text-xl font-bold">Análise Detalhada</h3>
                  <p className="text-gray-500 max-w-xs">
                    Análises temporais avançadas estarão disponíveis em breve, permitindo visualizar tendências e padrões.
                  </p>
                  <Button disabled>Ativar Análise Avançada</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-center mt-8">
          <div className="text-center max-w-lg">
            <p className="text-gray-500">
              Esta é uma versão de demonstração do sistema de estatísticas. 
              Em breve, mais funcionalidades serão adicionadas, incluindo exportação de relatórios 
              e análises personalizadas.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStatistics;
