
import { useState, useEffect } from 'react';
import { supabase, signInAnonymously, createAnonymousClient } from '@/integrations/supabase/client';
import { getProjectIdFromPreviewLink, isValidEncodedPreviewLink } from '@/utils/previewLinkUtils';
import { ProjectItem } from '@/types/project.types';
import { logger } from '@/utils/logger';
import { useProjectAccess } from '@/components/previews/access/useProjectAccess';

// Default data for fallback cases
const fallbackProject: ProjectItem = {
  id: 'fallback-project',
  client_name: 'Demo Client',
  project_title: 'Música Personalizada (Demo)',
  package_type: 'standard',
  status: 'waiting',
  created_at: new Date().toISOString(),
  last_activity_date: new Date().toISOString(),
  expiration_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  versions: 2,
  versions_list: [],
  feedback_history: [],
  history: []
};

export const usePreviewData = (previewId: string | undefined) => {
  const [projectData, setProjectData] = useState<ProjectItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);
  
  // Initialize the project access hook
  const { isAuthorized, loading: accessLoading, grantAccess } = useProjectAccess(actualProjectId);
  
  // Effect to handle preview ID decoding and project loading
  useEffect(() => {
    const loadPreviewData = async () => {
      if (!previewId) {
        setIsError(true);
        setErrorMessage('ID da prévia não fornecido.');
        setIsLoading(false);
        return;
      }

      try {
        logger.info('PREVIEW', `Loading preview data for: ${previewId}`);
        
        // Determine if this is an encoded preview link or direct ID
        const isEncoded = isValidEncodedPreviewLink(previewId);
        logger.debug('PREVIEW', `Preview ID format: ${isEncoded ? 'encoded' : 'direct'}`);
        
        // Get the actual project ID either from the encoded link or use directly
        const decodedId = isEncoded ? getProjectIdFromPreviewLink(previewId) : previewId;
        
        if (!decodedId) {
          setIsError(true);
          setErrorMessage('Link de prévia inválido.');
          setIsLoading(false);
          return;
        }
        
        setActualProjectId(decodedId);
        logger.debug('PREVIEW', `Decoded project ID: ${decodedId}`);
        
        // Try anonymous authentication for better security
        await signInAnonymously();
        
        // Create an anonymous client for fetching data
        const anonClient = createAnonymousClient();
        
        // Fetch project data from Supabase
        const { data: projectData, error: projectError } = await anonClient
          .from('projects')
          .select(`
            id, title as project_title, status, created_at, updated_at, preview_code, deadline as expiration_date,
            clients(id, name as client_name, email as client_email, phone as client_phone),
            project_files(id, project_id, file_name, file_url, file_type, created_at),
            packages(id, name as package_type, price, description, inclusions)
          `)
          .eq('id', decodedId)
          .single();
        
        if (projectError) {
          logger.error('PREVIEW', 'Error fetching project data', projectError);
          setIsError(true);
          setErrorMessage('Erro ao carregar dados do projeto.');
          setIsLoading(false);
          return;
        }
        
        if (!projectData) {
          logger.warn('PREVIEW', 'Project not found', { projectId: decodedId });
          setIsError(true);
          setErrorMessage('Projeto não encontrado.');
          setIsLoading(false);
          return;
        }
        
        // Grant access since we successfully loaded the project
        grantAccess(decodedId);
        
        // Transform project data into the expected format
        const transformedData: ProjectItem = {
          id: projectData.id,
          client_name: projectData.clients?.client_name || 'Cliente',
          client_email: projectData.clients?.client_email,
          client_phone: projectData.clients?.client_phone,
          project_title: projectData.project_title || 'Música Personalizada',
          package_type: projectData.packages?.package_type || 'standard',
          status: projectData.status || 'waiting',
          created_at: projectData.created_at,
          last_activity_date: projectData.updated_at || projectData.created_at,
          expiration_date: projectData.expiration_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          versions: projectData.project_files?.length || 0,
          versions_list: [],
          feedback_history: [],
          history: [],
          preview_code: projectData.preview_code,
          
          // Convert project files to version list items
          previews: projectData.project_files?.map(file => ({
            id: file.id,
            name: file.file_name,
            title: file.file_name,
            description: '',
            audio_url: file.file_url,
            file_url: file.file_url,
            created_at: file.created_at
          })) || []
        };
        
        logger.info('PREVIEW', 'Project data loaded successfully', { 
          id: transformedData.id,
          name: transformedData.client_name,
          files: transformedData.previews?.length
        });
        
        setProjectData(transformedData);
      } catch (error) {
        logger.error('PREVIEW', 'Unexpected error loading preview data', error);
        setIsError(true);
        setErrorMessage('Ocorreu um erro ao carregar a prévia.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPreviewData();
  }, [previewId]);
  
  // Function to update project status
  const updateProjectStatus = async (
    newStatus: 'waiting' | 'feedback' | 'approved', 
    feedbackComment?: string
  ): Promise<boolean> => {
    if (!actualProjectId) {
      logger.error('PREVIEW', 'Cannot update status: no project ID');
      return false;
    }
    
    try {
      logger.info('PREVIEW', `Updating project status to: ${newStatus}`, { projectId: actualProjectId });
      
      // Create an anonymous client for the update
      const anonClient = createAnonymousClient();
      
      // Update the project status
      const { error: updateError } = await anonClient
        .from('projects')
        .update({ status: newStatus })
        .eq('id', actualProjectId);
      
      if (updateError) {
        logger.error('PREVIEW', 'Error updating project status', updateError);
        return false;
      }
      
      // If feedback was provided, save it
      if (feedbackComment) {
        const { error: feedbackError } = await anonClient
          .from('project_history')
          .insert({
            project_id: actualProjectId,
            action: newStatus === 'approved' ? 'approval' : 'feedback',
            details: {
              message: feedbackComment,
              status: newStatus
            }
          });
        
        if (feedbackError) {
          logger.error('PREVIEW', 'Error saving feedback', feedbackError);
          // Continue anyway since the status was updated
        }
      }
      
      // Update local data
      if (projectData) {
        setProjectData({
          ...projectData,
          status: newStatus
        });
      }
      
      logger.info('PREVIEW', `Project status updated successfully to: ${newStatus}`);
      return true;
    } catch (error) {
      logger.error('PREVIEW', 'Unexpected error updating project status', error);
      return false;
    }
  };
  
  return {
    projectData: isAuthorized && projectData ? projectData : (isError ? fallbackProject : null),
    isLoading: isLoading || accessLoading,
    isError,
    errorMessage,
    actualProjectId,
    updateProjectStatus
  };
};
