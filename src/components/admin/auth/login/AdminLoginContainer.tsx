
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Info } from 'lucide-react';
import Logo from '@/components/Logo';
import { useAdminLoginForm } from '@/hooks/admin/useAdminLoginForm';

const AdminLoginContainer: React.FC = () => {
  const navigate = useNavigate();
  const { formState, formHandlers } = useAdminLoginForm();
  
  const { 
    email, password, loading, success, error, 
    showPasswordReset, resetEmail, resetLoading, resetSuccess, resetError 
  } = formState;
  
  const {
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    handleResetEmailChange,
    handleResetPassword,
    openResetDialog,
    closeResetDialog
  } = formHandlers;
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-[380px] shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <CardTitle className="text-2xl">
            {showPasswordReset ? 'Redefinir Senha' : 'Admin Login'}
          </CardTitle>
          <CardDescription>
            {showPasswordReset 
              ? 'Insira seu email para receber instruções de redefinição de senha' 
              : 'Acesse o painel administrativo da harmonIA'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
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
          
          {resetError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{resetError}</AlertDescription>
            </Alert>
          )}
          
          {showPasswordReset ? (
            <form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    required
                    type="email"
                    placeholder="seu@email.com"
                    value={resetEmail}
                    onChange={handleResetEmailChange}
                    disabled={resetLoading}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
                  disabled={resetLoading}
                >
                  {resetLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Link de Recuperação'
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    required
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={handleEmailChange}
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Senha</label>
                  </div>
                  <Input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={loading}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            variant="link" 
            className="text-sm text-slate-500 hover:text-slate-900 px-0"
            onClick={showPasswordReset ? closeResetDialog : openResetDialog}
            disabled={loading || resetLoading}
          >
            {showPasswordReset ? 'Voltar para o login' : 'Esqueceu sua senha?'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLoginContainer;
