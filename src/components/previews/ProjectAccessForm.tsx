
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProjectAccessForm } from '@/components/previews/access/useProjectAccess';

interface ProjectAccessFormProps {
  projectId: string;
  onVerify: (code: string, email: string) => void;
}

const ProjectAccessForm: React.FC<ProjectAccessFormProps> = ({ projectId, onVerify }) => {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="preview-code">Código de Acesso</Label>
          <Input
            id="preview-code"
            placeholder="Digite o código de prévia"
            disabled={true}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={errors.code ? "border-red-500" : ""}
          />
          {errors.code && <p className="text-sm text-red-500 mt-1">{errors.code}</p>}
        </div>

        <div>
          <Label htmlFor="email">Seu Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          <p className="text-xs text-gray-500 mt-1">
            Use o mesmo email pelo qual recebeu o link de prévia
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Verificando..." : "Acessar Prévia"}
      </Button>
    </form>
  );
};

export default ProjectAccessForm;
