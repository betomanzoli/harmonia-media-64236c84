
// src/hooks/admin/usePreviewProjects.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VersionItem {
  id: string;
  name: string;
  description?: string;
  fileId?: string;
  recommended?: boolean;
  final?: boolean;
  dateAdded?: string;
  url?: string;
  audioUrl?: string;
  additionalLinks?: Array<{ label: string; url: string }>;
}

export interface ProjectItem {
  id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  package_type?: string;
  created_at: string;
  status: 'waiting' | 'feedback' | 'approved';
  versions: number;
  preview_url?: string;
  expiration_date?: string;
  last_activity_date?: string;
  versions_list?: VersionItem[];
  briefing_id?: string;
  history?: any[];
  feedback?: string;
}

export const usePreviewProjects = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);
  const hasInitializedRef = useRef(false);

  // Carregar projetos do Supabase
  const loadProjects = useCallback(async () => {
    if (loadingRef.current) return projects;
    
    loadingRef.current = true;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type-safe mapping
      const typedProjects: ProjectItem[] = (data || []).map((item: any) => ({
        id: item.id as string,
        client_name: item.client_name as string,
        client_email: item.client_email as string,
        client_phone: item.client_phone as string,
        package_type: item.package_type as string,
        created_at: item.created_at as string,
        status: item.status as 'waiting' | 'feedback' | 'approved',
        versions: typeof item.versions === 'number' ? item.versions : 0,
        preview_url: item.preview_url as string,
        expiration_date: item.expiration_date as string,
        last_activity_date: item.last_activity_date as string,
        versions_list: Array.isArray(item.versions_list) ? item.versions_list : [],
        briefing_id: item.briefing_id as string,
        history: Array.isArray(item.history) ? item.history : [],
        feedback: item.feedback as string
      }));

      setProjects(typedProjects);
      return typedProjects;

    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      return [];
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [projects]);

  // Sync inicial
  useEffect(() => {
    if (!hasInitializedRef.current) {
      loadProjects();
      hasInitializedRef.current = true;
    }
  }, [loadProjects]);

  // Get project by ID
  const getProjectById = useCallback((id: string): ProjectItem | undefined => {
    return projects.find(project => project.id === id);
  }, [projects]);

  // Operações CRUD
  const addProject = useCallback(async (project: Omit<ProjectItem, 'id'>) => {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select();

    if (data && data[0]) {
      const newProject = data[0] as any;
      const typedProject: ProjectItem = {
        id: newProject.id as string,
        client_name: newProject.client_name as string,
        client_email: newProject.client_email as string,
        client_phone: newProject.client_phone as string,
        package_type: newProject.package_type as string,
        created_at: newProject.created_at as string,
        status: newProject.status as 'waiting' | 'feedback' | 'approved',
        versions: typeof newProject.versions === 'number' ? newProject.versions : 0,
        preview_url: newProject.preview_url as string,
        expiration_date: newProject.expiration_date as string,
        last_activity_date: newProject.last_activity_date as string,
        versions_list: Array.isArray(newProject.versions_list) ? newProject.versions_list : [],
        briefing_id: newProject.briefing_id as string,
        history: Array.isArray(newProject.history) ? newProject.history : [],
        feedback: newProject.feedback as string
      };
      
      setProjects(prev => [typedProject, ...prev]);
    }
    return { data, error };
  }, []);

  const updateProject = useCallback(async (id: string, updates: Partial<ProjectItem>) => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select();

    if (data && data[0]) {
      const updatedProject = data[0] as any;
      const typedProject: ProjectItem = {
        id: updatedProject.id as string,
        client_name: updatedProject.client_name as string,
        client_email: updatedProject.client_email as string,
        client_phone: updatedProject.client_phone as string,
        package_type: updatedProject.package_type as string,
        created_at: updatedProject.created_at as string,
        status: updatedProject.status as 'waiting' | 'feedback' | 'approved',
        versions: typeof updatedProject.versions === 'number' ? updatedProject.versions : 0,
        preview_url: updatedProject.preview_url as string,
        expiration_date: updatedProject.expiration_date as string,
        last_activity_date: updatedProject.last_activity_date as string,
        versions_list: Array.isArray(updatedProject.versions_list) ? updatedProject.versions_list : [],
        briefing_id: updatedProject.briefing_id as string,
        history: Array.isArray(updatedProject.history) ? updatedProject.history : [],
        feedback: updatedProject.feedback as string
      };

      setProjects(prev => 
        prev.map(p => p.id === id ? typedProject : p)
      );
    }
    return { data, error };
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (!error) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
    return { error };
  }, []);

  return {
    projects,
    isLoading,
    loadProjects,
    getProjectById,
    addProject,
    updateProject,
    deleteProject
  };
};
