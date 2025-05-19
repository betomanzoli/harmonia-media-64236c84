
import React from 'react';
import { StatusBadge } from '@/components/ui/status-badge';

interface ProjectStatusBadgeProps {
  status: 'waiting' | 'feedback' | 'approved';
}

const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'waiting':
      return <StatusBadge status="pending" customLabel="Aguardando Avaliação" />
    case 'feedback':
      return <StatusBadge status="in_progress" customLabel="Feedback Recebido" />
    case 'approved':
      return <StatusBadge status="approved" customLabel="Aprovado" />
    default:
      return <StatusBadge status="pending" customLabel="Status Desconhecido" />
  }
};

export default ProjectStatusBadge;
