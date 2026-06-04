import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
function createSupabaseClient() {
  let SUPABASE_URL = "https://cvctpuwojwkegyiogwyg.supabase.co";
  let SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2Y3RwdXdvandrZWd5aW9nd3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjQ4MTAsImV4cCI6MjA5NDg0MDgxMH0.dNrqyreZXrheoHEixggaZXQo_PFcnn7ojsVb3waF-7o";
  if (SUPABASE_URL) SUPABASE_URL = SUPABASE_URL.replace(/^["']|["']$/g, "");
  if (SUPABASE_PUBLISHABLE_KEY) SUPABASE_PUBLISHABLE_KEY = SUPABASE_PUBLISHABLE_KEY.replace(/^["']|["']$/g, "");
  console.log(`[Supabase Client Init] URL length: ${SUPABASE_URL ? SUPABASE_URL.length : 0}, Key length: ${SUPABASE_PUBLISHABLE_KEY ? SUPABASE_PUBLISHABLE_KEY.length : 0}`);
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    const missing = [
      ...!SUPABASE_URL ? ["SUPABASE_URL"] : [],
      ...!SUPABASE_PUBLISHABLE_KEY ? ["SUPABASE_PUBLISHABLE_KEY"] : []
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
export {
  supabase as s
};
