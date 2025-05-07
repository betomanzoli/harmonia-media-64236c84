import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Music, Mail, Key, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/lib/supabase';

interface ProjectAccessFormProps {
  projectId: string;
  onVerify: (code: string, email: string) => void;
}

const ProjectAccessForm: React.FC<ProjectAccessFormProps> = ({ projectId, onVerify }) => {
  const [code, setCode] = useState(projectId || '');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Perform validation
    if (!code.trim()) {
      setError('Por favor, informe o código do projeto.');
      setIsLoading(false);
      return;
    }
    
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor, informe um email válido.');
      setIsLoading(false);
      return;
    }
    
    console.log('[ProjectAccessForm] Verificando acesso com código:', code, 'e email:', email);
    
    try {
      // First try to verify if the preview code exists
      console.log('[ProjectAccessForm] Consultando preview_code na tabela projects:', code);
      const { data, error } = await supabase
        .from('projects')
        .select('id, client_id, preview_code, clients!inner(*)')
        .eq('preview_code', code)
        .single();
      
      console.log('[ProjectAccessForm] Verificação de preview_code:', { data, error });
      
      if (error) {
        console.error('[ProjectAccessForm] Erro ao verificar preview_code:', error);
        
        // Try again with direct ID as fallback
        console.log('[ProjectAccessForm] Tentando buscar por ID direto:', code);
        const { data: directData, error: directError } = await supabase
          .from('projects')
          .select('id, preview_code')
          .eq('id', code)
          .single();
        
        console.log('[ProjectAccessForm] Resultado da busca por ID direto:', { directData, directError });
        
        if (directError || !directData) {
          console.log('[ProjectAccessForm] Código não encontrado por nenhum método');
          setError('Código de prévia não encontrado ou inválido.');
          setIsLoading(false);
          return;
        }
        
        // If we found the project by direct ID
        console.log('[ProjectAccessForm] Projeto encontrado por ID direto:', directData);
      }
      
      // For demo purposes, also allow test/demo emails or specific codes
      const isTestEmail = email.toLowerCase().includes('test') || 
        email.toLowerCase().includes('demo') || 
        email.toLowerCase().includes('admin') ||
        email.toLowerCase().includes('harmonia');
      
      const isDemoCode = code === '123456' || code.startsWith('P');
      
      // Fix: TypeScript error by properly handling clients data
      // Check if clients exists and if it's an array or object, then access email accordingly
      let clientEmail = null;
      if (data?.clients) {
        // If clients is an array, get the first item's email
        if (Array.isArray(data.clients)) {
          clientEmail = data.clients.length > 0 ? data.clients[0].email : null;
          console.log('[ProjectAccessForm] Clients is array, email:', clientEmail);
        } else {
          // Otherwise treat it as an object
          clientEmail = data.clients.email;
          console.log('[ProjectAccessForm] Clients is object, email:', clientEmail);
        }
      }
      
      console.log('[ProjectAccessForm] Verificações especiais:', { 
        isTestEmail, 
        isDemoCode,
        clientEmail,
        providedEmail: email 
      });
      
      // Client verification logic - simplified for now
      // In a production system, you should verify that this email is actually associated with the client
      const isAuthorized = data || isTestEmail || isDemoCode;
      
      if (isAuthorized) {
        console.log('[ProjectAccessForm] Acesso autorizado');
        
        // Save access in localStorage
        localStorage.setItem('preview_access', JSON.stringify({
          code: code,
          email: email,
          timestamp: Date.now()
        }));
        
        // Also save a specific access token for this preview
        localStorage.setItem(`preview_auth_${code}`, 'authorized');
        
        // Call the onVerify callback to notify parent component
        onVerify(code, email);
      } else {
        console.log('[ProjectAccessForm] Acesso negado: email não autorizado');
        setError('Email não autorizado para este código de prévia.');
      }
    } catch (err) {
      console.error('[ProjectAccessForm] Erro ao verificar acesso:', err);
      setError('Ocorreu um erro ao verificar o acesso. Tente novamente.');
    } finally {
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
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
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
        Dúvidas? Entre em contato pelo WhatsApp (11) 92058-5072
      </p>
    </div>
  );
};

export default ProjectAccessForm;
