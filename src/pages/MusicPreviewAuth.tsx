import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { setPreviewAccessCookie, setPreviewEmailCookie } from '@/utils/authCookies';

const MusicPreviewAuth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const previewCode = searchParams.get('preview');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!previewCode) {
      alert('Código de prévia inválido.');
      return;
    }

    setIsLoading(true);
    try {
      // Validate email against Supabase
      const { data: users, error } = await supabase
        .from('clients')
        .select('*')
        .eq('email', email);

      if (error) {
        console.error('Erro ao validar email:', error);
        alert('Ocorreu um erro ao validar o email.');
        return;
      }

      if (!users || users.length === 0) {
        alert('Email não encontrado. Por favor, insira um email válido.');
        return;
      }

      // Store email in local storage and cookies
      localStorage.setItem('userEmail', email);
      setPreviewAccessCookie(previewCode);
      setPreviewEmailCookie(previewCode, email);

      // Redirect to the preview page
      navigate(`/preview/${previewCode}`);
    } catch (err) {
      console.error("Erro during authentication:", err);
      alert('Ocorreu um erro durante a autenticação.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <Card className="divide-y divide-gray-200">
          <CardHeader className="px-5 py-4">
            <CardTitle className="text-center text-xl">
              <Music className="inline-block h-6 w-6 mr-2 align-middle" />
              Acesso à Prévia Musical
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4 px-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Seu Email:
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="seuemail@cliente.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <Button
                  type="submit"
                  className="w-full flex justify-center items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Lock className="mr-2 h-4 w-4 animate-pulse" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Acessar Prévia
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MusicPreviewAuth;
