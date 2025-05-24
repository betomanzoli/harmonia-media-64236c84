
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WebhookUrlManagerProps {
  title: string;
  description: string;
  serviceType: string;
  storageUrl?: string;
}

const WebhookUrlManager: React.FC<WebhookUrlManagerProps> = ({
  title,
  description,
  serviceType,
  storageUrl
}) => {
  const [url, setUrl] = useState(storageUrl || 'https://example.com/webhook');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    toast({
      title: 'URL copiada',
      description: 'URL do webhook foi copiada para a área de transferência'
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };
  
  const handleSave = () => {
    // In a real app this would save to a database
    toast({
      title: 'URL salva',
      description: 'URL do webhook foi salva com sucesso'
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input value={url} onChange={(e) => setUrl(e.target.value)} />
          <Button variant="outline" onClick={handleCopy}>
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        
        <Button onClick={handleSave} className="w-full">
          Salvar
        </Button>
      </CardContent>
    </Card>
  );
};

export default WebhookUrlManager;
