
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Music, Mail, Key } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { setPreviewAccessCookie, setPreviewEmailCookie } from '@/utils/authCookies';

interface ProjectAccessFormProps {
  projectId: string;
  onVerify: (code: string, email: string) => void;
}

const ProjectAccessForm: React.FC<ProjectAccessFormProps> = ({ projectId, onVerify }) => {
  const [code, setCode] = useState(projectId || '');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  const validateAccess = async (previewCode: string, email: string) => {
    try {
      setErrorMessage('');
      
      // Verificar no sistema local de projetos de prévia
      const storedProjects = localStorage.getItem('harmonIA_preview_projects');
      if (storedProjects) {
        const projects = JSON.parse(storedProjects);
        const project = projects.find(p => p.id === previewCode);
        
        if (project) {
          // Verificar se o email corresponde ao cliente do projeto
          if (project.clientEmail && project.clientEmail.toLowerCase() === email.toLowerCase()) {
            // Email válido para este projeto
            console.log("Email válido encontrado para o projeto:", previewCode);
            
            // Configurar cookies com SameSite=Lax para compatibilidade com navegadores anônimos
            setPreviewAccessCookie(previewCode);
            setPreviewEmailCookie(previewCode, email);
            
            // Armazenar também em localStorage como fallback
            localStorage.setItem(`preview_access_${previewCode}`, 'authorized');
            localStorage.setItem(`preview_email_${previewCode}`, email);
            
            return true;
          } else {
            // Email não corresponde
            setErrorMessage(`O email informado não corresponde ao cliente deste projeto.`);
            return false;
          }
        }
      }
      
      // Se não encontrar localmente, tente no Supabase (apenas um fallback)
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('client_id')
          .eq('preview_code', previewCode)
          .single();
        
        if (error || !data) {
          console.error('Código de prévia inválido:', error);
          setErrorMessage('O código de prévia fornecido não é válido.');
          return false;
        }
        
        // Se encontrar o projeto, verificar o email do cliente
        if (data.client_id) {
          const { data: clientData, error: clientError } = await supabase
            .from('clients')
            .select('email')
            .eq('id', data.client_id)
            .single();
            
          if (clientError || !clientData) {
            console.error('Cliente não encontrado:', clientError);
            setErrorMessage('Não foi possível verificar os dados do cliente.');
            return false;
          }
          
          if (clientData.email.toLowerCase() !== email.toLowerCase()) {
            console.error('Email não corresponde');
            setErrorMessage('O email informado não corresponde ao cliente deste projeto.');
            return false;
          } else {
            // Email válido no Supabase
            setPreviewAccessCookie(previewCode);
            setPreviewEmailCookie(previewCode, email);
            return true;
          }
        }
      } catch (e) {
        console.error("Erro ao verificar no Supabase:", e);
        setErrorMessage('Ocorreu um erro ao tentar validar o acesso.');
      }
      
      // Se chegou até aqui sem retornar, significa que o email é inválido
      setErrorMessage('Por favor, utilize o email cadastrado no projeto.');
      return false;
    } catch (error) {
      console.error('Erro validando acesso:', error);
      setErrorMessage('Ocorreu um erro durante a validação. Tente novamente.');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const isValid = await validateAccess(code, email);
      if (isValid) {
        onVerify(code, email);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Erro de verificação de acesso:', error);
      toast({
        title: "Erro de verificação",
        description: "Ocorreu um erro ao verificar seu acesso. Tente novamente.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <Card className="bg-white shadow-lg border-0">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-harmonia-green/10 rounded-full flex items-center justify-center mb-2">
            <Music className="text-harmonia-green h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Acesse sua Prévia</CardTitle>
          <CardDescription>
            Por favor, informe os dados abaixo para acessar a prévia do seu projeto musical.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectCode">Código do Projeto</Label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="projectCode"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="pl-10"
                  placeholder="Informe o código do projeto"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="Informe seu email"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                O mesmo email usado no momento da contratação
              </p>
            </div>
            
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {errorMessage}
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSubmit}
            className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⭘</span>
                Verificando...
              </>
            ) : (
              "Acessar Prévia"
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <p className="text-center text-sm text-gray-500 mt-4">
        Dúvidas? Entre em contato pelo WhatsApp +55 11 92058-5072
      </p>
    </div>
  );
};

export default ProjectAccessForm;
