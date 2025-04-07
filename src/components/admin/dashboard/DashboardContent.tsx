
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsSummary from '@/components/admin/dashboard/StatsSummary';
import StatisticsCharts from '@/components/admin/dashboard/StatisticsCharts';
import RecentActivities from '@/components/admin/dashboard/RecentActivities';

const DashboardContent: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard Administrativo</h1>
        <StatsSummary />
        
        <Tabs defaultValue="estatisticas">
          <TabsList className="mb-4">
            <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
            <TabsTrigger value="atividades">Atividades Recentes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="estatisticas">
            <StatisticsCharts />
          </TabsContent>
          
          <TabsContent value="atividades">
            <RecentActivities />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardContent;
