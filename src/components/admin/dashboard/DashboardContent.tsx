
import React, { useEffect } from 'react';
import StatsSummary from './StatsSummary';
import RecentProjectsList from './RecentProjectsList';
import RecentActivities from './RecentActivities';
import ProjectStatusCard from './ProjectStatusCard';
import DashboardPreviewsCard from './DashboardPreviewsCard';
import StatisticsCharts from './StatisticsCharts';

interface Briefing {
  id: string;
  client_name: string;
  client_email: string;
  package_type: string;
  status: string;
  created_at: string;
  responses?: Record<string, any>;
}

interface DashboardContentProps {
  briefingsHook: {
    briefings: Briefing[];
    isLoading: boolean;
    error: string;
    refetch: () => Promise<void>;
  };
}

const DashboardContent: React.FC<DashboardContentProps> = ({ briefingsHook }) => {
  const { briefings, isLoading, error, refetch } = briefingsHook;

  // Fetch data on component mount
  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <StatsSummary 
        totalBriefings={briefings.length}
        pendingProjects={briefings.filter(b => b.status === 'pending').length}
        completedProjects={briefings.filter(b => b.status === 'completed').length}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ProjectStatusCard briefings={briefings} />
        <DashboardPreviewsCard />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <StatisticsCharts />
        </div>
        <RecentActivities />
      </div>
      
      <RecentProjectsList 
        projects={briefings.slice(0, 5)}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default DashboardContent;
