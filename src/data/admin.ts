import { supabase } from '@/src/lib/supabase';

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
