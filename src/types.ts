export type ContentStatus = 'draft' | 'published' | 'archived';
export type LeadStatus = 'new' | 'contacting' | 'qualified' | 'disqualified' | 'converted';
export type OrderStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled' | 'refunded';
export type UserRole = 'admin' | 'editor' | 'viewer' | 'client';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  image_url?: string;
  status: ContentStatus;
  category?: string;
  price?: number;
  created_at: string;
}

export interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  message?: string;
  status: LeadStatus;
  source?: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  status: ContentStatus;
  page_type: string;
  summary: string;
  created_by?: string | null;
  updated_by?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PageBlock {
  id: string;
  page_id: string;
  block_key: string;
  block_type: string;
  status: ContentStatus;
  sort_order: number;
  data: {
    content?: string;
    [key: string]: any;
  };
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PageWithContent extends Page {
  content?: string;
}
