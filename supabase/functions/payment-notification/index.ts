
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') as string
const supabase = createClient(supabaseUrl, supabaseAnonKey)
const webhookSecret = "1658b2054391fcd9effb63651dde741c65734b0bc57b7c7ab286892b48f7c466"

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
    const signature = req.headers.get('x-signature') || ''
    const body = await req.text()
    
    // Verify signature (implement proper signature verification in production)
    // TODO: properly verify the signature in production
    
    // Parse the request body
    const jsonData = JSON.parse(body)
    console.log("Received MercadoPago webhook:", jsonData)
    
    // Handle different notification types
    const { type, data } = jsonData
    
    if (type === 'payment') {
      const paymentId = data.id
      
      // Fetch payment details from MercadoPago API
      // In a real implementation, you'd use MP's SDK to get payment details
      // For now, we'll simulate this step
      console.log(`Processing payment with ID: ${paymentId}`)
      
      // Find the related briefing/order
      // For demo purposes, we'll check for external reference
      const externalReference = data.external_reference || ''
      let briefingId = externalReference
      
      if (!briefingId && data.metadata && data.metadata.briefing_id) {
        briefingId = data.metadata.briefing_id
      }
      
      console.log(`Found briefing ID: ${briefingId}`)
      
      if (briefingId) {
        // Update the briefing payment status
        const { data: briefingData, error: fetchError } = await supabase
          .from('briefings')
          .select('*')
          .eq('id', briefingId)
          .single()
        
        if (fetchError) {
          console.error("Error fetching briefing data:", fetchError)
        } else if (briefingData) {
          // Update workflow data
          let updatedData = briefingData.data || {}
          updatedData.workflow = {
            ...(updatedData.workflow || {}),
            currentStage: 'payment_complete',
            nextStage: 'full_briefing',
            completedSteps: [
              ...(updatedData.workflow?.completedSteps || ['initial_briefing']),
              'payment'
            ],
            paymentInfo: {
              id: paymentId,
              date: new Date().toISOString(),
              status: data.status || 'processed'
            }
          }
          
          // Update briefing status
          const { error } = await supabase
            .from('briefings')
            .update({
              payment_status: 'completed',
              completion_status: 'ready_for_full',
              data: updatedData
            })
            .eq('id', briefingId)
          
          if (error) {
            console.error("Error updating briefing:", error)
          } else {
            console.log(`Successfully updated briefing ${briefingId} payment status`)
            
            // Notify n8n webhook about the payment completion
            try {
              const webhookUrl = "https://humbrock.app.n8n.cloud/webhook-test/webhook/briefing"
              await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  type: 'payment_completed',
                  data: {
                    briefing_id: briefingId,
                    payment_id: paymentId,
                    status: data.status || 'processed',
                    timestamp: new Date().toISOString(),
                    package_type: briefingData.package_type
                  }
                })
              })
            } catch (webhookError) {
              console.error("Error notifying n8n webhook:", webhookError)
            }
          }
        }
      } else {
        console.warn("No briefing ID found in payment notification")
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "Webhook processed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error processing webhook:", error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    )
  }
})
