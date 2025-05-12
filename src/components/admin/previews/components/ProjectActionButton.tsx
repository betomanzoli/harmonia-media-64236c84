
import React from 'react';
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ProjectActionButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  children: React.ReactNode;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
  className?: string;
}

const ProjectActionButton: React.FC<ProjectActionButtonProps> = ({
  onClick,
  icon: Icon,
  children,
  variant = "outline",
  className = ""
}) => {
  return (
    <Button 
      variant={variant} 
      className={`flex justify-start ${className}`}
      onClick={onClick}
    >
      <Icon className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
};

export default ProjectActionButton;
