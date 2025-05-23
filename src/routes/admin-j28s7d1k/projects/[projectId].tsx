const WhatsAppIntegration = ({ projectId }) => {
  const { data: client } = useQuery(['project-client', projectId], async () => {
    const { data } = await supabase
      .from('projects')
      .select('clients(phone_number)')
      .eq('id', projectId)
      .single()
    
    return data?.clients
  })

  const formattedPhone = client?.phone_number?.replace(/[^\d+]/g, '')
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent('Olá, vi seu projeto no Harmonia...')}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener"
      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
    >
      Contato WhatsApp
    </a>
  )
}
