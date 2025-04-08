
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Loader2, Info } from 'lucide-react';
import Logo from '@/components/Logo';

const AdminLoginContainer: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    
    try {
      // Simulação de login para desenvolvimento
      if (email === 'admin@harmonia.ai' && password === 'senha123') {
        localStorage.setItem('harmonia-admin-auth-token', 'fake-token-for-development');
        localStorage.setItem('harmonia-admin-auth-user', JSON.stringify({ email }));
        
        setTimeout(() => {
          navigate('/admin-j28s7d1k/dashboard');
        }, 1000);
      } else {
        throw new Error('Credenciais inválidas. Por favor, tente novamente.');
      }
    } catch (error: any) {
      console.error('Erro durante login:', error);
      setLoginError(error.message || 'Ocorreu um erro durante o login');
      toast({
        title: 'Falha no login',
        description: error.message || 'Credenciais inválidas. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: 'Email necessário',
        description: 'Por favor, forneça um email válido para redefinir a senha.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simular envio de email para redefinição de senha
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResetSuccess(true);
      toast({
        title: 'Email enviado',
        description: 'Verifique sua caixa de entrada para instruções de redefinição de senha.',
      });
    } catch (error: any) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível enviar o email de redefinição.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-[380px] shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <CardTitle className="text-2xl">
            {isResetMode ? 'Redefinir Senha' : 'Admin Login'}
          </CardTitle>
          <CardDescription>
            {isResetMode 
              ? 'Insira seu email para receber instruções de redefinição de senha' 
              : 'Acesse o painel administrativo da harmonIA'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          
          {resetSuccess && (
            <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Email de redefinição enviado. Verifique sua caixa de entrada.
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={isResetMode ? handlePasswordReset : handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  required
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              {!isResetMode && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Senha</label>
                  </div>
                  <Input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isResetMode ? 'Enviando...' : 'Processando...'}
                  </>
                ) : (
                  isResetMode ? 'Enviar Link de Recuperação' : 'Entrar'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            variant="link" 
            className="text-sm text-slate-500 hover:text-slate-900 px-0"
            onClick={() => {
              setIsResetMode(!isResetMode);
              setLoginError(null);
              setResetSuccess(false);
            }}
            disabled={isLoading}
          >
            {isResetMode ? 'Voltar para o login' : 'Esqueceu sua senha?'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLoginContainer;
