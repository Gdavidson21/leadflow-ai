import { disconnect } from '../src/config/database';
import { runMigrations } from './001_initial_schema';
import * as leadDiscoveryMigration from './002_create_lead_discovery';

async function main(): Promise<void> {
  try {
    // Run initial schema
    await runMigrations();
    
    // Run lead discovery migration
    await leadDiscoveryMigration.up();
    
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    await disconnect();
  }
}

main();
