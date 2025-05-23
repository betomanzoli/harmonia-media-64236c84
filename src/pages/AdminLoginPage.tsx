
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError("Credenciais inválidas. Por favor, tente novamente.");
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: "Verifique suas credenciais e tente novamente."
        });
        return;
      }

      if (data.user) {
        // Check if user has admin role
        const { data: userRoleData, error: userRoleError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (userRoleError || !userRoleData) {
          setError("Acesso não autorizado. Esta conta não tem permissões administrativas.");
          await supabase.auth.signOut();
          return;
        }

        toast({
          title: "Login efetuado com sucesso",
          description: "Redirecionando para o painel administrativo..."
        });

        navigate('/admin-j28s7d1k');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Erro ao processar login. Tente novamente mais tarde.");
      toast({
        variant: "destructive",
        title: "Erro no sistema",
        description: "Não foi possível processar seu login."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-6 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Acesso Administrativo</h1>
          <p className="text-gray-600 mt-2">Faça login para acessar o painel de administração</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-900 p-3 rounded-md mb-4 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@exemplo.com"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Senha</Label>
                <a href="#" className="text-xs text-harmonia-green hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <Input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-harmonia-green hover:bg-harmonia-green/90" 
              disabled={loading}
            >
              {loading ? "Autenticando..." : "Entrar"}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Esta área é restrita aos administradores do sistema.</p>
        </div>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
