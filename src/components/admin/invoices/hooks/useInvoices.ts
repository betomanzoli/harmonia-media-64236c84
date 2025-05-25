
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Invoice, Client, Project } from '../types';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedInvoices: Invoice[] = (data || []).map((item: any) => ({
        id: String(item.id || ''),
        client: String(item.client || ''),
        amount: String(item.amount || '0'),
        date: String(item.date || new Date().toISOString().split('T')[0]),
        due_date: String(item.due_date || new Date().toISOString().split('T')[0]),
        status: String(item.status || 'pending'),
        description: String(item.description || ''),
        client_id: String(item.client_id || ''),
        has_receipt: Boolean(item.has_receipt || false)
      }));

      setInvoices(mappedInvoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
      setInvoices([]);
    }
  };

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');

      if (error) throw error;

      const mappedClients: Client[] = (data || []).map((item: any) => ({
        id: String(item.id || ''),
        name: String(item.name || ''),
        email: String(item.email || '')
      }));

      setClients(mappedClients);
    } catch (error) {
      console.error('Error loading clients:', error);
      setClients([]);
    }
  };

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('title');

      if (error) throw error;

      const mappedProjects: Project[] = (data || []).map((item: any) => ({
        id: String(item.id || ''),
        title: String(item.title || ''),
        client_id: String(item.client_id || '')
      }));

      setProjects(mappedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([loadInvoices(), loadClients(), loadProjects()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    invoices,
    clients,
    projects,
    isLoading,
    loadInvoices,
    loadClients,
    loadProjects
  };
};
