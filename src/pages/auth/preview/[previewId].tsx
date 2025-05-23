import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx)
  const { previewId } = ctx.params!

  // Validar token mágico
  const { data: validation } = await supabase
    .from('preview_validations')
    .select('*')
    .eq('token', previewId)
    .single()

  if (!validation || new Date(validation.expires_at) < new Date()) {
    return { redirect: { destination: '/invalid-link', permanent: false } }
  }

  // Registrar acesso
  await supabase
    .from('preview_access_logs')
    .insert({ project_id: validation.project_id, email: validation.email })

  return {
    redirect: {
      destination: `/preview/${validation.project_id}`,
      permanent: false
    }
  }
}
