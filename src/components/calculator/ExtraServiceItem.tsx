
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Check } from 'lucide-react';

interface ExtraServiceItemProps {
  id: string;
  title: string;
  price: number;
  description: string;
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
  isIncluded: boolean;
  notes?: string[];
  includedNote?: string;
}

const ExtraServiceItem: React.FC<ExtraServiceItemProps> = ({
  id,
  title,
  price,
  description,
  isChecked,
  onCheckedChange,
  isIncluded,
  notes = [],
  includedNote
}) => {
  return (
    <div className={`flex items-start space-x-2 border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition-colors ${isIncluded ? 'bg-harmonia-green/10' : ''}`}>
      <Checkbox 
        id={id} 
        checked={isChecked || isIncluded}
        onCheckedChange={(checked) => onCheckedChange(checked === true)}
        disabled={isIncluded}
      />
      <div className="grid gap-1.5 w-full">
        <div className="flex justify-between">
          <Label htmlFor={id} className="font-medium">{title}</Label>
          {isIncluded ? (
            <span className="text-harmonia-green font-semibold flex items-center">
              <Check className="w-4 h-4 mr-1" /> Incluso
            </span>
          ) : (
            <span className="text-harmonia-green font-semibold">+R${price}</span>
          )}
        </div>
        <p className="text-sm text-gray-400">
          {description}
          {notes.map((note, index) => (
            <span key={index} className="block mt-1 text-amber-400">{note}</span>
          ))}
          {isIncluded && includedNote && (
            <span className="block mt-1 text-harmonia-green">{includedNote}</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default ExtraServiceItem;
