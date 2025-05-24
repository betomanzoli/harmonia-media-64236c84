// src/pages/MusicPreviewAuth.tsx (trecho modificado)
const handleMagicLinkLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;

    // Persistência híbrida
    const sessionData = { email, timestamp: Date.now() };
    try {
      localStorage.setItem('authSession', JSON.stringify(sessionData));
    } catch {
      document.cookie = `authSession=${JSON.stringify(sessionData)}; Path=/; Secure; SameSite=None`;
    }

  } catch (error) {
    // Tratamento de erro...
  }
};
