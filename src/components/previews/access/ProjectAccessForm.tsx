
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useProjectAccessForm } from './useProjectAccess';

interface ProjectAccessFormProps {
  projectId: string;
  onVerify: (code: string, email: string) => void;
}

const ProjectAccessForm: React.FC<ProjectAccessFormProps> = ({ 
  projectId,
  onVerify
}) => {
  const {
    code,
    setCode,
    email,
    setEmail,
    isLoading,
    error,
    errors,
    handleSubmit
  } = useProjectAccessForm({ projectId, onVerify });
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Acesso à Prévia</CardTitle>
        <CardDescription>
          Para visualizar o seu projeto, por favor insira o código de prévia e o email fornecido pela Harmonia.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="code">Código de Prévia</Label>
            <Input
              id="code"
              placeholder="Digite o código da prévia"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && (
              <p className="text-xs text-red-500 mt-1">{errors.code}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite o seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verificando..." : "Acessar Prévia"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProjectAccessForm;
