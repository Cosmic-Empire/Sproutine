// Supabase has been replaced with local JSON file storage (see lib/store.ts).
// This file is kept as a stub so imports don't break — but nothing uses it anymore.
export function getSupabaseAdmin(): never {
  throw new Error("Supabase has been removed. Use API routes + lib/store.ts instead.")
}

export function getSupabaseBrowser(): never {
  throw new Error("Supabase has been removed. Use API routes + lib/store.ts instead.")
}
