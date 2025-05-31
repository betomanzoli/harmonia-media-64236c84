import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client'; // ✅ IMPORT DIRETO DO SUPABASE
import { Lock, User, Music } from 'lucide-react';

const NewAdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('🔑 Direct Supabase login attempt');
      
      // Ignorar erros ethereum
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
      console.log('📡 Supabase URL:', supabase.supabaseUrl);
      
      // ✅ BYPASS AUTHCONTEXT - USAR SUPABASE DIRETO:
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username.trim(),
        password: password,
      });

      console.log('📊 Direct Supabase response:', {
        data: data,
        error: error,
        session: data?.session,
        user: data?.user,
        hasSession: !!data?.session,
        hasUser: !!data?.user
      });

      if (error) {
        console.error('❌ Direct Supabase error:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        toast({
          title: "Erro de autenticação",
          description: error.message || "Email ou senha incorretos.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      if (data.session?.user) {
        console.log('✅ Direct login successful:', {
          email: data.session.user.email,
          id: data.session.user.id,
          confirmed: data.session.user.email_confirmed_at
        });
        
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao painel administrativo.",
        });
        
        // ✅ REDIRECIONAMENTO DIRETO SEM AUTHCONTEXT:
        console.log('🚀 Redirecting to admin...');
        setTimeout(() => {
          window.location.href = '/admin/projects';
        }, 500);
        
      } else {
        console.log('❌ No session returned despite no error');
        toast({
          title: "Erro de autenticação",
          description: "Não foi possível fazer login. Tente novamente.",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('💥 Direct login error:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro durante o login.",
        variant: "destructive"
      });
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
                    type="email"
                    className="pl-9"
                    placeholder="contato@harmonia.media"
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
