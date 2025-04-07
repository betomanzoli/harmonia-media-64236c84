
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Loader2, AlertTriangle, Info, Bug } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { testSupabaseConnection, testAuthSettings } from '@/lib/supabase';

const formSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

const AdminLogin: React.FC = () => {
  const { login, connectionStatus, testConnection } = useAdminAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<{
    connectionDetails: string;
    authSettings: string;
  }>({
    connectionDetails: 'Não testado',
    authSettings: 'Não testado',
  });
  const [showDebug, setShowDebug] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Testar conexão ao inicializar
  useEffect(() => {
    const checkConnection = async () => {
      console.log('AdminLogin: Verificando conexão...');
      if (!connectionStatus.tested) {
        await testConnection();
      }
    };
    
    checkConnection();
  }, [connectionStatus.tested, testConnection]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setLoginError(null);
    
    console.log("Tentando fazer login com:", { email: values.email });
    
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
      setLoginError(error.message || 'Ocorreu um erro durante o login');
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
    await testConnection();
  };

  const runDiagnostics = async () => {
    setIsLoading(true);
    
    try {
      // Executar testes de diagnóstico
      const connectionTest = await testSupabaseConnection();
      const authTest = await testAuthSettings();
      
      setDebugInfo({
        connectionDetails: JSON.stringify(connectionTest, null, 2),
        authSettings: JSON.stringify(authTest, null, 2),
      });
      
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
                >
                  Tentar novamente
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro de autenticação</AlertTitle>
              <AlertDescription>{loginError}</AlertDescription>
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
                  'Entrar'
                )}
              </Button>
            </form>
          </Form>

          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Informações de diagnóstico</AlertTitle>
            <AlertDescription className="text-xs space-y-2">
              <p>Status da conexão: {connectionStatus.connected ? 'Conectado' : 'Desconectado'}</p>
              <p>Versão do cliente Supabase: 2.49.4</p>
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
    </div>
  );
};

export default AdminLogin;
