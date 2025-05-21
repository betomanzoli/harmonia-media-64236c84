
import React, { useState } from 'react';
import { VersionItem } from '@/types/preview.types';
import { useToast } from '@/hooks/use-toast';
import FormHeader from '../VersionForm/FormHeader';
import AudioUrlInput from '../VersionForm/AudioUrlInput';
import AdditionalLinks from '../VersionForm/AdditionalLinks';
import RecommendedSwitch from '../VersionForm/RecommendedSwitch';
import FormFooter from '../VersionForm/FormFooter';
import { useAddVersionForm } from './useAddVersionForm';

interface AddVersionFormProps {
  projectId: string;
  onAddVersion: (version: VersionItem) => void;
  onCancel: () => void;
  isFinalVersion?: boolean;
  packageType?: string;
}

const AddVersionForm: React.FC<AddVersionFormProps> = ({ 
  projectId, 
  onAddVersion, 
  onCancel,
  isFinalVersion = false,
  packageType
}) => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    audioUrl,
    setAudioUrl,
    recommended,
    setRecommended,
    additionalLinks,
    isLoading,
    handleAddLink,
    handleRemoveLink,
    updateLinkLabel,
    updateLinkUrl,
    handleSubmit
  } = useAddVersionForm(projectId, onAddVersion, isFinalVersion);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormHeader 
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        isFinalVersion={isFinalVersion}
      />
      
      <AudioUrlInput 
        audioUrl={audioUrl}
        setAudioUrl={setAudioUrl}
      />
      
      {isFinalVersion && (
        <AdditionalLinks 
          links={additionalLinks}
          onAddLink={handleAddLink}
          onRemoveLink={handleRemoveLink}
          onUpdateLinkLabel={updateLinkLabel}
          onUpdateLinkUrl={updateLinkUrl}
        />
      )}

      {!isFinalVersion && (
        <RecommendedSwitch 
          recommended={recommended}
          setRecommended={setRecommended}
        />
      )}
      
      <FormFooter 
        isLoading={isLoading}
        onCancel={onCancel}
      />
    </form>
  );
};

export default AddVersionForm;
