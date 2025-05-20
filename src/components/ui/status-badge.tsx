
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, Clock, AlertTriangle, X, Info } from "lucide-react";

export type StatusType = 
  // Payment statuses
  | 'paid' 
  | 'pending' 
  | 'overdue'
  | 'cancelled'
  // Project statuses
  | 'completed'
  | 'in_progress'
  | 'delayed'
  | 'on_hold'
  // Briefing statuses
  | 'new'
  | 'analyzed'
  | 'approved'
  // Custom status with custom color
  | string;

export interface StatusBadgeProps {
  status: StatusType;
  showIcon?: boolean;
  className?: string;
  customLabel?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ 
  status, 
  showIcon = true, 
  className,
  customLabel,
  size = 'md'
}: StatusBadgeProps) {
  // Map status to display configuration
  const statusConfig = {
    // Payment statuses
    'paid': {
      label: 'Pago',
      icon: Check,
      className: 'bg-green-500 text-white hover:bg-green-600',
    },
    'pending': {
      label: 'Pendente',
      icon: Clock,
      className: 'bg-yellow-500 text-white hover:bg-yellow-600',
    },
    'overdue': {
      label: 'Vencido',
      icon: AlertTriangle,
      className: 'bg-red-500 text-white hover:bg-red-600',
    },
    'cancelled': {
      label: 'Cancelado',
      icon: X,
      className: 'bg-gray-500 text-white hover:bg-gray-600',
    },
    // Project statuses
    'completed': {
      label: 'Concluído',
      icon: Check,
      className: 'bg-green-500 text-white hover:bg-green-600',
    },
    'in_progress': {
      label: 'Em Andamento',
      icon: Clock,
      className: 'bg-blue-500 text-white hover:bg-blue-600',
    },
    'delayed': {
      label: 'Atrasado',
      icon: AlertTriangle,
      className: 'bg-red-500 text-white hover:bg-red-600',
    },
    'on_hold': {
      label: 'Em Espera',
      icon: Info,
      className: 'bg-purple-500 text-white hover:bg-purple-600',
    },
    // Briefing statuses
    'new': {
      label: 'Novo',
      icon: Info,
      className: 'bg-blue-500 text-white hover:bg-blue-600',
    },
    'analyzed': {
      label: 'Analisado',
      icon: Check,
      className: 'bg-yellow-500 text-white hover:bg-yellow-600',
    },
    'approved': {
      label: 'Aprovado',
      icon: Check,
      className: 'bg-green-500 text-white hover:bg-green-600',
    },
  };

  // Get configuration for the current status or use a default
  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: customLabel || status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
    icon: Info,
    className: 'bg-gray-500 text-white hover:bg-gray-600',
  };
  
  const StatusIcon = config.icon;

  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-1.5',
    md: 'text-sm py-1 px-2',
    lg: 'text-base py-1 px-3'
  };

  return (
    <Badge 
      className={cn(
        config.className, 
        sizeClasses[size],
        "font-medium flex items-center gap-1",
        className
      )}
    >
      {showIcon && <StatusIcon className={cn(
        'shrink-0',
        size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-3.5 w-3.5' : 'h-4 w-4'
      )} />}
      {customLabel || config.label}
    </Badge>
  );
}
