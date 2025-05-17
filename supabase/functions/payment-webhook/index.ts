
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const supabaseUrl = "https://ivueqxyuflxsiecqvmgt.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dWVxeHl1Zmx4c2llY3F2bWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjY0MzEsImV4cCI6MjA2MjMwMjQzMX0.db1UVta6PSPGokJOZozwqZ7AAs2jBljfWCdUR3LjIdM"
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // Parse the request body
    const { data } = await req.json()
    const { payment_id, briefing_id } = data
    
    console.log(`Payment notification received: payment_id=${payment_id}, briefing_id=${briefing_id}`)
    
    // Validate the payment_id and briefing_id
    if (!payment_id || !briefing_id) {
      console.error("Missing required parameters")
      return new Response(
        JSON.stringify({ success: false, error: "Missing required parameters" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      )
    }
    
    // TO-DO: Verify payment is valid with Mercado Pago API
    // This would check the payment status with the Mercado Pago API
    // For now, we'll trust the incoming webhook data
    
    // Get the current briefing data to update it
    const { data: briefingData, error: fetchError } = await supabase
      .from('briefings')
      .select('*')
      .eq('id', briefing_id)
      .single();
      
    if (fetchError) {
      console.error("Error fetching briefing data:", fetchError);
      return new Response(
        JSON.stringify({ success: false, error: fetchError.message }), 
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    // Update the workflow data to reflect payment completion
    let updatedData = briefingData.data || {};
    updatedData.workflow = {
      ...(updatedData.workflow || {}),
      currentStage: 'payment_complete',
      nextStage: 'full_briefing',
      completedSteps: [
        ...(updatedData.workflow?.completedSteps || ['initial_briefing']),
        'payment'
      ],
      paymentInfo: {
        id: payment_id,
        date: new Date().toISOString(),
        status: data.status || 'processed'
      }
    };
    
    // Update briefing status in database
    const { error } = await supabase
      .from('briefings')
      .update({ 
        payment_status: 'completed', 
        completion_status: 'ready_for_full',
        data: updatedData
      })
      .eq('id', briefing_id)
    
    if (error) {
      console.error("Database update error:", error)
      return new Response(
        JSON.stringify({ success: false, error: error.message }), 
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      )
    }
    
    // Trigger n8n workflow to continue the briefing process
    if (data.status === "approved") {
      try {
        // Replace with your actual n8n webhook URL
        await fetch('https://n8n.harmonia.media/webhook/continuar-briefing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            briefing_id,
            package_type: briefingData.package_type,
            initial_responses: briefingData.initial_responses,
            timestamp: new Date().toISOString()
          })
        })
        console.log("N8n webhook triggered successfully for briefing_id:", briefing_id)
      } catch (fetchError) {
        console.error("Error calling n8n webhook:", fetchError)
        // We don't want to fail the whole process if just the n8n part fails
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "Payment processed and briefing updated" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error processing payment webhook:", error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    )
  }
})
