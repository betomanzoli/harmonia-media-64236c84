
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MusicPreviewSystem from '@/components/previews/MusicPreviewSystem';
import ProjectAccessForm from '@/components/previews/ProjectAccessForm';
import { useToast } from '@/hooks/use-toast';
import { getProjectIdFromPreviewLink } from '@/utils/previewLinkUtils';

const PreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isError, setIsError] = useState(false);
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);

  useEffect(() => {
    // Log access for analytics
    if (projectId) {
      console.log(`Preview access: ${projectId}, Date: ${new Date().toISOString()}`);
      window.scrollTo(0, 0);
      
      // First try to decode the ID in case it's an encoded preview link
      const decodedId = getProjectIdFromPreviewLink(projectId);
      
      if (decodedId) {
        // If this is an encoded link, we consider it pre-authorized
        console.log("Encoded link detected, Project ID:", decodedId);
        setActualProjectId(decodedId);
        setIsAuthorized(true);
        setIsError(false);
        return;
      }
      
      // For backward compatibility, also support direct project IDs
      // Check if the project exists in localStorage
      try {
        const storedProjects = localStorage.getItem('harmonIA_preview_projects');
        if (storedProjects) {
          const projects = JSON.parse(storedProjects);
          const projectExists = projects.some((p: any) => p.id === projectId);
          
          if (projectExists) {
            console.log("Direct project ID found:", projectId);
            setActualProjectId(projectId);
            
            // Check if admin access or previously authorized
            const isAdmin = localStorage.getItem('admin_preview_access') === 'true';
            const isPreviouslyAuthorized = localStorage.getItem(`preview_auth_${projectId}`) === 'authorized';
            
            if (isAdmin || isPreviouslyAuthorized) {
              setIsAuthorized(true);
              setIsError(false);
            }
            return;
          }
        }
        
        // No valid project mapping found
        console.log("Invalid project ID:", projectId);
        setIsError(true);
        toast({
          title: "Invalid link",
          description: "The preview link you are trying to access is not valid.",
          variant: "destructive"
        });
      } catch (error) {
        console.error("Error verifying project:", error);
        setIsError(true);
      }
    }
  }, [projectId, toast]);

  const handleAccessVerification = (code: string, email: string) => {
    // In a real application, this would validate against your database
    // to check if the provided email matches the project's client email
    
    // Simulate a database check
    const verifyAccess = () => {
      // This would be an API call in a real app
      try {
        const storedProjects = localStorage.getItem('harmonIA_preview_projects');
        if (storedProjects) {
          const projects = JSON.parse(storedProjects);
          const project = projects.find((p: any) => p.id === projectId);
          
          if (project) {
            // Match by email or code
            return (email.toLowerCase() === project.clientEmail?.toLowerCase()) || 
                   (code === projectId);
          }
        }
        
        // Fallback for demo
        return email.includes('@') && (
          (projectId && code === projectId) || 
          email.toLowerCase().includes('test') || 
          email.toLowerCase().includes('demo')
        );
      } catch (error) {
        console.error("Error in access verification:", error);
        return false;
      }
    };
    
    if (verifyAccess()) {
      localStorage.setItem(`preview_auth_${projectId}`, 'authorized');
      setIsAuthorized(true);
      setIsError(false);
      toast({
        title: "Access authorized",
        description: "Welcome to the preview page of your project.",
      });
    } else {
      setIsError(true);
      toast({
        title: "Authentication failed",
        description: "The credentials provided do not match this project's records. Please verify the code and email.",
        variant: "destructive"
      });
    }
  };

  if (!projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Project ID not found</h2>
          <p className="text-gray-600">The link you accessed is not valid.</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Invalid preview link</h2>
          <p className="text-gray-600">The link you accessed does not exist or has expired.</p>
        </div>
      </div>
    );
  }

  // Show authentication form if not authorized yet and not using an encoded link
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <ProjectAccessForm 
          projectId={projectId} 
          onVerify={handleAccessVerification} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-8 pb-16">
      <MusicPreviewSystem projectId={actualProjectId || projectId} />
    </div>
  );
};

export default PreviewPage;
