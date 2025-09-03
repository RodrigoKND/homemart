import { createClient, SupabaseClient } from '@supabase/supabase-js';

const {
    VITE_SUPABASE_URL: url,
    VITE_SUPABASE_ANON_KEY: anonKey
} = import.meta.env;

const supabaseUrl = url!;
const supabaseAnonKey = anonKey!;

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);