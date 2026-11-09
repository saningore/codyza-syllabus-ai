import { createBrowserClient } from "@supabase/ssr";
import { getPublicSupabaseEnv } from "./env";

export function getBrowserSupabase() {
  const env = getPublicSupabaseEnv();
  if (!env) throw new Error("Missing public Supabase environment variables");
  return createBrowserClient(env.url, env.key);
}
