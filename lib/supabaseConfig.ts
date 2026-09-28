export type SupabaseConfiguration = { url: string; publishableKey: string };

// Accept only a hosted Supabase project and the modern public key type.
// A misplaced secret must fail before it can reach a request or a log.
export function validateSupabaseConfiguration(url?: string, publishableKey?: string): SupabaseConfiguration {
  if (!url || url.trim() !== url || !/^https:\/\/[a-z0-9]{20}\.supabase\.co\/?$/.test(url)) {
    throw new Error('Set EXPO_PUBLIC_SUPABASE_URL to the HTTPS project URL.');
  }
  if (!publishableKey || publishableKey.trim() !== publishableKey || !/^sb_publishable_[A-Za-z0-9_-]+$/.test(publishableKey) || publishableKey === 'sb_publishable_replace_me') {
    throw new Error('Set EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY to a public publishable key, never a secret or service-role key.');
  }
  return { url: url.replace(/\/$/, ''), publishableKey };
}
