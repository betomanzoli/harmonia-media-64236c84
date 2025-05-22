
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
    let requestData: FeedbackSubmissionRequest;
    
    try {
      requestData = await req.json();
      console.log("Dados recebidos:", JSON.stringify(requestData));
    } catch (parseError) {
      console.error("Erro ao analisar JSON da requisição:", parseError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid JSON in request body" 
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
    
    const { preview_id, feedback, status, token, selected_version } = requestData;

    // Validate inputs
    if (!preview_id || !status) {
      console.error("Campos obrigatórios faltando:", { preview_id, status });
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

    console.log(`Processando feedback para prévia: ${preview_id}, status: ${status}`);
    
    // Check access permissions - either via token or session
    let accessGranted = false;
    let projectData = null;

    // First try token if provided
    if (token) {
      console.log("Validando acesso via token");
      const { data: tokenData, error: tokenError } = await supabase
        .from("preview_tokens")
        .select("*")
        .eq("preview_id", preview_id)
        .eq("token", token)
        .gte("expires_at", new Date().toISOString())
        .maybeSingle();

      if (!tokenError && tokenData) {
        console.log("Token válido encontrado");
        accessGranted = true;
      } else {
        console.error("Erro ou token inválido:", tokenError);
      }
    }
    
    // If token access fails, check if there's a valid session
    if (!accessGranted) {
      console.log("Tentando validar acesso via logs");
      // Get the access log to see if there's a valid session
      const { data: accessData, error: accessError } = await supabase
        .from("access_logs")
        .select("*")
        .eq("preview_id", preview_id)
        .order("accessed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!accessError && accessData) {
        console.log("Registro de acesso encontrado");
        accessGranted = true;
      } else {
        console.error("Sem registros de acesso válidos:", accessError);
      }
    }

    if (!accessGranted) {
      console.error("Acesso não autorizado");
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
    console.log("Buscando dados do projeto");
    const { data: projectResult, error: projectError } = await supabase
      .from("preview_projects")
      .select("*")
      .eq("id", preview_id)
      .maybeSingle();

    if (projectError || !projectResult) {
      console.error("Erro buscando projeto:", projectError);
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
    console.log("Projeto encontrado:", projectData.id);
    
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
    console.log("Atualizando status do projeto para:", status);
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
      console.error("Erro ao atualizar status do projeto:", updateError);
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
    try {
      console.log("Adicionando entrada no histórico");
      const { data: historyData, error: historyError } = await supabase
        .from("project_history")
        .insert({
          project_id: preview_id,
          action: historyEntry.action,
          details: historyEntry.data
        });
        
      if (historyError) {
        console.error("Erro ao adicionar histórico:", historyError);
      } else {
        console.log("Histórico adicionado com sucesso");
      }
    } catch (historyError) {
      console.error("Falha ao adicionar entrada no histórico:", historyError);
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
    console.error("Erro inesperado:", error);
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
