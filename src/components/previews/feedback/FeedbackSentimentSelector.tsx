
import React from 'react';
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface FeedbackSentimentSelectorProps {
  onSelect: (sentiment: 'positive' | 'negative') => void;
  versionTitle?: string;
}

export const FeedbackSentimentSelector: React.FC<FeedbackSentimentSelectorProps> = ({
  onSelect,
  versionTitle
}) => {
  return (
    <div className="py-4">
      <h4 className="text-sm font-medium mb-3 text-center">O que você achou {versionTitle ? `da ${versionTitle}` : 'desta versão'}?</h4>
      <div className="flex justify-center gap-3">
        <Button 
          variant="outline" 
          onClick={() => onSelect('positive')}
          className="flex-1 sm:flex-none border-green-300 hover:bg-green-50 hover:text-green-700"
        >
          <ThumbsUp className="h-5 w-5 mr-2 text-green-500" />
          Gostei
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => onSelect('negative')}
          className="flex-1 sm:flex-none border-amber-300 hover:bg-amber-50 hover:text-amber-700"
        >
          <ThumbsDown className="h-5 w-5 mr-2 text-amber-500" />
          Precisa de ajustes
        </Button>
      </div>
    </div>
  );
};
