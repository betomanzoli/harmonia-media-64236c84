import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Shield } from 'lucide-react';

interface LoginFormProps {
  email: string;
  password: string;
  loading: boolean;
  success: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onResetPasswordClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  email,
  password,
  loading,
  success,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onResetPasswordClick
}) => {
  
  // ✅ WRAPPER COM TRY-CATCH:
  const handleSubmitWithErrorHandling = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      console.log('🔑 LoginForm submit started');
      
      // Ignorar erros ethereum
      window.addEventListener('error', (error) => {
        if (error.message && error.message.includes('ethereum')) {
          console.log('⚠️ Ignoring ethereum error in LoginForm');
          error.preventDefault();
          return false;
        }
      });
      
      await onSubmit(e);
      
    } catch (error) {
      console.error('💥 LoginForm error caught:', error);
      
      // Tentar redirecionamento mesmo com erro
      setTimeout(() => {
        window.location.href = '/admin/projects';
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmitWithErrorHandling} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Email</label>
        <Input
          type="email"
          name="email"
          value={email}
          onChange={onEmailChange}
          placeholder="betomanzoli@gmail.com"
          required
          disabled={loading || success}
          autoComplete="email"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Senha</label>
        <Input
          type="password"
          name="password"
          value={password}
          onChange={onPasswordChange}
          placeholder="********"
          required
          disabled={loading || success}
          autoComplete="current-password"
        />
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={loading || success}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : success ? (
          "Conectado com sucesso!"
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
        onClick={onResetPasswordClick}
        disabled={loading || success}
      >
        Esqueceu sua senha?
      </Button>
    </form>
  );
};

export default LoginForm;
