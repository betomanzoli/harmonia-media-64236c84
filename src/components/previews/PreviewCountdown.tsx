
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from 'lucide-react';

interface PreviewCountdownProps {
  days?: number;
  action?: string;
  expiresAt?: string;
}

const PreviewCountdown: React.FC<PreviewCountdownProps> = ({ 
  days,
  action = "para avaliação",
  expiresAt
}) => {
  // Calculate days if expiresAt is provided
  const daysRemaining = React.useMemo(() => {
    if (days !== undefined) return days;
    
    if (expiresAt) {
      const expiryDate = new Date(expiresAt);
      const today = new Date();
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    
    return 14; // Default
  }, [days, expiresAt]);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Prazo de avaliação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-orange-500" />
          <p className="text-sm">
            <span className="font-bold">{daysRemaining} dias</span> restantes {action}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewCountdown;
