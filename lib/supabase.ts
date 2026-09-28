import 'react-native-url-polyfill/auto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { validateSupabaseConfiguration } from './supabaseConfig';

let client: SupabaseClient | undefined;

// Lazy initialization keeps the existing offline prototype independent of Auth.
// This prepares the client; it does not enable login or public registration.
export function getSupabase(): SupabaseClient {
  if (!client) {
    const config = validateSupabaseConfiguration(
      process.env.EXPO_PUBLIC_SUPABASE_URL,
      process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    );
    client = createClient(config.url, config.publishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        flowType: 'pkce',
      },
    });
  }
  return client;
}

// Sessions stay in memory for now. Do not add AsyncStorage/localStorage for
// refresh tokens. Persistent native storage and recovery/deep-link handling
// must be designed and tested before the account feature is enabled.
