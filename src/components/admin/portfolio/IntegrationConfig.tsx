
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Settings, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PortfolioItem } from '@/hooks/usePortfolioItems';

export interface IntegrationConfigProps {
  portfolioItems: PortfolioItem[];
}

const IntegrationConfig: React.FC<IntegrationConfigProps> = ({ portfolioItems }) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  
  // Placeholder webhook URL - In a real implementation, this would be stored in your database
  const webhookUrl = "https://your-domain.com/api/portfolio-webhook";
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    
    toast({
      title: "URL copiada!",
      description: "URL copiada para a área de transferência",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const generateExamplePayload = () => {
    const sampleItem = portfolioItems[0] || {
      id: "example-1",
      title: "Exemplo de Música",
      description: "Esta é uma descrição de exemplo",
      audioUrl: "https://drive.google.com/file/d/your-file-id/view",
      type: "example" as const
    };
    
    return JSON.stringify({
      action: "add_portfolio_item",
      item: {
        title: sampleItem.title,
        description: sampleItem.description,
        audioUrl: sampleItem.audioUrl,
        type: sampleItem.type
      }
    }, null, 2);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Configure integrações para automaticamente adicionar novos exemplos ao seu portfólio.
      </p>
      
      <div className="space-y-2">
        <Label htmlFor="webhook-url">URL do Webhook</Label>
        <div className="flex space-x-2">
          <Input
            id="webhook-url"
            value={webhookUrl}
            readOnly
            className="flex-1"
          />
          <Button
            size="icon"
            variant="outline"
            onClick={() => copyToClipboard(webhookUrl)}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Use esta URL para configurar integrações com Make ou Zapier.
        </p>
      </div>
      
      <div className="pt-2">
        <Label htmlFor="example-payload">Exemplo de Payload</Label>
        <Card className="mt-2 p-3 bg-muted">
          <pre className="text-xs overflow-auto whitespace-pre-wrap">
            {generateExamplePayload()}
          </pre>
        </Card>
      </div>
      
      <Button className="w-full mt-4 flex items-center" variant="outline">
        <Settings className="mr-2 h-4 w-4" />
        Configurações Avançadas
      </Button>
    </div>
  );
};

export default IntegrationConfig;
