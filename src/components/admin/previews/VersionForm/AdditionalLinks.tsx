
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';

interface AdditionalLink {
  label: string;
  url: string;
}

interface AdditionalLinksProps {
  links: AdditionalLink[];
  onAddLink: () => void;
  onRemoveLink: (index: number) => void;
  onUpdateLinkLabel: (index: number, label: string) => void;
  onUpdateLinkUrl: (index: number, url: string) => void;
}

const AdditionalLinks: React.FC<AdditionalLinksProps> = ({
  links,
  onAddLink,
  onRemoveLink,
  onUpdateLinkLabel,
  onUpdateLinkUrl
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Links Adicionais (Stems, etc)</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={onAddLink}
        >
          <Plus className="w-4 h-4 mr-1" /> Adicionar Link
        </Button>
      </div>
      
      {links.map((link, index) => (
        <div key={index} className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-4">
            <Input
              value={link.label}
              onChange={(e) => onUpdateLinkLabel(index, e.target.value)}
              placeholder="Tipo (Ex: Vocal Stem)"
            />
          </div>
          <div className="col-span-7">
            <Input
              value={link.url}
              onChange={(e) => onUpdateLinkUrl(index, e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
            />
          </div>
          <div className="col-span-1">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={() => onRemoveLink(index)}
            >
              <Trash className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdditionalLinks;
