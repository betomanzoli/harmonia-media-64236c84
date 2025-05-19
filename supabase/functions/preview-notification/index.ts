
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PreviewNotificationRequest {
  projectId: string;
  clientName: string;
  clientEmail: string;
  projectTitle: string;
  versions: Array<{id: string, name: string, audioUrl: string}>;
  baseUrl?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const requestData: PreviewNotificationRequest = await req.json();
    const { projectId, clientName, clientEmail, projectTitle, versions, baseUrl } = requestData;
    
    if (!projectId || !clientEmail || !versions || versions.length === 0) {
      throw new Error("Missing required fields: projectId, clientEmail, and versions are required");
    }
    
    console.log(`Processing preview notification for project ${projectId} to ${clientEmail}`);
    
    // Generate a unique token for secure access
    const timestamp = new Date().getTime().toString();
    const tokenData = `${projectId}:${timestamp}`;
    const magicToken = btoa(tokenData); // Base64 encode the token
    
    // Calculate expiration (7 days from now)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    
    // Save access code to database
    const { data: codeData, error: codeError } = await supabase
      .from('preview_codes')
      .insert({
        project_id: projectId,
        code: magicToken,
        expires_at: expirationDate.toISOString(),
        is_active: true
      })
      .select()
      .single();
      
    if (codeError) {
      console.error("Error saving preview code:", codeError);
      throw codeError;
    }
    
    // Ensure preview project exists
    const { data: existingProject, error: projectCheckError } = await supabase
      .from('preview_projects')
      .select('*')
      .eq('id', projectId)
      .maybeSingle();
      
    if (projectCheckError) {
      console.error("Error checking project:", projectCheckError);
    }
    
    if (!existingProject) {
      // Create preview project if it doesn't exist
      const { error: createError } = await supabase
        .from('preview_projects')
        .insert({
          id: projectId,
          client_name: clientName,
          project_title: projectTitle,
          status: 'pending',
          expiration_date: expirationDate.toISOString()
        });
        
      if (createError) {
        console.error("Error creating preview project:", createError);
        throw createError;
      }
    }
    
    // Generate preview URL
    const appBaseUrl = baseUrl || 'https://harmonia.media';
    const previewUrl = `${appBaseUrl}/preview/${projectId}?token=${magicToken}`;
    
    // Add versions if they don't exist
    for (const version of versions) {
      const { data: existingVersion, error: versionCheckError } = await supabase
        .from('project_versions')
        .select('*')
        .eq('project_id', projectId)
        .eq('version_id', version.id)
        .maybeSingle();
        
      if (versionCheckError) {
        console.error("Error checking version:", versionCheckError);
        continue;
      }
      
      if (!existingVersion) {
        const { error: versionError } = await supabase
          .from('project_versions')
          .insert({
            project_id: projectId,
            version_id: version.id,
            name: version.name,
            audio_url: version.audioUrl
          });
          
        if (versionError) {
          console.error("Error adding version:", versionError);
        }
      }
    }
    
    // Log access attempt
    const { error: logError } = await supabase
      .from('access_logs')
      .insert({
        preview_id: projectId,
        access_method: 'notification_sent',
        user_email: clientEmail
      });
      
    if (logError) {
      console.error("Error logging access:", logError);
      // Continue even if logging fails
    }
    
    // In a production system, this would send an actual email
    // For this example, we're simply returning the preview URL
    console.log(`Preview URL generated: ${previewUrl}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email notification would be sent to ${clientEmail}`,
        previewUrl,
        token: magicToken,
        expirationDate: expirationDate.toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in preview-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message || String(error) }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
