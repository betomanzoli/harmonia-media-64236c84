
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import FormHeader from './access/FormHeader';
import FormInputs from './access/FormInputs';
import ErrorAlert from './access/ErrorAlert';
import SubmitButton from './access/SubmitButton';
import ContactInfo from './access/ContactInfo';
import { useProjectAccess } from './access/useProjectAccess';

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
    handleSubmit
  } = useProjectAccess({ projectId, onVerify });

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <Card className="bg-white shadow-lg border-0">
        <FormHeader />
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorAlert error={error} />
            
            <FormInputs 
              code={code}
              setCode={setCode}
              email={email}
              setEmail={setEmail}
            />
          </form>
        </CardContent>
        
        <CardFooter>
          <SubmitButton isLoading={isLoading} onClick={handleSubmit} />
        </CardFooter>
      </Card>
      
      <ContactInfo />
    </div>
  );
};

export default ProjectAccessForm;
