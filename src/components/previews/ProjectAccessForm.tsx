
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Music, Mail, Key } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProjectAccessFormProps {
  projectId: string;
  onVerify: (code: string, email: string) => void;
}

const ProjectAccessForm: React.FC<ProjectAccessFormProps> = ({ projectId, onVerify }) => {
  const [code, setCode] = useState(projectId || '');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateAccess = async (previewCode: string, email: string) => {
    try {
      // Try to find a project with matching preview code
      const { data, error } = await supabase
        .from('projects')
        .select('client_id')
        .eq('preview_code', previewCode)
        .single();
      
      if (error || !data) {
        console.error('Invalid preview code:', error);
        toast({
          title: "Código inválido",
          description: "O código de prévia fornecido não é válido.",
          variant: "destructive"
        });
        return false;
      }
      
      // If we find a project, check if it belongs to a client with this email
      if (data.client_id) {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('email')
          .eq('id', data.client_id)
          .single();
          
        if (clientError || !clientData) {
          console.error('Client not found:', clientError);
          toast({
            title: "Cliente não encontrado",
            description: "Não foi possível verificar os dados do cliente.",
            variant: "destructive"
          });
          return false;
        }
        
        if (clientData.email.toLowerCase() !== email.toLowerCase()) {
          console.error('Email mismatch');
          toast({
            title: "Email não correspondente",
            description: "O email informado não corresponde ao cliente deste projeto.",
            variant: "destructive"
          });
          return false;
        }
      }
      
      // Email is valid for this preview code
      document.cookie = `preview_access_${previewCode}=authorized; path=/; Secure; SameSite=None; max-age=86400`;
      return true;
    } catch (error) {
      console.error('Error validating access:', error);
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
      console.error('Access verification error:', error);
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
