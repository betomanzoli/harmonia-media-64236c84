
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PreviewsHeaderProps {
  scrollToNewForm?: () => void;
}

const PreviewsHeader: React.FC<PreviewsHeaderProps> = ({ scrollToNewForm }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">Músicas de Prévias</h1>
      <p className="text-muted-foreground">
        Gerencie as prévias de músicas enviadas aos clientes
      </p>
      
      {scrollToNewForm && (
        <Button 
          onClick={scrollToNewForm} 
          size="sm" 
          className="mt-2 bg-harmonia-green hover:bg-harmonia-green/80"
        >
          <Plus className="h-4 w-4 mr-1" />
          Nova Prévia
        </Button>
      )}
    </div>
  );
};

export default PreviewsHeader;
