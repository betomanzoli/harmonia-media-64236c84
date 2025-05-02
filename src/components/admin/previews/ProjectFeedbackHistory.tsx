
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FeedbackItem } from '@/hooks/admin/usePreviewProjects';
import { MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProjectFeedbackHistoryProps {
  projectId: string;
  feedbackHistory: FeedbackItem[];
}

const ProjectFeedbackHistory: React.FC<ProjectFeedbackHistoryProps> = ({ 
  projectId,
  feedbackHistory
}) => {
  // Format date to pt-BR
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };
  
  if (feedbackHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Histórico de Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-gray-500 border border-dashed rounded-md">
            <MessageSquare className="mx-auto h-8 w-8 mb-2 text-gray-400" />
            <p>Nenhum feedback recebido ainda.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Histórico de Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {feedbackHistory.map((feedback, index) => (
              <div key={feedback.id} className="relative">
                {index !== feedbackHistory.length - 1 && (
                  <div className="absolute left-6 top-12 w-px h-full bg-gray-200" />
                )}
                
                <div className="flex space-x-4">
                  <div className="bg-gray-100 rounded-full p-2 h-12 w-12 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant={feedback.status === 'processed' ? 'secondary' : 'outline'}>
                        {feedback.status === 'processed' ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" /> Processado
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" /> Pendente
                          </>
                        )}
                      </Badge>
                      <span className="text-xs text-gray-500">{formatDate(feedback.createdAt)}</span>
                    </div>
                    
                    {feedback.versionId && (
                      <div className="text-xs text-gray-500 mb-1">
                        Sobre a versão: {feedback.versionId}
                      </div>
                    )}
                    
                    <div className="p-3 bg-gray-50 rounded-md border text-gray-700">
                      {feedback.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ProjectFeedbackHistory;
