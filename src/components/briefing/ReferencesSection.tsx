
import React from 'react';
import { useFormContext } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl 
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from './FileUploader';
import { BriefingFormValues } from './formSchema';

interface ReferencesSectionProps {
  referenceFiles: File[];
  setReferenceFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const ReferencesSection: React.FC<ReferencesSectionProps> = ({ 
  referenceFiles, 
  setReferenceFiles 
}) => {
  const form = useFormContext<BriefingFormValues>();

  return (
    <div className="space-y-4 border border-border p-4 rounded-md">
      <FormField
        control={form.control}
        name="referenceDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Referências (opcional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Explique por que as referências são importantes para a composição da sua música e como elas se relacionam com o resultado que você espera." 
                className="min-h-[80px]" 
                {...field} 
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FileUploader 
        referenceFiles={referenceFiles} 
        setReferenceFiles={setReferenceFiles} 
      />
    </div>
  );
};

export default ReferencesSection;
