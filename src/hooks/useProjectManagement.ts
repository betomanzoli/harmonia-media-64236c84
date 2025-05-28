
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  title: string;
  client_name: string;
  client_email: string;
  status: 'waiting' | 'feedback' | 'approved';
  created_at: string;
  package_type?: string;
  versions: any[];
}

export const useProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProjects: Project[] = (data || []).map(project => ({
        id: project.id,
        title: project.title || 'Projeto harmonIA',
        client_name: project.client_name || 'Cliente',
        client_email: project.client_email || '',
        status: (['waiting', 'feedback', 'approved'].includes(project.status) 
          ? project.status 
          : 'waiting') as 'waiting' | 'feedback' | 'approved',
        created_at: project.created_at,
        package_type: project.package_type,
        versions: Array.isArray(project.versions) ? project.versions : []
      }));

      setProjects(formattedProjects);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: {
    title: string;
    description?: string;
    client_name: string;
    client_email: string;
    package_type: string;
    status: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...projectData,
          preview_code: `preview_${Date.now()}`,
          versions: []
        }])
        .select()
        .single();

      if (error) throw error;

      await loadProjects(); // Reload to get updated list
      return data;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      throw error;
    }
  };

  const updateProjectStatus = async (projectId: string, status: 'waiting' | 'feedback' | 'approved') => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status })
        .eq('id', projectId);

      if (error) throw error;

      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, status } : p
      ));
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return {
    projects,
    loading,
    createProject,
    updateProjectStatus,
    loadProjects
  };
};
