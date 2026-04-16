import { query } from '../config/database';

export interface Analytics {
  total_leads: number;
  total_campaigns: number;
  messages_sent: number;
  conversion_rate: number;
  response_rate: number;
}

export async function getOverview(): Promise<Analytics> {
  const leadsResult = await query('SELECT COUNT(*) as count FROM leads');
  const campaignsResult = await query('SELECT COUNT(*) as count FROM campaigns');
  const messagesResult = await query('SELECT COUNT(*) as count FROM messages WHERE sent_at IS NOT NULL');
  
  const totalLeads = parseInt(leadsResult.rows[0]?.count || '0');
  const totalCampaigns = parseInt(campaignsResult.rows[0]?.count || '0');
  const messagesSent = parseInt(messagesResult.rows[0]?.count || '0');

  return {
    total_leads: totalLeads,
    total_campaigns: totalCampaigns,
    messages_sent: messagesSent,
    conversion_rate: totalLeads > 0 ? 0.15 : 0, // Placeholder
    response_rate: messagesSent > 0 ? 0.25 : 0, // Placeholder
  };
}

export async function getCampaignStats(campaignId: string): Promise<any> {
  const result = await query(
    `SELECT c.*, COUNT(m.id) as messages_sent
     FROM campaigns c
     LEFT JOIN messages m ON c.id = m.campaign_id AND m.sent_at IS NOT NULL
     WHERE c.id = $1
     GROUP BY c.id`,
    [campaignId]
  );
  return result.rows[0];
}

export async function getLeadStats(leadId: string): Promise<any> {
  const result = await query(
    `SELECT l.*, COUNT(m.id) as messages_received, COUNT(DISTINCT m.campaign_id) as campaigns_involved
     FROM leads l
     LEFT JOIN messages m ON l.id = m.lead_id
     WHERE l.id = $1
     GROUP BY l.id`,
    [leadId]
  );
  return result.rows[0];
}
