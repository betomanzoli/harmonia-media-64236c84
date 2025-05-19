
import { supabase } from '@/lib/supabase';

// Utility function to seed Supabase with projects from localStorage
export const seedSupabaseWithProjects = async () => {
  try {
    console.log('Starting to seed Supabase with projects from localStorage');
    
    // Get projects from localStorage
    const storedProjects = localStorage.getItem('harmonIA_preview_projects');
    
    if (!storedProjects) {
      console.log('No projects found in localStorage to seed');
      return false;
    }
    
    const localProjects = JSON.parse(storedProjects);
    console.log(`Found ${localProjects.length} projects in localStorage`);
    
    let successCount = 0;
    
    // Seed each project to Supabase
    for (const project of localProjects) {
      console.log(`Seeding project ${project.id} to Supabase`);
      
      try {
        // Check if project already exists
        const { data: existingProject, error: checkError } = await supabase
          .from('preview_projects')
          .select('id')
          .eq('id', project.id)
          .maybeSingle();
          
        if (checkError) {
          console.error(`Error checking if project ${project.id} exists:`, checkError);
          continue;
        }
        
        if (existingProject) {
          console.log(`Project ${project.id} already exists in Supabase, updating`);
          
          // Update existing project
          const { error: updateError } = await supabase
            .from('preview_projects')
            .update({
              client_name: project.clientName || 'Cliente',
              client_email: project.clientEmail || '',
              project_title: project.title || project.packageType || 'Música Personalizada',
              package_type: project.packageType || 'Música Personalizada',
              status: project.status || 'waiting',
              feedback: project.feedback,
              expiration_date: project.expirationDate ? new Date(project.expirationDate) : null,
              last_activity_date: project.lastActivityDate ? new Date(project.lastActivityDate) : new Date()
            })
            .eq('id', project.id);
            
          if (updateError) {
            console.error(`Error updating project ${project.id}:`, updateError);
          } else {
            successCount++;
          }
        } else {
          console.log(`Project ${project.id} does not exist in Supabase, creating`);
          
          // Create new project
          const { error: insertError } = await supabase
            .from('preview_projects')
            .insert({
              id: project.id,
              client_name: project.clientName || 'Cliente',
              client_email: project.clientEmail || '',
              project_title: project.title || project.packageType || 'Música Personalizada',
              package_type: project.packageType || 'Música Personalizada',
              status: project.status || 'waiting',
              feedback: project.feedback,
              expiration_date: project.expirationDate ? new Date(project.expirationDate) : null,
              last_activity_date: project.lastActivityDate ? new Date(project.lastActivityDate) : new Date()
            });
            
          if (insertError) {
            console.error(`Error creating project ${project.id}:`, insertError);
            continue;
          } else {
            successCount++;
          }
        }
        
        // Seed versions for this project
        if (project.versionsList && project.versionsList.length > 0) {
          console.log(`Seeding ${project.versionsList.length} versions for project ${project.id}`);
          
          for (const version of project.versionsList) {
            try {
              // Check if version already exists
              const { data: existingVersion, error: versionCheckError } = await supabase
                .from('project_versions')
                .select('*')
                .eq('project_id', project.id)
                .eq('version_id', version.id)
                .maybeSingle();
                
              if (versionCheckError) {
                console.error(`Error checking if version ${version.id} exists:`, versionCheckError);
                continue;
              }
              
              if (existingVersion) {
                console.log(`Version ${version.id} already exists for project ${project.id}, updating`);
                
                // Update existing version
                const { error: versionUpdateError } = await supabase
                  .from('project_versions')
                  .update({
                    name: version.name,
                    description: version.description || '',
                    file_id: version.fileId,
                    audio_url: version.audioUrl,
                    recommended: version.recommended || false
                  })
                  .eq('project_id', project.id)
                  .eq('version_id', version.id);
                  
                if (versionUpdateError) {
                  console.error(`Error updating version ${version.id}:`, versionUpdateError);
                }
              } else {
                console.log(`Version ${version.id} does not exist for project ${project.id}, creating`);
                
                // Create new version
                const { error: versionInsertError } = await supabase
                  .from('project_versions')
                  .insert({
                    project_id: project.id,
                    version_id: version.id,
                    name: version.name,
                    description: version.description || '',
                    file_id: version.fileId,
                    audio_url: version.audioUrl,
                    recommended: version.recommended || false
                  });
                  
                if (versionInsertError) {
                  console.error(`Error creating version ${version.id}:`, versionInsertError);
                }
              }
            } catch (versionError) {
              console.error(`Error processing version ${version.id}:`, versionError);
            }
          }
        } else {
          console.log(`No versions found for project ${project.id}`);
        }
      } catch (projectError) {
        console.error(`Error processing project ${project.id}:`, projectError);
      }
    }
    
    console.log(`Finished seeding Supabase with projects from localStorage. Successfully processed ${successCount}/${localProjects.length} projects`);
    return successCount > 0;
  } catch (error) {
    console.error('Error seeding Supabase with projects:', error);
    return false;
  }
};

// Function to run seed on application load
export const initializeSupabaseProjects = async () => {
  try {
    console.log('Initializing Supabase projects');
    
    // Always run the seed to ensure data is synced between localStorage and Supabase
    const success = await seedSupabaseWithProjects();
    
    // Check if we've already run the seed
    const hasRun = localStorage.getItem('supabase_projects_seeded');
    
    if (!hasRun) {
      if (success) {
        localStorage.setItem('supabase_projects_seeded', 'true');
        console.log('Successfully seeded Supabase with projects, marked as done');
      } else {
        console.log('No projects were seeded or there was an error, will try again next time');
      }
    } else {
      console.log('Supabase projects already marked as seeded, performed sync operation only');
    }
  } catch (error) {
    console.error('Error initializing Supabase projects:', error);
  }
};
