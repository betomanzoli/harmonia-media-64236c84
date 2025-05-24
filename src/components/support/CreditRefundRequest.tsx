
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CreditRefundRequest: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issue: '',
    attempts: '',
    dateRange: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const generateRequestText = () => {
    return `SOLICITAÇÃO DE REEMBOLSO DE CRÉDITOS

Nome: ${formData.name}
Email: ${formData.email}

PROBLEMA ENFRENTADO:
${formData.issue}

TENTATIVAS DE RESOLUÇÃO:
${formData.attempts}

PERÍODO EM QUE OCORRERAM OS PROBLEMAS:
${formData.dateRange}

Esta solicitação foi gerada através do Assistente de Reembolso de Créditos da harmonIA.
`;
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generateRequestText())
      .then(() => {
        toast({
          title: "Copiado com sucesso!",
          description: "O texto da solicitação foi copiado para sua área de transferência.",
        });
      })
      .catch(() => {
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o texto. Por favor, tente novamente.",
          variant: "destructive",
        });
      });
  };
  
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generateRequestText()], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'solicitacao-reembolso.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" required>Seu nome</Label>
          <Input 
            id="name" 
            name="name" 
            placeholder="Nome completo" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" required>Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="Seu email de contato" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="issue" required>Descreva o problema técnico enfrentado</Label>
        <Textarea 
          id="issue" 
          name="issue" 
          placeholder="Explique detalhadamente o problema que você enfrentou com o Supabase ou outras funcionalidades técnicas" 
          value={formData.issue} 
          onChange={handleChange} 
          required 
          rows={5}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="attempts" required>Tentativas de resolução</Label>
        <Textarea 
          id="attempts" 
          name="attempts" 
          placeholder="Descreva quantas vezes você tentou resolver o problema e quais ações foram tomadas" 
          value={formData.attempts} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="dateRange" required>Período em que ocorreram os problemas</Label>
        <Input 
          id="dateRange" 
          name="dateRange" 
          placeholder="Ex: 10/05/2023 a 20/05/2023" 
          value={formData.dateRange} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button 
          onClick={handleCopy} 
          className="flex-1" 
          type="button"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copiar solicitação
        </Button>
        
        <Button 
          onClick={handleDownload}
          variant="outline" 
          className="flex-1"
          type="button" 
        >
          <Download className="h-4 w-4 mr-2" />
          Baixar como arquivo .txt
        </Button>
      </div>
    </div>
  );
};

export default CreditRefundRequest;
