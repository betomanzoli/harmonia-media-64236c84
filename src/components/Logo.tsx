
import React from 'react';
import { BarChart2 } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <BarChart2 className="w-6 h-6 text-harmonia-green" />
      <span className="font-bold text-xl">
        Harmon<span className="text-harmonia-green">IA</span>
      </span>
    </div>
  );
};

export default Logo;
