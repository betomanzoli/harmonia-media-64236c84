
import React from 'react';
import AddVersionForm from '../AddVersionForm';
import { VersionItem } from '@/types/preview.types';

interface SingleVersionTabProps {
  projectId: string;
  onAddVersion: (version: VersionItem) => void;
  onCancel: () => void;
  isFinalVersion: boolean;
  packageType?: string;
}

const SingleVersionTab: React.FC<SingleVersionTabProps> = ({
  projectId,
  onAddVersion,
  onCancel,
  isFinalVersion,
  packageType
}) => {
  return (
    <AddVersionForm 
      projectId={projectId} 
      onAddVersion={onAddVersion} 
      onCancel={onCancel} 
      isFinalVersion={isFinalVersion}
      packageType={packageType}
    />
  );
};

export default SingleVersionTab;
