
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { Loader2, AlertTriangle, Info, Bug, RefreshCw, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { testSupabaseConnection, testAuthSettings, supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const formSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

const AdminLogin: React.FC = () => {
  const { login, connectionStatus, testConnection, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [debugInfo, setDebugInfo] = useState<{
    connectionDetails: string;
    authSettings: string;
    supabaseUrl: string;
    storageInfo: string;
  }>({
    connectionDetails: 'Não testado',
    authSettings: 'Não testado',
    supabaseUrl: '',
    storageInfo: '',
  });
  const [showDebug, setShowDebug] = useState(false);
  const [detailedErrorInfo, setDetailedErrorInfo] = useState<string>('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Verificar se já está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin-j28s7d1k/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Testar conexão ao inicializar
  useEffect(() => {
    const checkConnection = async () => {
      console.log('AdminLogin: Verificando conexão...');
      if (!connectionStatus.tested) {
        await testConnection();
      }
      
      // Carregar informações de debug
      loadDebugInfo();
    };
    
    checkConnection();
  }, [connectionStatus.tested, testConnection]);

  const loadDebugInfo = async () => {
    // Carregar URL do Supabase - Corrigido para não usar getUrl()
    const supabaseUrlInfo = supabase.supabaseUrl || 'URL não disponível';
    
    // Verificar storage local
    let storageInfo = 'Não disponível';
    try {
      const storageTested = localStorage.getItem('harmonia-admin-auth-tested');
      const storageSession = localStorage.getItem('harmonia-admin-auth');
      storageInfo = `Teste: ${storageTested ? 'Presente' : 'Ausente'}, Sessão: ${storageSession ? 'Presente' : 'Ausente'}`;
    } catch (e) {
      storageInfo = `Erro ao acessar localStorage: ${e instanceof Error ? e.message : 'Desconhecido'}`;
    }
    
    setDebugInfo(prev => ({
      ...prev,
      supabaseUrl: supabaseUrlInfo,
      storageInfo
    }));
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setLoginError(null);
    setDetailedErrorInfo('');
    
    console.log("Tentando fazer login com:", { email: values.email });
    
    // Registrar tentativa no localStorage para diagnóstico
    try {
      localStorage.setItem('harmonia-admin-auth-tested', 'true');
    } catch (e) {
      console.warn('Não foi possível usar localStorage:', e);
    }
    
    try {
      const { success, error } = await login(values.email, values.password);
      
      if (success) {
        navigate('/admin-j28s7d1k/dashboard');
      } else {
        console.error("Erro de login:", error);
        setLoginError(error || 'Credenciais inválidas. Por favor, tente novamente.');
        toast({
          title: 'Falha no login',
          description: error || 'Credenciais inválidas. Por favor, tente novamente.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error("Erro durante login:", error);
      setLoginError('Ocorreu um erro durante o login');
      setDetailedErrorInfo(error.message || 'Erro desconhecido');
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro durante o login. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryConnection = async () => {
    setIsLoading(true);
    await testConnection();
    await loadDebugInfo();
    setIsLoading(false);
  };

  const runDiagnostics = async () => {
    setIsLoading(true);
    
    try {
      // Executar testes de diagnóstico
      const connectionTest = await testSupabaseConnection();
      const authTest = await testAuthSettings();
      
      setDebugInfo(prev => ({
        ...prev,
        connectionDetails: JSON.stringify(connectionTest, null, 2),
        authSettings: JSON.stringify(authTest, null, 2),
      }));
      
      toast({
        title: 'Diagnóstico concluído',
        description: 'Informações de diagnóstico foram atualizadas',
      });
    } catch (err) {
      console.error('Erro ao executar diagnóstico:', err);
      toast({
        title: 'Erro',
        description: 'Falha ao executar diagnóstico',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordReset = async () => {
    if (!resetEmail || !resetEmail.includes('@')) {
      toast({
        title: 'Email inválido',
        description: 'Por favor, forneça um email válido para redefinir a senha.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: window.location.origin + '/admin-reset-password',
      });
      
      if (error) {
        throw error;
      }
      
      setResetSent(true);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">harmonIA</CardTitle>
          <CardDescription>
            Área Administrativa
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connectionStatus.tested && !connectionStatus.connected && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Problema de conexão</AlertTitle>
              <AlertDescription>
                Não foi possível conectar ao backend: {connectionStatus.error}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 w-full"
                  onClick={handleRetryConnection}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Tentar novamente
                    </>
                  )}
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro de autenticação</AlertTitle>
              <AlertDescription>
                {loginError}
                {detailedErrorInfo && (
                  <div className="mt-2 text-xs bg-red-50 p-2 rounded">
                    <p className="font-medium">Detalhes técnicos:</p>
                    <p className="break-all">{detailedErrorInfo}</p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@example.com"
                        {...field}
                        disabled={isLoading || !connectionStatus.connected}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="******"
                        {...field}
                        disabled={isLoading || !connectionStatus.connected}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !connectionStatus.connected}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Entrar
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                className="w-full text-sm"
                onClick={() => setShowPasswordReset(true)}
              >
                Esqueceu sua senha?
              </Button>
            </form>
          </Form>

          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Informações de diagnóstico</AlertTitle>
            <AlertDescription className="text-xs space-y-2">
              <p>Status da conexão: {connectionStatus.connected ? 'Conectado' : 'Desconectado'}</p>
              <p>URL do Supabase: {debugInfo.supabaseUrl || 'Não disponível'}</p>
              <p>Local Storage: {debugInfo.storageInfo}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-1 w-full"
                onClick={() => setShowDebug(!showDebug)}
              >
                {showDebug ? 'Ocultar detalhes' : 'Mostrar detalhes avançados'}
              </Button>
              {showDebug && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-1 w-full"
                  onClick={runDiagnostics}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Executando diagnóstico...
                    </>
                  ) : (
                    <>
                      <Bug className="mr-2 h-4 w-4" />
                      Executar diagnóstico completo
                    </>
                  )}
                </Button>
              )}
              {showDebug && (
                <div className="mt-2 space-y-2 bg-slate-100 p-2 rounded text-xs">
                  <h4 className="font-bold">Detalhes da conexão:</h4>
                  <pre className="whitespace-pre-wrap break-all">{debugInfo.connectionDetails}</pre>
                  
                  <h4 className="font-bold">Configurações de autenticação:</h4>
                  <pre className="whitespace-pre-wrap break-all">{debugInfo.authSettings}</pre>
                </div>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-muted-foreground text-center">
            Área restrita para administradores do harmonIA.
          </p>
        </CardFooter>
      </Card>
      
      {/* Dialog de redefinição de senha */}
      <Dialog open={showPasswordReset} onOpenChange={setShowPasswordReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redefinir senha</DialogTitle>
            <DialogDescription>
              Insira seu email para receber instruções de redefinição de senha.
            </DialogDescription>
          </DialogHeader>
          
          {resetSent ? (
            <div className="space-y-4 py-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Email enviado</AlertTitle>
                <AlertDescription>
                  Verifique sua caixa de entrada para as instruções de redefinição de senha.
                </AlertDescription>
              </Alert>
              <Button 
                className="w-full" 
                onClick={() => setShowPasswordReset(false)}
              >
                Fechar
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPasswordReset(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1"
                  onClick={handlePasswordReset}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLogin;
