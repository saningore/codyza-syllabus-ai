import { getPublicSupabaseEnv } from "@/lib/supabase/env";
import { getServerSupabase } from "@/lib/supabase/server";

export async function signOutCurrentUser(): Promise<void> {
  if (!getPublicSupabaseEnv()) return;
  const supabase = await getServerSupabase();
  await supabase.auth.signOut();
}
