
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse the request body
    const { data } = await req.json();
    const { payment_id, briefing_id, client_name, client_email, package_type, amount } = data;
    
    console.log(`Payment notification received: payment_id=${payment_id}, briefing_id=${briefing_id}, client=${client_name}, package=${package_type}`);
    
    // Validate required parameters
    if (!payment_id || !briefing_id) {
      console.error("Missing required parameters");
      return new Response(
        JSON.stringify({ success: false, error: "Missing required parameters" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Get the current briefing data to update it
    const { data: briefingData, error: fetchError } = await supabase
      .from('briefings')
      .select('*')
      .eq('id', briefing_id)
      .single();
      
    if (fetchError) {
      console.error("Error fetching briefing data:", fetchError);
      
      // If briefing doesn't exist, create it
      if (fetchError.code === 'PGRST116') {
        const { data: newBriefing, error: createError } = await supabase
          .from('briefings')
          .insert({
            id: briefing_id,
            package_type: package_type || 'unknown',
            payment_status: 'completed',
            completion_status: 'ready_for_full',
            data: {
              paymentInfo: {
                id: payment_id,
                amount,
                date: new Date().toISOString(),
                status: 'approved'
              },
              clientName: client_name,
              clientEmail: client_email
            }
          })
          .select()
          .single();
          
        if (createError) {
          console.error("Error creating new briefing:", createError);
          return new Response(
            JSON.stringify({ success: false, error: createError.message }), 
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }
        
        console.log("Created new briefing:", newBriefing?.id);
      } else {
        return new Response(
          JSON.stringify({ success: false, error: fetchError.message }), 
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
    } else {
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
          amount,
          date: new Date().toISOString(),
          status: data.status || 'approved'
        }
      };
      
      // Update briefing status in database
      const { error: updateError } = await supabase
        .from('briefings')
        .update({ 
          payment_status: 'completed', 
          completion_status: 'ready_for_full',
          data: updatedData
        })
        .eq('id', briefing_id);
      
      if (updateError) {
        console.error("Database update error:", updateError);
        return new Response(
          JSON.stringify({ success: false, error: updateError.message }), 
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      console.log("Updated briefing payment status:", briefing_id);
    }
    
    // Check if client exists, if not create it
    if (client_email) {
      const { data: existingClient, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('email', client_email)
        .single();
        
      if (clientError && clientError.code === 'PGRST116') {
        // Client doesn't exist, create it
        const { data: newClient, error: createClientError } = await supabase
          .from('clients')
          .insert({
            name: client_name || 'Unknown Client',
            email: client_email
          });
          
        if (createClientError) {
          console.error("Error creating client:", createClientError);
          // Not failing the whole operation for this
        } else {
          console.log("Created new client with email:", client_email);
        }
      }
    }
    
    // Create an invoice record
    if (amount) {
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          client: client_name || 'Unknown Client',
          amount: amount.toString(),
          description: `Pagamento para pacote ${package_type || 'personalizado'}`,
          status: 'paid',
          due_date: new Date().toISOString(),
          date: new Date().toISOString()
        });
        
      if (invoiceError) {
        console.error("Error creating invoice:", invoiceError);
        // Not failing the whole operation for this
      } else {
        console.log("Created invoice record");
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Payment processed and briefing updated",
        timestamp: new Date().toISOString(),
        briefingId: briefing_id
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing payment webhook:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || String(error) }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 500 
      }
    );
  }
});
