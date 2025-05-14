
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useCreateBriefingForm, BriefingFormValues } from '@/hooks/useCreateBriefingForm';
import ClientInfoSection from './FormSections/ClientInfoSection';
import PackageInfoSection from './FormSections/PackageInfoSection';
import FormFooter from './FormSections/FormFooter';

interface CreateBriefingFormProps {
  onClose: () => void;
  onSubmit: (data: BriefingFormValues) => void;
}

const CreateBriefingForm: React.FC<CreateBriefingFormProps> = ({ onClose, onSubmit }) => {
  const { form, isSubmitting, handleSubmit } = useCreateBriefingForm({ onSubmit });

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Criar Novo Briefing</DialogTitle>
        <DialogDescription>
          Preencha os detalhes abaixo para adicionar um novo briefing.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <ClientInfoSection form={form} />
          <PackageInfoSection form={form} />
          <FormFooter isSubmitting={isSubmitting} onClose={onClose} />
        </form>
      </Form>
    </div>
  );
};

export default CreateBriefingForm;
