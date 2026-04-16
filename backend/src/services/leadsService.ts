import { query } from '../config/database';

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

export async function getAllLeads(): Promise<Lead[]> {
  const result = await query('SELECT * FROM leads ORDER BY created_at DESC');
  return result.rows;
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const result = await query('SELECT * FROM leads WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function createLead(data: Partial<Lead>): Promise<Lead> {
  const { email, first_name, last_name, phone, company } = data;
  const result = await query(
    `INSERT INTO leads (email, first_name, last_name, phone, company, status)
     VALUES ($1, $2, $3, $4, $5, 'new')
     RETURNING *`,
    [email, first_name, last_name, phone, company]
  );
  return result.rows[0];
}

export async function updateLead(id: string, data: Partial<Lead>): Promise<Lead> {
  const { email, first_name, last_name, phone, company, status } = data;
  const result = await query(
    `UPDATE leads 
     SET email = COALESCE($1, email),
         first_name = COALESCE($2, first_name),
         last_name = COALESCE($3, last_name),
         phone = COALESCE($4, phone),
         company = COALESCE($5, company),
         status = COALESCE($6, status),
         updated_at = NOW()
     WHERE id = $7
     RETURNING *`,
    [email, first_name, last_name, phone, company, status, id]
  );
  return result.rows[0];
}

export async function deleteLead(id: string): Promise<void> {
  await query('DELETE FROM leads WHERE id = $1', [id]);
}
