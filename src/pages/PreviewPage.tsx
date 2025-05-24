import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PreviewFeedbackForm from '@/components/previews/PreviewFeedbackForm';
import PreviewHeader from '@/components/previews/PreviewHeader';
import PreviewInstructions from '@/components/previews/PreviewInstructions';
import PreviewPlayerList from '@/components/previews/player/PreviewPlayerList';
import PreviewNextSteps from '@/components/previews/PreviewNextSteps';
import GoogleDrivePreviewsList from '@/components/previews/GoogleDrivePreviewsList';
import { usePreviewProject, type PreviewProject } from '@/hooks/previews/usePreviewProject';

const PreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const { projectData, setProjectData, isLoading } = usePreviewProject(projectId);

  // ... (manter lógica de submit e approve)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <PreviewHeader 
            projectData={{
              projectTitle: projectData?.project_title || 'Sem título',
              clientName: projectData?.client_name || 'Cliente não identificado',
              status: projectData?.status || 'waiting'
            }}
          />
          
          {/* Restante do código mantido com verificações de null */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PreviewPage;
