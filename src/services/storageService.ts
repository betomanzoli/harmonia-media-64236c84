
import { supabase } from '@/lib/supabase';

interface SystemSettings {
  storage: {
    provider: string;
    apiKey?: string;
    region?: string;
    bucket?: string;
  };
}

// Mock system settings until we implement the real hook
const useSystemSettings = () => {
  return {
    settings: {
      storage: {
        provider: 'supabase',
        bucket: 'public'
      }
    } as SystemSettings
  };
};

/**
 * Upload a file to the configured storage provider
 */
export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
) {
  const { settings } = useSystemSettings();
  const provider = settings.storage.provider;
  
  switch (provider) {
    case 'supabase':
      return uploadToSupabase(file, path, onProgress);
    default:
      throw new Error(`Unsupported storage provider: ${provider}`);
  }
}

async function uploadToSupabase(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
) {
  try {
    const { settings } = useSystemSettings();
    const bucket = settings.storage.bucket || 'public';
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`${path}/${file.name}`, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading to Supabase:', error);
      throw error;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(`${path}/${file.name}`);
    
    return { 
      success: true, 
      url: urlData.publicUrl,
      key: `${path}/${file.name}`,
      filename: file.name
    };
  } catch (error) {
    console.error('Exception uploading to storage:', error);
    return { success: false, error };
  }
}

/**
 * Delete a file from the configured storage provider
 */
export async function deleteFile(key: string) {
  const { settings } = useSystemSettings();
  const provider = settings.storage.provider;
  
  switch (provider) {
    case 'supabase':
      return deleteFromSupabase(key);
    default:
      throw new Error(`Unsupported storage provider: ${provider}`);
  }
}

async function deleteFromSupabase(key: string) {
  try {
    const { settings } = useSystemSettings();
    const bucket = settings.storage.bucket || 'public';
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([key]);
    
    if (error) {
      console.error('Error deleting from Supabase:', error);
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception deleting from storage:', error);
    return { success: false, error };
  }
}
