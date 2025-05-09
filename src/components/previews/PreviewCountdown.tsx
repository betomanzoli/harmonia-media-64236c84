
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from 'lucide-react';

interface PreviewCountdownProps {
  days?: number;
  action?: string;
}

const PreviewCountdown: React.FC<PreviewCountdownProps> = ({ 
  days = 14, 
  action = "para avaliação" 
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Prazo de avaliação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-orange-500" />
          <p className="text-sm">
            <span className="font-bold">{days} dias</span> restantes {action}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewCountdown;
