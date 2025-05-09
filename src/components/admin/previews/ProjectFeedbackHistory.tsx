
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FeedbackItem } from '@/types/project.types';
import { formatRelativeDate } from '@/utils/dateUtils';
import { Loader2 } from 'lucide-react';

interface ProjectFeedbackHistoryProps {
  projectId: string;
  feedbackHistory: FeedbackItem[];
  isLoading?: boolean;
}

const ProjectFeedbackHistory: React.FC<ProjectFeedbackHistoryProps> = ({
  projectId,
  feedbackHistory = [],
  isLoading = false
}) => {
  // Helper function to determine badge style based on status
  const getStatusBadge = (status: string = 'pending') => {
    switch (status) {
      case 'processed':
        return <Badge variant="outline" className="bg-green-50 border-green-300 text-green-700">Processado</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="bg-yellow-50 border-yellow-300 text-yellow-700">Pendente</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Histórico de Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : feedbackHistory.length === 0 ? (
          <div className="text-center p-6 border border-dashed rounded-md">
            <p className="text-muted-foreground">Nenhum feedback recebido ainda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbackHistory.map(feedback => (
              <div 
                key={feedback.id} 
                className="p-4 border rounded-md bg-muted/20 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">
                    Feedback {feedback.version_id && `para versão ${feedback.version_id}`}
                  </h4>
                  {getStatusBadge(feedback.status)}
                </div>
                
                <p className="text-sm whitespace-pre-wrap">{feedback.comment || feedback.content}</p>
                
                <div className="text-xs text-muted-foreground">
                  Recebido {formatRelativeDate(feedback.created_at || feedback.createdAt || '')}
                  {feedback.version_id && (
                    <span className="ml-2">
                      • Versão: {feedback.version_id || feedback.versionId}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectFeedbackHistory;
