
import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, role, rating }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 transition-all duration-200 hover:border-harmonia-green/50">
      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'text-harmonia-green fill-harmonia-green' : 'text-gray-500'}`} 
          />
        ))}
      </div>
      <p className="text-gray-300 mb-4">"{quote}"</p>
      <div>
        <p className="font-medium">{author}</p>
        {role && <p className="text-gray-400 text-sm">{role}</p>}
      </div>
    </div>
  );
};

export default TestimonialCard;
