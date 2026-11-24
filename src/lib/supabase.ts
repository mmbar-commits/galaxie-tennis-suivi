import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const RUNTIME_CONFIG_KEY = 'galaxie_tennis_supabase_config_v1';

export interface SupabaseRuntimeConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseConfig(): SupabaseRuntimeConfig | null {
  const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (envUrl && envKey && !envUrl.includes('votre-projet')) {
    return { url: envUrl.trim(), anonKey: envKey.trim() };
  }

  try {
    const raw = localStorage.getItem(RUNTIME_CONFIG_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SupabaseRuntimeConfig;
    if (parsed.url && parsed.anonKey) {
      return { url: parsed.url.trim(), anonKey: parsed.anonKey.trim() };
    }
  } catch {
    return null;
  }
  return null;
}

export function saveRuntimeSupabaseConfig(config: SupabaseRuntimeConfig | null): void {
  if (!config || !config.url.trim() || !config.anonKey.trim()) {
    localStorage.removeItem(RUNTIME_CONFIG_KEY);
  } else {
    localStorage.setItem(
      RUNTIME_CONFIG_KEY,
      JSON.stringify({ url: config.url.trim(), anonKey: config.anonKey.trim() }),
    );
  }
  cachedClient = null;
}

let cachedClient: SupabaseClient | null = null;
let cachedSignature = '';

export function getSupabaseClient(): SupabaseClient | null {
  const cfg = getSupabaseConfig();
  if (!cfg) return null;
  const sig = `${cfg.url}|${cfg.anonKey}`;
  if (cachedClient && cachedSignature === sig) {
    return cachedClient;
  }
  cachedClient = createClient(cfg.url, cfg.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  cachedSignature = sig;
  return cachedClient;
}
