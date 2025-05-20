
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface DashboardPreviewsCardProps {
  pendingCount: number;
  feedbackCount: number;
  completedCount: number;
}

const DashboardPreviewsCard: React.FC<DashboardPreviewsCardProps> = ({ 
  pendingCount, 
  feedbackCount, 
  completedCount 
}) => {
  const total = pendingCount + feedbackCount + completedCount;
  
  const pendingPercent = total > 0 ? Math.round((pendingCount / total) * 100) : 0;
  const feedbackPercent = total > 0 ? Math.round((feedbackCount / total) * 100) : 0;
  const completedPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status de Prévias</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Pendentes</span>
            <span className="font-medium">{pendingCount} ({pendingPercent}%)</span>
          </div>
          <Progress 
            value={pendingPercent} 
            className="bg-yellow-100"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Em Feedback</span>
            <span className="font-medium">{feedbackCount} ({feedbackPercent}%)</span>
          </div>
          <Progress 
            value={feedbackPercent} 
            className="bg-purple-100" 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Concluídos</span>
            <span className="font-medium">{completedCount} ({completedPercent}%)</span>
          </div>
          <Progress 
            value={completedPercent} 
            className="bg-green-100" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardPreviewsCard;
