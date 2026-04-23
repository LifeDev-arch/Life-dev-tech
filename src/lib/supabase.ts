/// <reference types="vite/client" />
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export const getSupabase = () => {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Em vez de throw, retornamos null e avisamos no console
    // Isso permite que o app renderize a UI estática sem crashar
    console.warn(
      '⚠️ Supabase: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não configurados. Funcionalidades de banco de dados e auth estarão desativadas.'
    );
    return null;
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
};

/**
 * Proxy seguro que evita erros de "undefined" se o Supabase não estiver configurado.
 * Se o cliente for nulo, ele retorna funções "no-op" (que não fazem nada) para não quebrar o código.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getSupabase();
    
    if (client) {
      return (client as any)[prop];
    }

    // Fallback para evitar crash em chamadas como supabase.auth.getSession()
    if (prop === 'auth') {
      return {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => ({ error: null }),
      };
    }

    // Fallback para chamadas de query (supabase.from('...').select())
    if (prop === 'from') {
      return () => ({
        select: () => ({
          eq: () => ({ single: async () => ({ data: null, error: null }), order: async () => ({ data: [], error: null }) }),
          order: async () => ({ data: [], error: null }),
          single: async () => ({ data: null, error: null }),
        }),
        insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) }),
      });
    }

    return undefined;
  },
});

/**
 * Hook logic for server actions simulation in Vite context.
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) return null;
  return data;
}
