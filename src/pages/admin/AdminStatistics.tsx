
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const salesData = [
  { month: 'Jan', revenue: 4500, orders: 9 },
  { month: 'Fev', revenue: 5200, orders: 12 },
  { month: 'Mar', revenue: 6800, orders: 15 },
  { month: 'Abr', revenue: 7400, orders: 18 },
  { month: 'Mai', revenue: 9100, orders: 22 },
  { month: 'Jun', revenue: 8700, orders: 20 },
  { month: 'Jul', revenue: 7800, orders: 17 },
  { month: 'Ago', revenue: 10200, orders: 25 },
  { month: 'Set', revenue: 11500, orders: 28 },
  { month: 'Out', revenue: 12200, orders: 30 },
  { month: 'Nov', revenue: 14500, orders: 35 },
  { month: 'Dez', revenue: 18000, orders: 42 },
];

const packageData = [
  { name: 'Essencial', value: 35 },
  { name: 'Profissional', value: 45 },
  { name: 'Premium', value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const sourceData = [
  { name: 'Site Direto', value: 50 },
  { name: 'Google', value: 25 },
  { name: 'Mídias Sociais', value: 15 },
  { name: 'Indicações', value: 10 },
];

const AdminStatistics: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Estatísticas</h1>
            <p className="text-muted-foreground">Análises e métricas de desempenho</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="2025">
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Receita Total</CardTitle>
              <CardDescription>2025 - Até hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">R$ 115.900,00</div>
              <div className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">↑ 12%</span> em relação ao período anterior
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pedidos Totais</CardTitle>
              <CardDescription>2025 - Até hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">273</div>
              <div className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">↑ 8%</span> em relação ao período anterior
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Ticket Médio</CardTitle>
              <CardDescription>2025 - Até hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">R$ 816,50</div>
              <div className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">↑ 3%</span> em relação ao período anterior
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList>
            <TabsTrigger value="revenue">Receita</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="packages">Pacotes</TabsTrigger>
            <TabsTrigger value="traffic">Tráfego</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Receita Mensal (2025)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={salesData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pedidos por Mês (2025)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Pacote</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={packageData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {packageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fontes de Tráfego</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminStatistics;
