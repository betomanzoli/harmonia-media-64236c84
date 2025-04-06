
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Dados para o gráfico de barras - Visualizações de portfólio por mês
const portfolioViewsData = [
  { name: 'Jan', views: 65 },
  { name: 'Fev', views: 59 },
  { name: 'Mar', views: 80 },
  { name: 'Abr', views: 81 },
  { name: 'Mai', views: 56 },
  { name: 'Jun', views: 55 },
  { name: 'Jul', views: 40 },
  { name: 'Ago', views: 70 },
  { name: 'Set', views: 90 },
  { name: 'Out', views: 110 },
  { name: 'Nov', views: 98 },
  { name: 'Dez', views: 85 },
];

// Dados para o gráfico de linha - Pedidos por mês
const ordersData = [
  { name: 'Jan', pedidos: 4 },
  { name: 'Fev', pedidos: 3 },
  { name: 'Mar', pedidos: 6 },
  { name: 'Abr', pedidos: 8 },
  { name: 'Mai', pedidos: 5 },
  { name: 'Jun', pedidos: 7 },
  { name: 'Jul', pedidos: 9 },
  { name: 'Ago', pedidos: 11 },
  { name: 'Set', pedidos: 13 },
  { name: 'Out', pedidos: 12 },
  { name: 'Nov', pedidos: 8 },
  { name: 'Dez', pedidos: 10 },
];

// Dados para o gráfico de pizza - Distribuição de gêneros musicais
const genresData = [
  { name: 'MPB', value: 35 },
  { name: 'Pop', value: 30 },
  { name: 'Rock', value: 15 },
  { name: 'Eletrônica', value: 10 },
  { name: 'Hip Hop', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const PortfolioViewsChart = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Visualizações do Portfólio</CardTitle>
        <CardDescription>Visualizações mensais dos itens do portfólio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={portfolioViewsData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#10b981" name="Visualizações" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const OrdersChart = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Pedidos por Mês</CardTitle>
        <CardDescription>Total de pedidos recebidos mensalmente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={ordersData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pedidos" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const GenresChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Gênero</CardTitle>
        <CardDescription>Gêneros musicais no banco de áudio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 flex justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genresData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genresData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const StatisticsCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <PortfolioViewsChart />
      <OrdersChart />
      <GenresChart />
    </div>
  );
};

export default StatisticsCharts;
