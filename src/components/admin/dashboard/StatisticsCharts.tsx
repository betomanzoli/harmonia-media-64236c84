
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface ChartData {
  name: string;
  value: number;
}

interface StatisticsChartsProps {
  projectsData: ChartData[];
  revenueData: ChartData[];
  clientsData: ChartData[];
}

const StatisticsCharts: React.FC<StatisticsChartsProps> = ({ projectsData, revenueData, clientsData }) => {
  return (
    <div className="grid gap-4">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Projetos</CardTitle>
          <CardDescription>Número de projetos por mês</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectsData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Receita</CardTitle>
          <CardDescription>Receita por mês (R$)</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <CardDescription>Novos clientes por mês</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={clientsData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#ffc658" fill="#ffc658" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCharts;
