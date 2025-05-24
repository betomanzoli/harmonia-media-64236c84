
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Copy, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import creditRefundHelper from '@/services/creditRefundHelper';
import { useToast } from '@/hooks/use-toast';

const CreditRefundRequest: React.FC = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('Tentei configurar a integração com o Supabase para implementar autenticação e armazenamento de dados, mas após diversas tentativas não obtive sucesso. O assistente parecia não entender corretamente meus requisitos e gerou código que não funcionava. Mesmo após várias correções, a integração continuou apresentando erros.');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 7 days ago
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [attempts, setAttempts] = useState(10);
  const [creditsPerAttempt, setCreditsPerAttempt] = useState(3);
  
  const estimatedCredits = attempts * creditsPerAttempt;
  
  const generateRequest = () => {
    if (!name || !email || !description || !startDate || !endDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    const request = creditRefundHelper.generateRefundRequest({
      username: name,
      email,
      projectName: projectName || 'Meu Projeto',
      issueDescription: description,
      startDate: format(startDate, 'dd/MM/yyyy'),
      endDate: format(endDate, 'dd/MM/yyyy'),
      creditsUsed: estimatedCredits,
      failedAttempts: attempts
    });
    
    return request;
  };
  
  const copyToClipboard = () => {
    const request = generateRequest();
    if (!request) return;
    
    navigator.clipboard.writeText(request).then(() => {
      toast({
        title: "Copiado!",
        description: "O texto da solicitação foi copiado para a área de transferência."
      });
    }).catch(err => {
      console.error('Erro ao copiar para área de transferência:', err);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o texto. Por favor, tente manualmente.",
        variant: "destructive"
      });
    });
  };
  
  const downloadRequest = () => {
    const request = generateRequest();
    if (!request) return;
    
    const blob = new Blob([request], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solicitacao_reembolso_creditos.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download iniciado",
      description: "O arquivo de solicitação foi baixado."
    });
  };
  
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Solicitação de Reembolso de Créditos</CardTitle>
        <CardDescription>
          Preencha o formulário abaixo para gerar uma solicitação de reembolso de créditos devido a problemas 
          com a integração do Supabase.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Seu nome completo" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Seu email de contato" 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="projectName">Nome do projeto</Label>
          <Input 
            id="projectName" 
            value={projectName} 
            onChange={(e) => setProjectName(e.target.value)} 
            placeholder="Nome do projeto onde ocorreu o problema" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição do problema</Label>
          <Textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Descreva detalhadamente o problema encontrado" 
            rows={6}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data inicial do problema</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Data final do problema</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="attempts">Número de tentativas falhas</Label>
            <Input 
              id="attempts" 
              type="number"
              min={1}
              value={attempts} 
              onChange={(e) => setAttempts(parseInt(e.target.value) || 0)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="creditsPerAttempt">Créditos estimados por tentativa</Label>
            <Input 
              id="creditsPerAttempt" 
              type="number"
              min={1}
              value={creditsPerAttempt} 
              onChange={(e) => setCreditsPerAttempt(parseInt(e.target.value) || 0)} 
            />
          </div>
        </div>
        
        <div className="bg-muted p-4 rounded-md">
          <p className="text-sm font-medium mb-2">Resumo da solicitação:</p>
          <p className="text-sm">Período: {startDate && endDate ? `${format(startDate, 'dd/MM/yyyy')} até ${format(endDate, 'dd/MM/yyyy')}` : 'Datas não selecionadas'}</p>
          <p className="text-sm">Total de tentativas: {attempts}</p>
          <p className="text-sm font-medium">Total de créditos solicitados para reembolso: {estimatedCredits}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button onClick={copyToClipboard} className="w-full sm:w-auto">
          <Copy className="mr-2 h-4 w-4" />
          Copiar solicitação
        </Button>
        <Button onClick={downloadRequest} variant="outline" className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Baixar como arquivo .txt
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreditRefundRequest;
