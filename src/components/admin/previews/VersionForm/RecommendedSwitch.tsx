
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface RecommendedSwitchProps {
  recommended: boolean;
  setRecommended: (checked: boolean) => void;
}

const RecommendedSwitch: React.FC<RecommendedSwitchProps> = ({ recommended, setRecommended }) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="recommended"
        checked={recommended}
        onCheckedChange={setRecommended}
      />
      <Label htmlFor="recommended">Marcar como recomendada</Label>
    </div>
  );
};

export default RecommendedSwitch;
