// Type definitions for API requests and responses

export interface CreateLeadRequest {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  company?: string;
}

export interface UpdateLeadRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  company?: string;
  status?: string;
}

export interface CreateCampaignRequest {
  name: string;
  description?: string;
  message_template?: string;
  sends_per_day?: number;
}

export interface UpdateCampaignRequest {
  name?: string;
  description?: string;
  message_template?: string;
  sends_per_day?: number;
}

export interface CreateMessageRequest {
  lead_id: string;
  campaign_id: string;
  content: string;
  generated?: boolean;
}
