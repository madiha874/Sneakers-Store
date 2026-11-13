import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ?? '';
const rawAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ?? '';

function validateConfig(url: string, key: string): string | null {
  if (!url || !key) {
    return 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.';
  }
  if (url.includes('your-project-id') || key.includes('your-public-supabase-anon-key')) {
    return 'Placeholder Supabase environment variables detected. Configure your live Supabase Project URL and Anon Key.';
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return 'VITE_SUPABASE_URL must be a valid HTTP/HTTPS URL.';
    }
  } catch {
    return 'VITE_SUPABASE_URL is not a valid URL.';
  }
  if (key.length < 20) {
    return 'VITE_SUPABASE_ANON_KEY appears invalid.';
  }
  return null;
}

export const supabaseConfigError: string | null = validateConfig(rawUrl, rawAnonKey);
export const isSupabaseConfigured: boolean = supabaseConfigError === null;

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(rawUrl, rawAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      supabaseConfigError ??
        'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
  }
  return supabase;
}
