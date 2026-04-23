import { supabase } from '@/src/lib/supabase';
import type { Page } from '@/src/types';

/**
 * ADMIN QUERIES
 * Requires session validation at the guard level.
 */

export async function getAdminDashboardStats() {
  // Simulated aggregation - in production this would be an RPC or a dedicated view
  const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });
  const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
  
  return {
    totalLeads: leadsCount || 0,
    activeOrders: ordersCount || 0,
    conversionRate: '4.8%',
    totalRevenue: 125400.00
  };
}

export async function getLeadsList() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function updateLeadStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// Page management functions
export async function getPages() {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data as Page[];
}

export async function getPageById(id: string) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Page;
}

export async function createPage(pageData: Omit<Page, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('pages')
    .insert(pageData)
    .select()
    .single();
    
  if (error) throw error;
  return data as Page;
}

export async function updatePage(id: string, pageData: Partial<Omit<Page, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('pages')
    .update(pageData)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data as Page;
}

export async function deletePage(id: string) {
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
}
