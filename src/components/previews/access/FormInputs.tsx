
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Key, Mail } from 'lucide-react';

interface FormInputsProps {
  code: string;
  setCode: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  errors: {
    code?: string;
    email?: string;
  };
}

const FormInputs: React.FC<FormInputsProps> = ({ 
  code, 
  setCode, 
  email, 
  setEmail,
  errors 
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="projectCode">Código do Projeto</Label>
        <div className="relative">
          <Key className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            id="projectCode"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`pl-10 ${errors.code ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            placeholder="Informe o código do projeto"
            required
            aria-invalid={!!errors.code}
            aria-describedby={errors.code ? "code-error" : undefined}
          />
        </div>
        {errors.code && (
          <p id="code-error" className="text-sm text-red-500 mt-1">{errors.code}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`pl-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            placeholder="Informe seu email"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </div>
        {errors.email && (
          <p id="email-error" className="text-sm text-red-500 mt-1">{errors.email}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          O mesmo email usado no momento da contratação
        </p>
      </div>
    </>
  );
};

export default FormInputs;
