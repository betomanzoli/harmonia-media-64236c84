
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FeedbackSubmissionRequest {
  preview_id: string;
  feedback: string;
  status: 'approved' | 'feedback';
  token?: string;
  selected_version?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get feedback data from request
    const { preview_id, feedback, status, token, selected_version }: FeedbackSubmissionRequest = await req.json();

    // Validate inputs
    if (!preview_id || !status) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required fields" 
        }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          } 
        }
      );
    }

    console.log(`Processing feedback for preview: ${preview_id}, status: ${status}`);
    
    // Check access permissions - either via token or session
    let accessGranted = false;
    let projectData = null;

    // First try token if provided
    if (token) {
      const { data: tokenData, error: tokenError } = await supabase
        .from("preview_tokens")
        .select("*")
        .eq("preview_id", preview_id)
        .eq("token", token)
        .gte("expires_at", new Date().toISOString())
        .maybeSingle();

      if (!tokenError && tokenData) {
        accessGranted = true;
      }
    }
    
    // If token access fails, check if there's a valid session
    if (!accessGranted) {
      // Get the access log to see if there's a valid session
      const { data: accessData, error: accessError } = await supabase
        .from("access_logs")
        .select("*")
        .eq("preview_id", preview_id)
        .order("accessed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!accessError && accessData) {
        accessGranted = true;
      }
    }

    if (!accessGranted) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Unauthorized access" 
        }),
        { 
          status: 401, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          } 
        }
      );
    }

    // Fetch current project data
    const { data: projectResult, error: projectError } = await supabase
      .from("preview_projects")
      .select("*")
      .eq("id", preview_id)
      .maybeSingle();

    if (projectError || !projectResult) {
      console.error("Error fetching project:", projectError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Project not found" 
        }),
        { 
          status: 404, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          } 
        }
      );
    }

    projectData = projectResult;
    
    // Create history entry
    const actionType = status === 'approved' 
      ? 'Prévia aprovada pelo cliente' 
      : 'Feedback recebido do cliente';
    
    const historyEntry = {
      action: actionType,
      timestamp: new Date().toISOString(),
      data: {
        message: feedback || 'Sem comentários adicionais',
        version: selected_version
      }
    };

    // Update project with new status and feedback
    const { data: updateData, error: updateError } = await supabase
      .from("preview_projects")
      .update({
        status: status,
        feedback: feedback,
        last_activity_date: new Date().toISOString()
      })
      .eq("id", preview_id)
      .select("*")
      .single();

    if (updateError) {
      console.error("Error updating project status:", updateError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to update project status" 
        }),
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          } 
        }
      );
    }

    // Add history entry
    const { error: historyError } = await supabase
      .from("project_history")
      .insert({
        project_id: preview_id,
        action: historyEntry.action,
        details: historyEntry.data
      });

    if (historyError) {
      console.error("Failed to add history entry:", historyError);
      // Not returning error here as the main update was successful
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        project: updateData 
      }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Internal server error" 
      }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  }
});
