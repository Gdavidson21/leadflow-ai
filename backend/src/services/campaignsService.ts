import { query } from '../config/database';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'running' | 'paused' | 'completed' | 'archived';
  target_leads?: string[];
  message_template?: string;
  sends_per_day: number;
  created_at: Date;
  updated_at: Date;
}

export async function getAllCampaigns(): Promise<Campaign[]> {
  const result = await query('SELECT * FROM campaigns ORDER BY created_at DESC');
  return result.rows;
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  const result = await query('SELECT * FROM campaigns WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function createCampaign(data: Partial<Campaign>): Promise<Campaign> {
  const { name, description, message_template, sends_per_day } = data;
  const result = await query(
    `INSERT INTO campaigns (name, description, message_template, sends_per_day, status)
     VALUES ($1, $2, $3, $4, 'draft')
     RETURNING *`,
    [name, description, message_template, sends_per_day || 10]
  );
  return result.rows[0];
}

export async function updateCampaign(id: string, data: Partial<Campaign>): Promise<Campaign> {
  const { name, description, message_template, sends_per_day } = data;
  const result = await query(
    `UPDATE campaigns 
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         message_template = COALESCE($3, message_template),
         sends_per_day = COALESCE($4, sends_per_day),
         updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
    [name, description, message_template, sends_per_day, id]
  );
  return result.rows[0];
}

export async function deleteCampaign(id: string): Promise<void> {
  await query('DELETE FROM campaigns WHERE id = $1', [id]);
}

export async function startCampaign(id: string): Promise<Campaign> {
  const result = await query(
    `UPDATE campaigns 
     SET status = 'running', updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return result.rows[0];
}

export async function pauseCampaign(id: string): Promise<Campaign> {
  const result = await query(
    `UPDATE campaigns 
     SET status = 'paused', updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return result.rows[0];
}
