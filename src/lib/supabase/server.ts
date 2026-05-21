import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client.
 * Only use in Server Components and API routes (never imported in "use client" files).
 * Uses the anon/publishable key — RLS policies apply normally.
 */
export function getServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY en entorno."
    );
  }

  return createClient(supabaseUrl, supabaseKey);
}
