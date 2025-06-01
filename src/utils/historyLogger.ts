// src/utils/historyLogger.ts
import { supabase } from '@/integrations/supabase/client';

export const logProjectHistory = async (
  projectId: string,
  actionType: string,
  details: Record<string, any> | null = null,
  userId?: string // Opcional: Passar o ID do usuário admin logado
) => {
  if (!projectId || !actionType) {
    console.warn('[History Logger] project_id e action_type são obrigatórios.');
    return;
  }

  try {
    const { error } = await supabase
      .from('project_history')
      .insert({
        project_id: projectId,
        action_type: actionType,
        details: details,
        user_id: userId || null // Armazena o ID do usuário se fornecido
      });

    if (error) {
      throw error;
    }
    console.log(`[History Logger] Evento '${actionType}' registrado para projeto ${projectId}`);

  } catch (error: any) {
    console.error(`[History Logger] Erro ao registrar evento '${actionType}' para projeto ${projectId}:`, error.message);
    // Não travar a aplicação principal se o log falhar
  }
};
