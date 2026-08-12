import { createClient } from "@supabase/supabase-js";

const runtimeEnv = typeof process !== "undefined" ? process.env : {};
const URL = import.meta.env.VITE_SUPABASE_URL || runtimeEnv.NEXT_PUBLIC_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || runtimeEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!URL || !API_KEY) {
  throw new Error("Supabase URL and publishable key are required.");
}

export const supabase = createClient(URL, API_KEY);
