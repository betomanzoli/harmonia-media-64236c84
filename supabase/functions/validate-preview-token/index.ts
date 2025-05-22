
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TokenValidationRequest {
  token: string;
  preview_id: string;
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

    // Get token and preview_id from request
    const { token, preview_id }: TokenValidationRequest = await req.json();

    // Validate inputs
    if (!token || !preview_id) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Missing token or preview ID" 
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

    console.log(`Validating token for preview: ${preview_id}`);

    // Check if token exists and is valid
    const { data: tokenData, error: tokenError } = await supabase
      .from("preview_tokens")
      .select("*")
      .eq("preview_id", preview_id)
      .eq("token", token)
      .gte("expires_at", new Date().toISOString())
      .maybeSingle();

    if (tokenError) {
      console.error("Error validating token:", tokenError);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Error validating token" 
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

    if (!tokenData) {
      console.log("Invalid or expired token");
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Invalid or expired token" 
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

    // Token is valid, fetch project data
    const { data: projectData, error: projectError } = await supabase
      .from("preview_projects")
      .select("*")
      .eq("id", preview_id)
      .maybeSingle();

    if (projectError || !projectData) {
      console.error("Error fetching project data:", projectError);
      return new Response(
        JSON.stringify({ 
          valid: false, 
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

    // Log access for analytics
    await supabase.from("access_logs").insert({
      preview_id: preview_id,
      access_method: "token",
      user_email: null // Anonymous access
    });

    return new Response(
      JSON.stringify({ 
        valid: true, 
        project: projectData 
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
        valid: false, 
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
