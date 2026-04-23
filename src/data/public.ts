import { supabase } from '@/src/lib/supabase';
import type { Service, Lead, ContentStatus, Page } from '@/src/types';

/**
 * PUBLIC QUERIES
 * Coherent with production contract: minimal exposure, server-first logic.
 */

export async function getPublishedServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Service[];
}

export async function getPublishedServiceBySlug(slug: string) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) return null;
  return data as Service;
}

export async function getPublishedTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('status', 'published');

  if (error) return [];
  return data;
}

export async function getPublishedPageBySlug(slug: string) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) return null;
  return data as Page;
}

/**
 * PUBLIC ACTIONS
 */

export async function submitLead(leadData: Partial<Lead>) {
  // Attached invisible context (Contract requirement)
  const context = {
    entry_page_url: window.location.href,
    user_agent: navigator.userAgent,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    referrer: document.referrer,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  const { data, error } = await supabase
    .from('leads')
    .insert([
      {
        ...leadData,
        status: 'new',
        metadata: context,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}
