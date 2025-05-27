
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from 'lucide-react';

interface FeedbackEntry {
  id: string;
  content: string;
  created_at: string;
}

interface FeedbackHistoryCardProps {
  feedbackHistory: FeedbackEntry[];
}

const FeedbackHistoryCard: React.FC<FeedbackHistoryCardProps> = ({ feedbackHistory }) => {
  if (!feedbackHistory || feedbackHistory.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-harmonia-green" />
          Histórico de Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedbackHistory.map((feedback, index) => (
            <div key={feedback.id} className="bg-gray-50 p-4 rounded-md border-l-4 border-harmonia-green">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Feedback #{feedbackHistory.length - index}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(feedback.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-gray-800 text-sm">{feedback.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackHistoryCard;
