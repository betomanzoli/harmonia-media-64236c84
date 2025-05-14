
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePreviewProjects } from './usePreviewProjects';
import { useToast } from '@/hooks/use-toast';
import { useCustomers } from './useCustomers';

export interface BriefingItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  packageType: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'approved';
  projectCreated?: boolean;
  description?: string;
}

export const useBriefings = () => {
  const [briefings, setBriefings] = useState<BriefingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addProject } = usePreviewProjects();
  const { customers, addCustomer } = useCustomers();
  const { toast } = useToast();
  
  // Load briefings from Supabase or localStorage
  const loadBriefings = useCallback(async () => {
    setIsLoading(true);
    try {
      // Try to load from localStorage first as fallback
      const storedBriefings = localStorage.getItem('harmonIA_briefings');
      if (storedBriefings) {
        setBriefings(JSON.parse(storedBriefings));
      } else {
        // Sample data if nothing exists
        const sampleBriefings: BriefingItem[] = [
          {
            id: 'B0001',
            name: 'Maria Silva',
            email: 'maria@example.com',
            phone: '+5511999999999',
            packageType: 'Essencial',
            createdAt: new Date().toLocaleDateString('pt-BR'),
            status: 'pending'
          },
          {
            id: 'B0002',
            name: 'João Santos',
            email: 'joao@example.com',
            phone: '+5521987654321',
            packageType: 'Premium',
            createdAt: new Date().toLocaleDateString('pt-BR'),
            status: 'completed'
          }
        ];
        setBriefings(sampleBriefings);
        // Save sample data to localStorage
        localStorage.setItem('harmonIA_briefings', JSON.stringify(sampleBriefings));
      }
    } catch (err) {
      console.error('Error loading briefings:', err);
      
      // Fallback to empty array if everything fails
      setBriefings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Create client from briefing if needed
  const ensureClientExists = useCallback((briefing: BriefingItem) => {
    // Check if client with this email already exists
    const existingCustomer = customers.find(c => c.email.toLowerCase() === briefing.email.toLowerCase());
    
    if (!existingCustomer) {
      // Create new customer
      addCustomer({
        name: briefing.name,
        email: briefing.email,
        phone: briefing.phone || '',
        projects: 1,
        status: 'active',
        createdAt: new Date().toISOString()
      });
      
      return null; // Return null as no existing customer was found
    }
    
    // Update project count for existing customer
    return {
      ...existingCustomer,
      projects: existingCustomer.projects + 1
    };
  }, [customers, addCustomer]);
  
  // Create project from briefing
  const createProjectFromBriefing = useCallback((briefing: BriefingItem) => {
    // First, make sure client exists
    const existingCustomer = ensureClientExists(briefing);
    
    // Create project
    const projectData = {
      clientName: briefing.name,
      clientEmail: briefing.email,
      clientPhone: briefing.phone,
      packageType: briefing.packageType,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      status: 'waiting' as const,
      versions: 0,
      previewUrl: '',
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      lastActivityDate: new Date().toLocaleDateString('pt-BR'),
      versionsList: [],
      briefingId: briefing.id
    };
    
    const newProjectId = addProject(projectData);
    
    // Update briefing status
    updateBriefingStatus(briefing.id, 'completed', true);
    
    toast({
      title: "Projeto criado",
      description: `Projeto ${newProjectId} criado a partir do briefing ${briefing.id}.`
    });
    
    return newProjectId;
  }, [ensureClientExists, addProject, toast, updateBriefingStatus]);
  
  // Update briefing status
  const updateBriefingStatus = useCallback((id: string, status: 'pending' | 'completed' | 'approved', projectCreated: boolean = false) => {
    setBriefings(prevBriefings => {
      const updatedBriefings = prevBriefings.map(briefing => {
        if (briefing.id === id) {
          return { ...briefing, status, projectCreated };
        }
        return briefing;
      });
      
      // Update localStorage
      localStorage.setItem('harmonIA_briefings', JSON.stringify(updatedBriefings));
      
      return updatedBriefings;
    });
  }, []);
  
  // Add new briefing
  const addBriefing = useCallback((briefing: Omit<BriefingItem, "id" | "createdAt" | "status">) => {
    const newId = `B${(briefings.length + 1).toString().padStart(4, '0')}`;
    
    const newBriefing: BriefingItem = {
      id: newId,
      ...briefing,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      status: 'pending'
    };
    
    setBriefings(prevBriefings => {
      const updatedBriefings = [...prevBriefings, newBriefing];
      localStorage.setItem('harmonIA_briefings', JSON.stringify(updatedBriefings));
      return updatedBriefings;
    });
    
    return newId;
  }, [briefings]);
  
  // Delete briefing
  const deleteBriefing = useCallback((id: string) => {
    setBriefings(prevBriefings => {
      const updatedBriefings = prevBriefings.filter(briefing => briefing.id !== id);
      localStorage.setItem('harmonIA_briefings', JSON.stringify(updatedBriefings));
      return updatedBriefings;
    });
  }, []);
  
  // Load briefings on component mount
  useEffect(() => {
    loadBriefings();
  }, [loadBriefings]);
  
  // Get briefing by ID
  const getBriefingById = useCallback((id: string) => {
    return briefings.find(briefing => briefing.id === id) || null;
  }, [briefings]);
  
  // Get briefing by email
  const getBriefingByEmail = useCallback((email: string) => {
    return briefings.find(briefing => briefing.email.toLowerCase() === email.toLowerCase()) || null;
  }, [briefings]);

  return {
    briefings,
    isLoading,
    getBriefingById,
    getBriefingByEmail,
    loadBriefings,
    createProjectFromBriefing,
    updateBriefingStatus,
    addBriefing,
    deleteBriefing
  };
};
