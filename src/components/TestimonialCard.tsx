
import React from 'react';
import { Star } from 'lucide-react';

export interface TestimonialCardProps {
  clientName: string;
  position: string;
  testimonial: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  clientName,
  position,
  testimonial,
  rating
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col h-full">
      <div className="flex mb-2">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
          />
        ))}
      </div>
      <p className="text-gray-600 italic mb-4">"{testimonial}"</p>
      <div className="mt-auto">
        <p className="font-semibold">{clientName}</p>
        <p className="text-sm text-gray-500">{position}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
