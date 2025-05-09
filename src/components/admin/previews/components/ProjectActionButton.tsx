
import React from 'react';
import { Button } from "@/components/ui/button";
import { LucideIcon } from 'lucide-react';

interface ProjectActionButtonProps {
  children: React.ReactNode;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'destructive';
  disabled?: boolean;
}

const ProjectActionButton: React.FC<ProjectActionButtonProps> = ({
  children,
  icon: Icon,
  onClick,
  variant = 'default',
  disabled = false
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      className="w-full"
    >
      <Icon className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
};

export default ProjectActionButton;
