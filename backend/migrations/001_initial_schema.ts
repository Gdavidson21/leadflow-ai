import { query } from '../src/config/database';

export async function runMigrations(): Promise<void> {
  try {
    console.log('Running migrations...');

    // Create leads table
    await query(`
      CREATE TABLE IF NOT EXISTS leads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        company VARCHAR(200),
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await query('CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);');
    await query('CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);');
    console.log('✓ Leads table created');

    // Create campaigns table
    await query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        message_template TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        sends_per_day INTEGER DEFAULT 10,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await query('CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);');
    await query('CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at);');
    console.log('✓ Campaigns table created');

    // Create messages table
    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        generated BOOLEAN DEFAULT false,
        sent_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await query('CREATE INDEX IF NOT EXISTS idx_messages_lead_id ON messages(lead_id);');
    await query('CREATE INDEX IF NOT EXISTS idx_messages_campaign_id ON messages(campaign_id);');
    await query('CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(sent_at);');
    console.log('✓ Messages table created');

    // Create campaign_leads junction table
    await query(`
      CREATE TABLE IF NOT EXISTS campaign_leads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
        lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(campaign_id, lead_id)
      );
    `);
    await query('CREATE INDEX IF NOT EXISTS idx_campaign_leads_status ON campaign_leads(status);');
    console.log('✓ Campaign leads junction table created');

    console.log('✓ All migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}
