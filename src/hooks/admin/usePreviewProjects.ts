
// src/hooks/admin/usePreviewProjects.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

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

      setProjects(data || []);
      return data || [];

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

    if (data) setProjects(prev => [...prev, data[0]]);
    return { data, error };
  }, []);

  const updateProject = useCallback(async (id: string, updates: Partial<ProjectItem>) => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select();

    if (data) {
      setProjects(prev => 
        prev.map(p => p.id === id ? { ...p, ...data[0] } : p)
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
