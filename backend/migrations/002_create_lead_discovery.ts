import { query } from '../src/config/database';

/**
 * Create lead_discovery_configs table
 */
export async function up(): Promise<void> {
  console.log('Running migration: Create lead_discovery_configs table');

  await query(`
    CREATE TABLE IF NOT EXISTS lead_discovery_configs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      criteria JSONB NOT NULL,
      is_active BOOLEAN DEFAULT true,
      run_frequency INTEGER DEFAULT 24,
      last_run_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add index for active configs
  await query(
    `CREATE INDEX IF NOT EXISTS idx_discovery_configs_active ON lead_discovery_configs(is_active)`
  );

  console.log('✓ lead_discovery_configs table created');
}

/**
 * Drop lead_discovery_configs table
 */
export async function down(): Promise<void> {
  console.log('Rolling back migration: Drop lead_discovery_configs table');

  await query(`
    DROP TABLE IF NOT EXISTS lead_discovery_configs CASCADE;
  `);

  console.log('✓ lead_discovery_configs table dropped');
}
