export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx)
  const { data: { session } } = await supabase.auth.getSession()

  // Verificar sessão válida
  const { data: project } = await supabase
    .from('projects')
    .select('allowed_emails')
    .eq('id', ctx.params!.projectId)
    .single()

  if (!project?.allowed_emails?.includes(session?.user.email)) {
    return { redirect: { destination: `/auth/preview/${ctx.params!.projectId}`, permanent: false } }
  }

  // Buscar status atual
  const { data: feedback } = await supabase
    .from('feedbacks')
    .select('status, comments')
    .eq('project_id', ctx.params!.projectId)
    .eq('user_email', session.user.email)
    .single()

  return { props: { initialFeedback: feedback } }
}

const PreviewPage = ({ initialFeedback }) => {
  const [feedback, setFeedback] = useState(initialFeedback)

  const submitFeedback = async (newStatus) => {
    const { error } = await supabase
      .from('feedbacks')
      .upsert(
        { ...feedback, status: newStatus, updated_at: new Date() },
        { onConflict: 'project_id,user_email' }
      )

    if (!error) {
      setFeedback(prev => ({ ...prev, status: newStatus }))
    }
  }

  // Componente JSX...
}
