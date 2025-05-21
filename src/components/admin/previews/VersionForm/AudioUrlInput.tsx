
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AudioUrlInputProps {
  audioUrl: string;
  setAudioUrl: (value: string) => void;
}

const AudioUrlInput: React.FC<AudioUrlInputProps> = ({ audioUrl, setAudioUrl }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="audioUrl">URL do Google Drive (principal)</Label>
      <Input
        id="audioUrl"
        value={audioUrl}
        onChange={(e) => setAudioUrl(e.target.value)}
        placeholder="https://drive.google.com/file/d/..."
        required
      />
    </div>
  );
};

export default AudioUrlInput;
