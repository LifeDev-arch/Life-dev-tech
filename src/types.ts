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

export interface Order {
  id: string;
  customer_id: string;
  status: OrderStatus;
  total_amount: number;
  currency: string;
  payment_provider: 'stripe' | 'manual';
  items: any[];
  created_at: string;
}
