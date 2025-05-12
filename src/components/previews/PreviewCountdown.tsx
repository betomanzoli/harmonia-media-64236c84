
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Clock } from 'lucide-react';

const PreviewCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(7 * 24 * 60 * 60); // 7 dias em segundos

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <Card className="bg-gradient-to-r from-harmonia-green/20 to-green-500/10 p-4 mb-8 flex items-center gap-2">
      <Clock className="text-harmonia-green h-5 w-5" />
      <span className="font-medium">
        Tempo restante para avaliação: <span className="text-harmonia-green font-bold">{formatTime(timeLeft)}</span>
      </span>
    </Card>
  );
};

export default PreviewCountdown;
