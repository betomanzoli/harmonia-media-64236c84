
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface NotificationRequest {
  projectId: string;
  clientName: string;
  clientEmail: string;
  projectTitle: string;
  versions?: Array<{ id: string, name: string, audioUrl: string }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const requestData: NotificationRequest = await req.json();
    const { projectId, clientName, clientEmail, projectTitle, versions } = requestData;
    
    if (!projectId || !clientEmail) {
      throw new Error("Missing required fields: projectId and clientEmail are required");
    }
    
    console.log(`Processing preview notification for project ${projectId} to client ${clientEmail}`);
    
    // Generate magic token for secure access
    const timestamp = Date.now().toString();
    const tokenData = `${projectId}:${timestamp}`;
    const magicToken = btoa(tokenData); // Base64 encode
    
    // Store allowed access in preview_codes table
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // 7 days expiration

    const { data: codeData, error: codeError } = await supabase
      .from('preview_codes')
      .insert({
        code: magicToken,
        project_id: projectId,
        expires_at: expirationDate.toISOString(),
        is_active: true
      })
      .select()
      .single();
    
    if (codeError) {
      console.error("Error creating preview code entry:", codeError);
      throw codeError;
    }
    
    // Create or update preview_projects record
    const { data: projectData, error: projectError } = await supabase
      .from('preview_projects')
      .upsert({
        id: projectId,
        client_name: clientName,
        project_title: projectTitle,
        package_type: 'unknown', // Will be updated with actual data when available
        status: 'active', 
        expiration_date: expirationDate.toISOString(),
      })
      .select()
      .single();
      
    if (projectError) {
      console.error("Error updating preview project:", projectError);
      // Continue even if this fails
    }
    
    // Create access link with magic token
    const baseUrl = req.headers.get('origin') || 'https://harmonia.media';
    const previewUrl = `${baseUrl}/preview/${projectId}?token=${magicToken}`;
    
    // Send email notification - this is a placeholder for where you'd integrate with email service
    // In a production setup, you would call your email sending service here
    console.log(`Would send email to ${clientEmail} with preview URL: ${previewUrl}`);
    
    // Create email content
    const emailContent = {
      to: clientEmail,
      subject: `Prévias disponíveis para ${projectTitle}`,
      html: `
        <h1>Olá ${clientName},</h1>
        <p>Estamos felizes em informar que uma prévia do seu projeto "${projectTitle}" está disponível para sua avaliação.</p>
        <p>Clique no link abaixo para acessar sua prévia:</p>
        <p><a href="${previewUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ver Prévia</a></p>
        <p>Ou copie e cole este link no seu navegador:</p>
        <p>${previewUrl}</p>
        <p>Este link é válido por 7 dias. Aguardamos seu feedback!</p>
        <p>Atenciosamente,<br>Equipe HarmoniA</p>
      `,
    };
    
    // For now, we'll just log this - in production you would send the email
    console.log("Email content:", emailContent);
    
    // Log access for tracking
    const { error: logError } = await supabase
      .from('access_logs')
      .insert({
        preview_id: projectId,
        access_method: 'email_notification',
        user_email: clientEmail
      });
      
    if (logError) {
      console.error("Error logging access:", logError);
      // Continue even if logging fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        previewUrl,
        magicToken,
        expiresAt: expirationDate.toISOString()
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
