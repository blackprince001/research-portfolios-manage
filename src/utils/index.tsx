const env = import.meta.env;

export const variable = {
  manage_url: env.VITE_MANAGE_URL,
  supabase_url: env.VITE_PUBLIC_SUPABASE_URL,
  project_key: env.VITE_PUBLIC_SUPABASE_ANON_KEY,
};

