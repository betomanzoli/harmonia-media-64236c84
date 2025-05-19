
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const AuthPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is just a placeholder for authentication logic
    // In a real implementation, you would validate against actual credentials
    navigate(`/preview/${projectId}`);
  };
  
  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Acesso ao Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-center text-gray-600">
            Por favor, insira a senha fornecida para acessar a prévia do projeto.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Senha do projeto"
              required
            />
            <Button type="submit" className="w-full">
              Acessar Prévia
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
