import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicSupabaseEnv } from "./env";

export async function getServerSupabase() {
  const env = getPublicSupabaseEnv();
  if (!env) throw new Error("Missing public Supabase environment variables");
  const { url, key } = env;

  const cookieStore = await cookies();
  const setAll: SetAllCookies = (items) => {
    try {
      items.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
    } catch {
      // Server Components can read cookies but cannot write them.
    }
  };

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll,
    },
  });
}
