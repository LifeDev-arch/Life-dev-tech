import { supabase } from '@/src/lib/supabase';
import type { ContentStatus, Page, PageWithContent } from '@/src/types';

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

export type PageCreateInput = Pick<Page, 'title' | 'slug' | 'summary' | 'status' | 'page_type'>;
export type PageUpdateInput = Partial<Pick<Page, 'title' | 'slug' | 'summary' | 'status' | 'page_type'>>;

// Page management functions
export async function getPages() {
  const { data, error } = await supabase
    .from('pages')
    .select('id, title, slug, status, page_type, summary, published_at, created_at, updated_at')
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data as Page[];
}

export async function getPageById(id: string) {
  const { data, error } = await supabase
    .from('pages')
    .select('id, title, slug, status, page_type, summary, published_at, created_at, updated_at')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  const page = data as Page;

  const { data: block } = await supabase
    .from('page_blocks')
    .select('data')
    .eq('page_id', id)
    .eq('block_key', 'main_content')
    .maybeSingle();

  return {
    ...page,
    content: block?.data?.content ?? ''
  } as PageWithContent;
}

export async function createPage(pageData: PageCreateInput, content?: string) {
  const { data, error } = await supabase
    .from('pages')
    .insert(pageData)
    .select()
    .single();
    
  if (error) throw error;

  const page = data as Page;
  const sanitizedContent = content?.trim() ?? '';

  if (sanitizedContent.length > 0) {
    const { error: blockError } = await supabase
      .from('page_blocks')
      .insert({
        page_id: page.id,
        block_key: 'main_content',
        block_type: 'rich_text',
        status: pageData.status,
        sort_order: 1,
        data: { content: sanitizedContent }
      });

    if (blockError) throw blockError;
  }

  return {
    ...page,
    content: sanitizedContent
  } as PageWithContent;
}

export async function updatePage(id: string, pageData: PageUpdateInput, content?: string) {
  const { data, error } = await supabase
    .from('pages')
    .update(pageData)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;

  const page = data as Page;
  const sanitizedContent = content?.trim() ?? '';

  const { data: existingBlock } = await supabase
    .from('page_blocks')
    .select('id')
    .eq('page_id', id)
    .eq('block_key', 'main_content')
    .maybeSingle();

  if (existingBlock?.id) {
    const { error: blockError } = await supabase
      .from('page_blocks')
      .update({
        data: { content: sanitizedContent },
        status: pageData.status ?? page.status,
        block_type: 'rich_text',
        sort_order: 1
      })
      .eq('id', existingBlock.id);

    if (blockError) throw blockError;
  } else if (sanitizedContent.length > 0) {
    const { error: blockError } = await supabase
      .from('page_blocks')
      .insert({
        page_id: id,
        block_key: 'main_content',
        block_type: 'rich_text',
        status: pageData.status ?? page.status,
        sort_order: 1,
        data: { content: sanitizedContent }
      });

    if (blockError) throw blockError;
  }

  return {
    ...page,
    content: sanitizedContent
  } as PageWithContent;
}

export async function deletePage(id: string) {
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
}
