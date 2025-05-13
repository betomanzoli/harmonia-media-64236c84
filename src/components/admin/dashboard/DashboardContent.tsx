
import React, { useEffect } from 'react';
import { useStatistics } from '@/hooks/admin/useStatistics';
import { usePreviewProjects, ProjectItem } from '@/hooks/admin/usePreviewProjects';
import { useBriefings } from '@/hooks/admin/useBriefings';
import { useCustomers } from '@/hooks/admin/useCustomers';
import StatsSummary from './StatsSummary';
import StatisticsCharts from './StatisticsCharts';
import RecentProjectsList, { Project as RecentProject } from './RecentProjectsList';
import RecentActivities from './RecentActivities';
import DashboardPreviewsCard from './DashboardPreviewsCard';

const DashboardContent: React.FC = () => {
  const { 
    counts, 
    projectsData, 
    revenueData, 
    clientsData, 
    pendingProjects, 
    feedbackProjects, 
    completedProjects,
    recentProjects
  } = useStatistics();
  
  const { projects, loadProjects } = usePreviewProjects();
  const { briefings } = useBriefings();
  const { customers } = useCustomers();
  
  // Usar dados reais quando disponíveis
  const actualCounts = {
    projects: projects.length || counts.projects,
    briefings: briefings.length,
    clients: customers.length || counts.clients,
    revenue: counts.revenue // Mantido como mock pois não temos sistema de pagamentos ainda
  };
  
  // Calcular projetos por status a partir dos dados reais
  const actualPendingProjects = projects.filter(p => p.status === 'waiting').length;
  const actualFeedbackProjects = projects.filter(p => p.status === 'feedback').length;
  const actualCompletedProjects = projects.filter(p => p.status === 'approved').length;
  
  // Converter ProjectItem para o formato compatível com RecentProjectsList
  const formattedProjects: RecentProject[] = projects.length > 0 
    ? projects.map((p: ProjectItem) => ({
        id: p.id,
        clientName: p.clientName,
        title: p.clientName ? `Projeto para ${p.clientName}` : `Projeto ${p.id}`,
        status: p.status,
        date: p.createdAt
      }))
    : recentProjects.map(p => ({
        id: p.id,
        clientName: p.client, // Map from 'client' field in recentProjects to 'clientName'
        title: p.title,
        status: p.status,
        date: p.date
      }));
  
  useEffect(() => {
    // Carregar projetos quando o componente montar
    loadProjects();
  }, [loadProjects]);
  
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <StatsSummary 
        projectCount={actualCounts.projects}
        clientCount={actualCounts.clients}
        briefingCount={actualCounts.briefings}
        revenueTotal={actualCounts.revenue}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatisticsCharts 
          projectsData={projectsData}
          revenueData={revenueData}
          clientsData={clientsData}
        />
        
        <div className="space-y-6">
          <DashboardPreviewsCard 
            pendingCount={actualPendingProjects || pendingProjects}
            feedbackCount={actualFeedbackProjects || feedbackProjects}
            completedCount={actualCompletedProjects || completedProjects}
          />
          
          <RecentActivities />
        </div>
      </div>
      
      <RecentProjectsList projects={formattedProjects.slice(0, 5)} />
    </div>
  );
};

export default DashboardContent;
