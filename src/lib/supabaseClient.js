import { createClient } from '@supabase/supabase-js';

// Load variables from .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseKey.startsWith('sb_')) {
    console.warn("Supabase credentials might be incorrect. Please check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
