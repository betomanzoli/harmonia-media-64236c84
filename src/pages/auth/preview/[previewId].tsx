import { GetServerSideProps } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createPagesServerClient(ctx)
  const { previewId } = ctx.params!

  try {
    // Primeiro, verificar se é token de validação (se a tabela existir)
    const { data: validation } = await supabase
      .from('preview_validations')
      .select('*')
      .eq('token', previewId as string)
      .single()

    if (validation && new Date(validation.expires_at) > new Date()) {
      // Token válido, registrar acesso
      await supabase
        .from('preview_access_logs')
        .insert({ 
          project_id: validation.project_id, 
          email: validation.email 
        })

      return {
        redirect: {
          destination: `/preview/${validation.project_id}?email=${validation.email}`,
          permanent: false
        }
      }
    }

    // Se não for token, verificar se é preview_id direto da tabela previews
    const { data: preview } = await supabase
      .from('previews')
      .select('*')
      .eq('preview_id', previewId as string)
      .eq('is_active', true)
      .single()

    if (preview) {
      // Verificar se não expirou
      if (preview.expires_at && new Date(preview.expires_at) < new Date()) {
        return { 
          redirect: { 
            destination: '/error?message=Preview expirado', 
            permanent: false 
          } 
        }
      }

      return {
        redirect: {
          destination: `/preview/${preview.project_id}?preview_id=${preview.preview_id}`,
          permanent: false
        }
      }
    }

    // Se não encontrar nada
    return { 
      redirect: { 
        destination: '/error?message=Preview não encontrado', 
        permanent: false 
      } 
    }

  } catch (error) {
    console.error('Erro na validação de preview:', error)
    return { 
      redirect: { 
        destination: '/error?message=Erro interno', 
        permanent: false 
      } 
    }
  }
}

export default function AuthPreviewPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold mb-2">Validando acesso...</h1>
        <p className="text-gray-600">Redirecionando para sua prévia</p>
      </div>
    </div>
  )
}
