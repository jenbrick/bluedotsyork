import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local
const SUPABASE_GD_URL = process.env.NEXT_PUBLIC_GD_SUPABASE_URL!;
const SUPABASE_GD_ANON = process.env.NEXT_PUBLIC_GD_SUPABASE_ANON!;

export const supabase = createClient(SUPABASE_GD_URL, SUPABASE_GD_ANON);
