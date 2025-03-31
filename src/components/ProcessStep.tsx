
import React from 'react';
import { cn } from '@/lib/utils';

interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
  className?: string;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ number, title, description, className }) => {
  return (
    <div className={cn("relative", className)}>
      <div className="flex items-start gap-4">
        <div className="bg-harmonia-green text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shrink-0">
          {number}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProcessStep;
