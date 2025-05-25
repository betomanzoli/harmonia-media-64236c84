
import React, { useEffect } from 'react';
import { useStatistics } from '@/hooks/admin/useStatistics';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { useBriefings } from '@/hooks/admin/useBriefings';
import { useCustomers } from '@/hooks/admin/useCustomers';
import StatsSummary from './StatsSummary';
import StatisticsCharts from './StatisticsCharts';
import RecentProjectsList, { Project as RecentProject } from './RecentProjectsList';
import RecentActivities from './RecentActivities';
import DashboardPreviewsCard from './DashboardPreviewsCard';

const DashboardContent: React.FC = () => {
  const { 
    projectsData, 
    revenueData, 
    clientsData
  } = useStatistics();
  
  const { projects, loadProjects } = usePreviewProjects();
  const { briefings, fetchBriefings } = useBriefings();
  const { customers, refreshCustomers } = useCustomers();
  
  // Calculate revenue from the prices of different package types
  const calculateRevenue = () => {
    // Base package prices
    const packagePrices = {
      'Essencial': 1997,
      'Premium': 3997,
      'Profissional': 2997,
      'Personalizado': 5000, // Default price for custom packages
    };
    
    return projects.reduce((total, project) => {
      const packageType = project.package_type?.toString() || '';
      // Find a matching package price or use default
      let price = 0;
      for (const [key, value] of Object.entries(packagePrices)) {
        if (packageType.toLowerCase().includes(key.toLowerCase())) {
          price = value;
          break;
        }
      }
      return total + price;
    }, 0);
  };
  
  // Calculate status counts from actual projects data
  const calculateStatusCounts = () => {
    return {
      pendingProjects: projects.filter(p => p.status === 'waiting').length,
      feedbackProjects: projects.filter(p => p.status === 'feedback').length,
      completedProjects: projects.filter(p => p.status === 'approved').length
    };
  };
  
  const { pendingProjects, feedbackProjects, completedProjects } = calculateStatusCounts();
  const revenueTotal = calculateRevenue();
  
  // Convert ProjectItem to the format compatible with RecentProjectsList
  const formattedProjects: RecentProject[] = projects
    .sort((a, b) => new Date(b.last_activity_date || b.created_at).getTime() - new Date(a.last_activity_date || a.created_at).getTime())
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      clientName: p.client_name,
      title: p.package_type ? `${p.package_type} para ${p.client_name}` : `Projeto ${p.id}`,
      status: p.status,
      date: p.created_at
    }));
  
  useEffect(() => {
    // Load all data when the component mounts
    loadProjects();
    fetchBriefings();
    refreshCustomers();
  }, [loadProjects, fetchBriefings, refreshCustomers]);
  
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <StatsSummary 
        projectCount={projects.length}
        clientCount={customers.length}
        briefingCount={briefings.length}
        revenueTotal={revenueTotal}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatisticsCharts 
          projectsData={projectsData}
          revenueData={revenueData}
          clientsData={clientsData}
        />
        
        <div className="space-y-6">
          <DashboardPreviewsCard 
            pendingCount={pendingProjects}
            feedbackCount={feedbackProjects}
            completedCount={completedProjects}
          />
          
          <RecentActivities />
        </div>
      </div>
      
      <RecentProjectsList projects={formattedProjects} />
    </div>
  );
};

export default DashboardContent;
