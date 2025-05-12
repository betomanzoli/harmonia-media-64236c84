
import React from 'react';
import AudioExample from './AudioExample';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { AudioExample as AudioExampleType } from './audioData';

interface ExamplesListProps {
  initialExamples: AudioExampleType[];
  extraExamples: AudioExampleType[];
  showAll: boolean;
  onShowMore: () => void;
  onDelete?: (title: string) => void;
  isAdmin?: boolean;
}

const ExamplesList: React.FC<ExamplesListProps> = ({ 
  initialExamples, 
  extraExamples, 
  showAll, 
  onShowMore,
  onDelete,
  isAdmin = false
}) => {
  const displayedExamples = showAll ? [...initialExamples, ...extraExamples] : initialExamples;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedExamples.map((example, index) => (
          <AudioExample 
            key={index}
            title={example.title}
            subtitle={example.description}
            audioSrc={example.audioUrl}
            genre={example.type}
            type={example.type}
            onDelete={onDelete}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      {!showAll && extraExamples.length > 0 && (
        <div className="flex justify-center mt-10">
          <Button 
            onClick={onShowMore} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Carregar Mais Exemplos
          </Button>
        </div>
      )}
    </>
  );
};

export default ExamplesList;
