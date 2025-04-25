
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Mock data for demonstrating charts
const monthlyRevenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Fev', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Abr', value: 4500 },
  { name: 'Mai', value: 6000 },
  { name: 'Jun', value: 5500 },
  { name: 'Jul', value: 7000 }
];

const projectTypeData = [
  { name: 'Romântica', value: 30 },
  { name: 'Comercial', value: 25 },
  { name: 'Corporativa', value: 15 },
  { name: 'Comemorativa', value: 20 },
  { name: 'Podcast', value: 10 }
];

const clientSourceData = [
  { name: 'Indicação', value: 40 },
  { name: 'Google', value: 30 },
  { name: 'Redes Sociais', value: 20 },
  { name: 'Outros', value: 10 }
];

const weeklyProjectsData = [
  { day: 'Seg', novos: 2, concluidos: 1 },
  { day: 'Ter', novos: 3, concluidos: 2 },
  { day: 'Qua', novos: 1, concluidos: 3 },
  { day: 'Qui', novos: 4, concluidos: 2 },
  { day: 'Sex', novos: 3, concluidos: 4 },
  { day: 'Sab', novos: 2, concluidos: 1 },
  { day: 'Dom', novos: 1, concluidos: 0 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminStatistics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Estatísticas</h1>
          <p className="text-muted-foreground">Análise de performance e métricas do negócio</p>
        </div>
        
        <Tabs defaultValue="overview">
          <div className="mb-6">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="revenue">Receita</TabsTrigger>
              <TabsTrigger value="projects">Projetos</TabsTrigger>
              <TabsTrigger value="clients">Clientes</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Receita Mensal</CardTitle>
                  <CardDescription>Análise de receita dos últimos 7 meses</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200"></div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={monthlyRevenueData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
                        <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tipos de Projetos</CardTitle>
                  <CardDescription>Distribuição por categoria</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200"></div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={projectTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {projectTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip formatter={(value) => [`${value} projetos`, 'Quantidade']} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Projetos Semanais</CardTitle>
                  <CardDescription>Novos vs. Concluídos por dia</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200"></div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={weeklyProjectsData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="novos" name="Novos Projetos" fill="#8884d8" />
                        <Bar dataKey="concluidos" name="Projetos Concluídos" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Origem dos Clientes</CardTitle>
                  <CardDescription>Como os clientes encontram nosso serviço</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200"></div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={clientSourceData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {clientSourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip formatter={(value) => [`${value}%`, 'Porcentagem']} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Receita</CardTitle>
                <CardDescription>Detalhamento financeiro por período</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyRevenueData}
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
                      <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
                      <Legend />
                      <Line type="monotone" dataKey="value" name="Receita Mensal" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Projetos</CardTitle>
                <CardDescription>Métricas e desempenho de projetos</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={weeklyProjectsData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="novos" name="Novos Projetos" fill="#8884d8" />
                      <Bar dataKey="concluidos" name="Projetos Concluídos" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Clientes</CardTitle>
                <CardDescription>Dados sobre aquisição e retenção de clientes</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clientSourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {clientSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip formatter={(value) => [`${value}%`, 'Porcentagem']} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminStatistics;
