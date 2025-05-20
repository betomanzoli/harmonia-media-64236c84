
import React, { useState, useEffect } from 'react';
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

  // Try to restore email from storage if available
  useEffect(() => {
    try {
      const storedEmail = localStorage.getItem(`preview_email_${projectId}`);
      if (storedEmail) {
        setEmail(storedEmail);
      }
    } catch (e) {
      console.error("Failed to get stored email:", e);
    }
  }, [projectId]);

  const validateAccess = async (previewCode: string, email: string) => {
    setErrorMessage('');
    
    try {
      // First check local storage for projects
      const storedProjects = localStorage.getItem('harmonIA_preview_projects');
      if (storedProjects) {
        const projects = JSON.parse(storedProjects);
        const project = projects.find(p => p.id === previewCode);
        
        if (project) {
          // Check if email matches the client's email
          if (project.clientEmail && project.clientEmail.toLowerCase() === email.toLowerCase()) {
            console.log("Valid email found for project:", previewCode);
            
            // Store auth in multiple locations for better cross-browser compatibility
            setPreviewAccessCookie(previewCode);
            setPreviewEmailCookie(previewCode, email);
            
            try {
              // Ensure we save in all possible storage locations
              localStorage.setItem(`preview_access_${previewCode}`, 'authorized');
              localStorage.setItem(`preview_email_${previewCode}`, email);
              
              sessionStorage.setItem(`preview_access_${previewCode}`, 'authorized');
              sessionStorage.setItem(`preview_email_${previewCode}`, email);
              
              // Also use non-httpOnly cookies
              document.cookie = `preview_access_${previewCode}=authorized; path=/; SameSite=Lax; max-age=${60*60*24*30}`; // 30 days
              document.cookie = `preview_email_${previewCode}=${email}; path=/; SameSite=Lax; max-age=${60*60*24*30}`; // 30 days
            } catch (e) {
              console.error("Storage error:", e);
            }
            
            return true;
          } else {
            setErrorMessage(`O email informado não corresponde ao cliente deste projeto.`);
            return false;
          }
        }
      }
      
      // Fallback to Supabase check (if needed in the future)
      setErrorMessage('Projeto não encontrado. Por favor, verifique o código de prévia.');
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
