
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PreviewHeader from '@/components/previews/PreviewHeader';
import PreviewInstructions from '@/components/previews/PreviewInstructions';
import PreviewPlayerList from '@/components/previews/player/PreviewPlayerList';
import PreviewFeedbackForm from '@/components/previews/PreviewFeedbackForm';
import PreviewNextSteps from '@/components/previews/PreviewNextSteps';
import { ProjectItem } from '@/types/project.types';

interface PreviewContentProps {
  projectData: ProjectItem;
  selectedPreview: string | null;
  setSelectedPreview: (id: string) => void;
  feedback: string;
  setFeedback: (feedback: string) => void;
  handleSubmitFeedback: () => void;
  handleApprove: () => void;
  versionsForPlayer: any[];
}

const PreviewContent: React.FC<PreviewContentProps> = ({
  projectData,
  selectedPreview,
  setSelectedPreview,
  feedback,
  setFeedback,
  handleSubmitFeedback,
  handleApprove,
  versionsForPlayer
}) => {
  const status = projectData?.status === 'waiting' || 
                 projectData?.status === 'feedback' || 
                 projectData?.status === 'approved' 
    ? projectData.status 
    : 'waiting';

  return (
    <>
      <PreviewHeader 
        projectTitle=""
        clientName=""
        packageType="Música Personalizada"
        status="waiting"
        createdAt={new Date().toISOString()}
        projectData={{
          projectTitle: projectData?.project_title || projectData?.package_type || '',
          clientName: projectData?.client_name || '',
          status: status
        }}
      />
      
      <PreviewInstructions status={status} />
      
      <Tabs defaultValue="versions" className="mb-10">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="versions" className="flex-1 data-[state=active]:bg-harmonia-green">
            Versões Propostas
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex-1 data-[state=active]:bg-harmonia-green">
            Enviar Feedback
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="versions">
          <PreviewPlayerList 
            versions={versionsForPlayer.map(preview => ({
              ...preview,
              description: preview.description || `Versão musical para ${projectData?.client_name || 'Cliente'}`
            }))}
            selectedVersion={selectedPreview}
            setSelectedVersion={setSelectedPreview}
            isApproved={projectData?.status === 'approved'}
          />
        </TabsContent>
        
        <TabsContent value="feedback">
          <PreviewFeedbackForm 
            selectedPreview={selectedPreview}
            feedback={feedback}
            setFeedback={setFeedback}
            handleSubmit={handleSubmitFeedback}
            handleApprove={handleApprove}
            status={status}
            versionTitle={versionsForPlayer.find(p => p.id === selectedPreview)?.name}
          />
        </TabsContent>
      </Tabs>
      
      <PreviewNextSteps status={status} />
    </>
  );
};

export default PreviewContent;
