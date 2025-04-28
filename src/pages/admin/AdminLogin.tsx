
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, User } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulação de autenticação (em um ambiente real, seria substituído por uma API real)
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao painel administrativo.",
        });
        navigate('/admin-j28s7d1k/dashboard');
      } else {
        toast({
          title: "Erro de autenticação",
          description: "Usuário ou senha incorretos.",
          variant: "destructive"
        });
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Acesso Administrativo</CardTitle>
            <Lock className="h-6 w-6 text-gray-500" />
          </div>
          <CardDescription>
            Insira suas credenciais para acessar o painel administrativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Usuário</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    className="pl-9"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link 
                    to="/admin-j28s7d1k/reset-password" 
                    className="text-xs text-gray-500 hover:text-gray-900"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
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
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <p className="text-sm text-gray-500 mt-2">
            Use <strong>admin</strong> para usuário e senha durante o desenvolvimento
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
