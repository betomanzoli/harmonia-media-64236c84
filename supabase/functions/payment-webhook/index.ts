
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentWebhookRequest {
  payment_id: string;
  briefing_id: string;
  client_name: string;
  client_email: string;
  package_type: string;
  amount: number;
  status: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const requestData = await req.json();
    const paymentData: PaymentWebhookRequest = requestData.data;
    
    if (!paymentData.payment_id || !paymentData.briefing_id) {
      throw new Error("Missing required fields: payment_id and briefing_id are required");
    }
    
    console.log(`Processing payment ${paymentData.payment_id} for briefing ${paymentData.briefing_id}`);
    
    // Update briefing with payment information
    const { data: briefingData, error: briefingError } = await supabase
      .from('briefings')
      .update({
        payment_status: 'completed',
        completion_status: 'ready_for_full',
        data: supabase.rpc('update_jsonb_field', {
          table_name: 'briefings',
          record_id: paymentData.briefing_id,
          field_name: 'data',
          nested_field: 'paymentInfo',
          field_value: JSON.stringify({
            id: paymentData.payment_id,
            amount: paymentData.amount,
            date: new Date().toISOString(),
            status: paymentData.status
          })
        })
      })
      .eq('id', paymentData.briefing_id)
      .select()
      .single();
      
    if (briefingError) {
      console.error("Error updating briefing:", briefingError);
      throw briefingError;
    }
    
    // Log payment in project history
    if (briefingData.project_id) {
      const { error: historyError } = await supabase
        .from('project_history')
        .insert({
          project_id: briefingData.project_id,
          action: 'payment_received',
          details: {
            paymentId: paymentData.payment_id,
            amount: paymentData.amount,
            status: paymentData.status,
            timestamp: new Date().toISOString()
          }
        });
        
      if (historyError) {
        console.error("Error logging to project history:", historyError);
        // Continue even if history logging fails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Payment processed successfully",
        briefing_id: paymentData.briefing_id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in payment-webhook function:", error);
    return new Response(
      JSON.stringify({ error: error.message || String(error) }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
