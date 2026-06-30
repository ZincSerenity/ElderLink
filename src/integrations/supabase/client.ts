import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

function createSupabaseClient() {
  const SUPABASE_URL = "https://rznubvosmkslindleiak.supabase.co";
  // Fix: Ensure this variable name matches the one used below
  const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6bnVidm9zbWtzbGluZGxlaWFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NTA1NDQsImV4cCI6MjA5ODEyNjU0NH0.gwjoOOfCH1ddrF_21_fA5yBp-b31QHt7PJheic6_Eo0";

  console.log("DEBUG: I AM RUNNING THIS FILE. URL IS:", SUPABASE_URL);

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});