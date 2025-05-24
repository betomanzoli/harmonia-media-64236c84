
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Music, Mail, Lock, Shield } from 'lucide-react';

interface PreviewAuthFormProps {
  projectId: string;
  onAuthenticate: (email: string) => Promise<boolean>;
  isPrivateMode: boolean;
}

const PreviewAuthForm: React.FC<PreviewAuthFormProps> = ({
  projectId,
  onAuthenticate,
  isPrivateMode
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Por favor, digite seu email');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Por favor, digite um email válido');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await onAuthenticate(email);
      if (!success) {
        setError('Erro ao autenticar. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md px-4">
      <div className="text-center mb-8">
        <Music className="h-16 w-16 text-harmonia-green mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Acesso à Prévia Musical
        </h1>
        <p className="text-gray-600">
          Digite seu email para acessar a prévia do projeto
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Autenticação
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPrivateMode && (
            <Alert className="mb-4 border-amber-200 bg-amber-50">
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-amber-800">
                Navegação privada detectada. Usando autenticação local segura.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Autenticando...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Acessar Prévia
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Sua prévia expira em 14 dias
            </p>
            <p className="text-xs text-gray-400 mt-2">
              ID do Projeto: {projectId}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreviewAuthForm;
