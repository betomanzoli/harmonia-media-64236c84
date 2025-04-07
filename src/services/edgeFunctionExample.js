
// Este é um exemplo de como a Edge Function send-email do Supabase deve ser implementada
// Copie este código para sua função no Supabase

// Edge Function 'send-email' no Supabase
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import nodemailer from 'npm:nodemailer'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }

  try {
    const { to, subject, content, templateId } = await req.json()

    // Validar parâmetros
    if (!to || !subject || !content) {
      return new Response(
        JSON.stringify({ 
          error: 'Parâmetros inválidos. Forneça to, subject e content.' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Configuração do transportador de email
    // IMPORTANTE: Use variáveis de ambiente para as credenciais
    const transporter = nodemailer.createTransport({
      host: 'smtp.privateemail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'contato@harmonia.media',
        pass: Deno.env.get('SMTP_PASSWORD')
      }
    })

    // Enviar o email
    const info = await transporter.sendMail({
      from: 'harmonIA <contato@harmonia.media>',
      to: to,
      subject: subject,
      html: content
    })

    return new Response(
      JSON.stringify({ 
        success: true,
        messageId: info.messageId
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Falha ao enviar email',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
