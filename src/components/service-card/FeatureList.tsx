
import React from 'react';
import { Check } from 'lucide-react';

interface FeatureListProps {
  features: string[];
}

const FeatureList: React.FC<FeatureListProps> = ({ features }) => {
  return (
    <ul className="space-y-3 mb-6 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-2">
          <Check className="w-5 h-5 text-harmonia-green shrink-0 mt-0.5" />
          <span className="text-sm text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>
  );
};

export default FeatureList;
