import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL. Add it to your environment variables."
  );
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY. Add it to your environment variables."
  );
}

export function createSupabaseAdminClient() {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        "x-application-name": "liquidation-hub-admin",
      },
    },
  });
}

export const supabaseAdmin = createSupabaseAdminClient();

export default supabaseAdmin;