
import React, { ReactNode } from 'react';

interface ProcessStepProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-card border border-border p-6 rounded-lg hover:border-harmonia-green/50 transition-colors">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default ProcessStep;
