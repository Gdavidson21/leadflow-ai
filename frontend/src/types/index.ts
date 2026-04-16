// Common types and interfaces

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: Date;
}

export interface Lead {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  company?: string;
  status: 'new' | 'contacted' | 'interested' | 'converted' | 'rejected';
  created_at: Date;
  updated_at: Date;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  message_template?: string;
  status: 'draft' | 'running' | 'paused' | 'completed' | 'archived';
  sends_per_day: number;
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  id: string;
  lead_id: string;
  campaign_id: string;
  content: string;
  generated: boolean;
  sent_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  timestamp: string;
}

export interface ApiError {
  error: {
    message: string;
    status: number;
    timestamp: string;
  };
}
