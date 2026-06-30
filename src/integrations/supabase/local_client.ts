import { createClient } from '@supabase/supabase-js';

// Hardcoded values to bypass all environment variable issues
const SUPABASE_URL = "https://rznubvosmkslindleiak.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6bnVidm9zbWtzbGluZGxlaWFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NTA1NDQsImV4cCI6MjA5ODEyNjU0NH0.gwjoOOfCH1ddrF_21_fA5yBp-b31QHt7PJheic6_Eo0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});