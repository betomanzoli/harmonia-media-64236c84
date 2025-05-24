
import { useState, useEffect } from 'react';

export interface ProjectItem {
  id: string;
  clientName: string;
  clientEmail: string;
  packageType: string;
  createdAt: string;
  status: 'waiting' | 'feedback' | 'approved' | 'processing';
}

export function usePreviewProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: 'P0001',
      clientName: 'João Silva',
      clientEmail: 'joao@example.com',
      packageType: 'Profissional',
      createdAt: '10/05/2023',
      status: 'waiting'
    },
    {
      id: 'P0002',
      clientName: 'Maria Santos',
      clientEmail: 'maria@example.com',
      packageType: 'Premium',
      createdAt: '15/05/2023',
      status: 'feedback'
    }
  ]);

  return { projects };
}
