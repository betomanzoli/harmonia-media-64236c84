
import React from 'react';
import AudioExample from './AudioExample';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

export interface AudioExampleItem {
  title: string;
  subtitle: string;
  audioSrc: string;
  genre: string;
  type: string;
}

interface ExamplesListProps {
  initialExamples: AudioExampleItem[];
  extraExamples: AudioExampleItem[];
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
            subtitle={example.subtitle}
            audioSrc={example.audioSrc}
            genre={example.genre}
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
