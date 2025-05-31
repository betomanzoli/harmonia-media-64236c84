
import { useState, useEffect } from 'react';

// Types for statistics data
interface CountsData {
  projects: number;
  portfolio: number;
  clients: number;
  revenue: number;
}

interface ChartData {
  name: string;
  value: number;
}

interface Project {
  id: string;
  title: string;
  client: string;
  status: 'pending' | 'feedback' | 'completed';
  date: string;
  value: string;
  type: string;
}

export const useStatistics = () => {
  const [counts, setCounts] = useState<CountsData>({
    projects: 0,
    portfolio: 0,
    clients: 0,
    revenue: 0
  });
  
  const [projectsData, setProjectsData] = useState<ChartData[]>([]);
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);
  const [clientsData, setClientsData] = useState<ChartData[]>([]);
  
  const [pendingProjects, setPendingProjects] = useState(0);
  const [feedbackProjects, setFeedbackProjects] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);
  
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    // Fetch statistics from localStorage or API
    const fetchStatistics = () => {
      try {
        // Get projects data
        const savedProjects = JSON.parse(localStorage.getItem('preview-projects') || '[]');
        const portfolioItems = JSON.parse(localStorage.getItem('portfolio-items') || '[]');
        
        // Calculate statistics
        const totalProjects = savedProjects.length + 3; // Add some mock projects
        const totalPortfolio = portfolioItems.length;
        const totalClients = Math.max(1, Math.floor(totalProjects * 0.8)); // Assume 80% of projects are from unique clients
        const totalRevenue = totalProjects * 1500; // Average project value
        
        setPendingProjects(Math.floor(totalProjects * 0.3));
        setFeedbackProjects(Math.floor(totalProjects * 0.2));
        setCompletedProjects(Math.floor(totalProjects * 0.5));
        
        // Set counts
        setCounts({
          projects: totalProjects,
          portfolio: totalPortfolio,
          clients: totalClients,
          revenue: totalRevenue
        });
        
        // Generate chart data
        generateChartData(totalProjects, totalRevenue, totalClients);
        
        // Generate recent projects
        generateRecentProjects(savedProjects);
        
      } catch (error) {
        console.error('Error loading statistics:', error);
        // Set fallback data
        setCounts({
          projects: 5,
          portfolio: 3,
          clients: 4,
          revenue: 7500
        });
        
        setPendingProjects(2);
        setFeedbackProjects(1);
        setCompletedProjects(2);
        
        generateChartData(5, 7500, 4);
        generateRecentProjects([]);
      }
    };
    
    fetchStatistics();
  }, []);
  
  const generateChartData = (projects: number, revenue: number, clients: number) => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    
    // Generate projects data with random distribution
    const projectsChartData = months.map((month, index) => ({
      name: month,
      value: index === months.length - 1 
        ? Math.floor(projects * 0.3) 
        : Math.floor(Math.random() * (projects * 0.2)) + 1
    }));
    
    // Generate revenue data with random distribution
    const revenueChartData = months.map((month, index) => ({
      name: month,
      value: index === months.length - 1 
        ? Math.floor(revenue * 0.3) 
        : Math.floor(Math.random() * (revenue * 0.2)) + 1000
    }));
    
    // Generate clients data with random distribution
    const clientsChartData = months.map((month, index) => ({
      name: month,
      value: index === months.length - 1 
        ? Math.floor(clients * 0.3) 
        : Math.floor(Math.random() * (clients * 0.2)) + 1
    }));
    
    setProjectsData(projectsChartData);
    setRevenueData(revenueChartData);
    setClientsData(clientsChartData);
  };
  
  const generateRecentProjects = (savedProjects: any[]) => {
    // Convert saved projects to the correct format
    const formattedProjects = savedProjects.map((project: any) => ({
      id: project.id || `PROJ-${Math.floor(Math.random() * 1000)}`,
      title: project.title || `Projeto ${Math.floor(Math.random() * 100)}`,
      client: project.clientName || 'Cliente',
      status: project.status || (['pending', 'feedback', 'completed'] as const)[Math.floor(Math.random() * 3)],
      date: project.createdAt || new Date().toLocaleDateString('pt-BR'),
      value: `R$ ${(Math.floor(Math.random() * 2000) + 997).toLocaleString('pt-BR')}`,
      type: project.packageType || (['Essencial', 'Profissional', 'Premium'])[Math.floor(Math.random() * 3)]
    }));
    
    // Add some mock projects if there are not enough
    if (formattedProjects.length < 5) {
      const mockProjects = [
        {
          id: 'PROJ-001',
          title: 'Música para Casamento',
          client: 'João Silva',
          status: 'completed' as const,
          date: '10/04/2025',
          value: 'R$ 1.997,00',
          type: 'Profissional'
        },
        {
          id: 'PROJ-002',
          title: 'Jingle para Produto',
          client: 'Maria Oliveira',
          status: 'feedback' as const,
          date: '15/04/2025',
          value: 'R$ 2.997,00',
          type: 'Premium'
        },
        {
          id: 'PROJ-003',
          title: 'Música de Aniversário',
          client: 'Carlos Santos',
          status: 'pending' as const,
          date: '20/04/2025',
          value: 'R$ 997,00',
          type: 'Essencial'
        }
      ];
      
      formattedProjects.push(...mockProjects.slice(0, 5 - formattedProjects.length));
    }
    
    // Sort by date (newest first) and take the first 5
    const sortedProjects = formattedProjects.sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateB.getTime() - dateA.getTime();
    }).slice(0, 5);
    
    setRecentProjects(sortedProjects);
  };
  
  return {
    counts,
    projectsData,
    revenueData,
    clientsData,
    pendingProjects,
    feedbackProjects,
    completedProjects,
    recentProjects
  };
};
