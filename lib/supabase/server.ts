import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing public Supabase environment variables");

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
