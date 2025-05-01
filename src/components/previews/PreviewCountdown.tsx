
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Clock } from 'lucide-react';

interface PreviewCountdownProps {
  expirationDate: string;
}

const PreviewCountdown: React.FC<PreviewCountdownProps> = ({ expirationDate }) => {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    // Parse the expiration date (assuming format DD/MM/YYYY)
    const parseDateString = (dateStr: string) => {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        // Format: DD/MM/YYYY
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      }
      // Fallback - try as ISO string or return current date + 7 days
      return new Date(dateStr) || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    };
    
    const expiresAt = parseDateString(expirationDate);
    
    const calculateTimeRemaining = () => {
      const now = new Date();
      const difference = expiresAt.getTime() - now.getTime();
      
      if (difference <= 0) {
        // Expired
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      return { days, hours, minutes, seconds };
    };
    
    // Initial calculation
    setTimeRemaining(calculateTimeRemaining());
    
    // Update the countdown every second
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [expirationDate]);
  
  const isExpired = timeRemaining.days === 0 && 
                   timeRemaining.hours === 0 && 
                   timeRemaining.minutes === 0 && 
                   timeRemaining.seconds === 0;
  
  return (
    <Card className="p-4">
      <div className="flex items-start">
        <Clock className="w-5 h-5 text-yellow-500 mt-1 mr-3" />
        <div>
          <h3 className="font-medium text-gray-900 mb-1">
            {isExpired ? 'Esta prévia expirou' : 'Prévia disponível por tempo limitado'}
          </h3>
          
          {isExpired ? (
            <p className="text-sm text-gray-500">
              A prévia expirou. Entre em contato conosco caso deseje fazer alterações adicionais.
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-3">
                Esta prévia expira em {expirationDate}. Por favor, envie seu feedback ou aprove antes dessa data.
              </p>
              
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xl font-semibold">{timeRemaining.days}</div>
                  <div className="text-xs text-gray-500">dias</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xl font-semibold">{timeRemaining.hours}</div>
                  <div className="text-xs text-gray-500">horas</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xl font-semibold">{timeRemaining.minutes}</div>
                  <div className="text-xs text-gray-500">min</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xl font-semibold">{timeRemaining.seconds}</div>
                  <div className="text-xs text-gray-500">seg</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PreviewCountdown;
