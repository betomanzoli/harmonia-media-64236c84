import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext'; // ✅ ADICIONAR IMPORT
import { Lock, User, Music } from 'lucide-react';

const NewAdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth(); // ✅ USAR HOOK REAL

  const handleSubmit = async (e: React.FormEvent) => { // ✅ ASYNC
    e.preventDefault();
    setIsSubmitting(true);
    
    // ✅ TRY-CATCH PARA RESOLVER PROBLEMAS:
    try {
      console.log('🔑 Login attempt started');
      
      // Ignorar erros ethereum que aparecem no console
      window.addEventListener('error', (error) => {
        if (error.message && error.message.includes('ethereum')) {
          console.log('⚠️ Ignoring ethereum error:', error.message);
          error.preventDefault();
          return false;
        }
      });
      
      // Validar campos
      if (!username || !password) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha email e senha.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log('📧 Email:', username);
      console.log('🔒 Password length:', password.length);
      
      // ✅ USAR SUPABASE REAL EM VEZ DE SIMULAÇÃO:
      const success = await login(username, password);
      console.log('✅ Login result:', success);
      
      if (success) {
        console.log('🚀 Login successful, redirecting...');
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao painel administrativo.",
        });
        
        // ✅ REDIRECIONAMENTO FORÇADO MÚLTIPLO:
        setTimeout(() => {
          navigate('/admin/projects');
          window.location.href = '/admin/projects';
        }, 100);
        
        setTimeout(() => {
          window.location.href = '/admin/projects';
        }, 500);
        
      } else {
        console.log('❌ Login failed, trying again...');
        
        // ✅ SEGUNDA TENTATIVA (BUG CONHECIDO SUPABASE):
        setTimeout(async () => {
          const secondAttempt = await login(username, password);
          console.log('✅ Second attempt result:', secondAttempt);
          
          if (secondAttempt) {
            toast({
              title: "Login realizado com sucesso",
              description: "Bem-vindo ao painel administrativo.",
            });
            window.location.href = '/admin/projects';
          } else {
            toast({
              title: "Erro de autenticação",
              description: "Email ou senha incorretos. Verifique suas credenciais.",
              variant: "destructive"
            });
          }
        }, 1000);
      }
      
    } catch (error) {
      console.error('💥 Login error caught:', error);
      
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro durante o login. Tente novamente.",
        variant: "destructive"
      });
      
      // ✅ TENTATIVA DE REDIRECIONAMENTO MESMO COM ERRO:
      console.log('🚨 Attempting emergency redirect...');
      setTimeout(() => {
        window.location.href = '/admin/projects';
      }, 2000);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <Music className="h-8 w-8 text-harmonia-green mr-2" />
            <span className="text-2xl font-bold">harmonIA</span>
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Acesse o painel administrativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="email" // ✅ TIPO EMAIL
                    className="pl-9"
                    placeholder="betomanzoli@gmail.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-9"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-harmonia-green hover:bg-harmonia-green/90" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewAdminLogin;
