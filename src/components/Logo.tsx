
import React, { useEffect, useState } from 'react';
import { Music } from 'lucide-react';

const Logo: React.FC = () => {
  const [barHeights, setBarHeights] = useState([15, 8, 20, 12, 25, 10, 18, 22, 14, 19, 7, 17]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate random heights for sound bars
      const newHeights = barHeights.map(() => Math.floor(Math.random() * 20) + 5);
      setBarHeights(newHeights);
    }, 500);
    
    return () => clearInterval(interval);
  }, [barHeights]);

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Music className="w-6 h-6 text-harmonia-green" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-end h-4 gap-[1px] opacity-70">
          {barHeights.map((height, index) => (
            <div 
              key={index}
              className="w-[1.5px] bg-harmonia-green transition-all duration-300 ease-in-out"
              style={{ height: `${height}px` }}
            />
          ))}
        </div>
      </div>
      <span className="font-bold text-xl">
        harmon<span className="text-harmonia-green">IA</span>
      </span>
    </div>
  );
};

export default Logo;
