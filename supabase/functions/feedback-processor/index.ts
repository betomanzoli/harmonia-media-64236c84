
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FeedbackRequest {
  projectId: string;
  clientName?: string;
  clientEmail?: string;
  feedback: string;
  status: 'approved' | 'revision' | 'feedback';
  token?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const requestData: FeedbackRequest = await req.json();
    const { projectId, clientName, clientEmail, feedback, status, token } = requestData;
    
    if (!projectId || !feedback) {
      throw new Error("Missing required fields: projectId and feedback are required");
    }
    
    console.log(`Processing feedback for project ${projectId}, status: ${status}`);
    
    // Verify access if token is provided
    if (token) {
      const { data: codeData, error: codeError } = await supabase
        .from('preview_codes')
        .select('*')
        .eq('code', token)
        .eq('project_id', projectId)
        .eq('is_active', true)
        .single();
        
      if (codeError || !codeData) {
        console.error("Invalid access token:", codeError);
        return new Response(
          JSON.stringify({ error: "Invalid or expired access token" }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }
      
      // Check if token has expired
      if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
        console.error("Expired access token");
        return new Response(
          JSON.stringify({ error: "Access token has expired" }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }
    }
    
    // Update preview project with feedback
    const { data: projectData, error: projectError } = await supabase
      .from('preview_projects')
      .update({
        feedback,
        status: status === 'approved' ? 'approved' : 'feedback',
        last_activity_date: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single();
      
    if (projectError) {
      console.error("Error updating preview project:", projectError);
      throw projectError;
    }
    
    // Log the feedback in project history
    const { error: historyError } = await supabase
      .from('project_history')
      .insert({
        project_id: projectId,
        action: status === 'approved' ? 'preview_approved' : 'feedback_received',
        details: {
          feedback,
          status,
          timestamp: new Date().toISOString(),
          clientName,
          clientEmail
        }
      });
      
    if (historyError) {
      console.error("Error logging to project history:", historyError);
      // Continue even if history logging fails
    }
    
    // Log access for tracking
    const { error: logError } = await supabase
      .from('access_logs')
      .insert({
        preview_id: projectId,
        access_method: 'feedback_submission',
        user_email: clientEmail || 'unknown'
      });
      
    if (logError) {
      console.error("Error logging access:", logError);
      // Continue even if logging fails
    }
    
    // If approved, we might want to trigger other workflows
    if (status === 'approved') {
      // In a real implementation, this would trigger other workflows
      console.log(`Project ${projectId} approved by client!`);
      
      // Update project status if linked to a project
      if (projectData) {
        const { error: updateProjectError } = await supabase
          .from('projects')
          .update({
            status: 'approved'
          })
          .eq('id', projectId);
          
        if (updateProjectError) {
          console.error("Error updating project status:", updateProjectError);
          // Continue even if project update fails
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Feedback processed successfully",
        status: status
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in feedback-processor function:", error);
    return new Response(
      JSON.stringify({ error: error.message || String(error) }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
