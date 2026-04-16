import { query } from '../config/database';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface Message {
  id: string;
  lead_id: string;
  campaign_id: string;
  content: string;
  generated: boolean;
  sent_at?: Date;
  created_at: Date;
}

export async function getAllMessages(): Promise<Message[]> {
  const result = await query('SELECT * FROM messages ORDER BY created_at DESC');
  return result.rows;
}

export async function getMessageById(id: string): Promise<Message | null> {
  const result = await query('SELECT * FROM messages WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function createMessage(data: Partial<Message>): Promise<Message> {
  const { lead_id, campaign_id, content, generated } = data;
  const result = await query(
    `INSERT INTO messages (lead_id, campaign_id, content, generated)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [lead_id, campaign_id, content, generated || false]
  );
  return result.rows[0];
}

export async function generateMessage(
  _lead_id: string,
  lead_info: string,
  campaign_context: string
): Promise<string> {
  const message = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a professional sales outreach expert. Generate personalized, engaging messages for leads.',
      },
      {
        role: 'user',
        content: `Generate a personalized outreach message for this lead:\n\nLead Info: ${lead_info}\n\nCampaign Context: ${campaign_context}`,
      },
    ],
    max_tokens: 300,
    temperature: 0.7,
  });

  return message.choices[0].message.content || '';
}

export async function deleteMessage(id: string): Promise<void> {
  await query('DELETE FROM messages WHERE id = $1', [id]);
}
