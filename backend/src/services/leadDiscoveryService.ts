import { query } from '../config/database';
import * as leadsService from './leadsService';
import axios from 'axios';

export interface LeadDiscoveryCriteria {
  industry?: string;
  keywords?: string[];
  location?: string;
  companySize?: 'small' | 'medium' | 'large';
  limit?: number;
}

export interface DiscoveredLead {
  email: string;
  first_name: string;
  last_name: string;
  company?: string;
  phone?: string;
}

export interface LeadDiscoveryConfig {
  id?: string;
  name: string;
  criteria: LeadDiscoveryCriteria;
  is_active: boolean;
  run_frequency?: number; // in hours
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Lead Discovery Service
 * Automatically finds and creates leads from various sources
 */

// Mock lead database - in production, this would connect to real data sources
const MOCK_LEADS_DATABASE: DiscoveredLead[] = [
  {
    email: 'john.smith@techcorp.com',
    first_name: 'John',
    last_name: 'Smith',
    company: 'TechCorp Solutions',
    phone: '+1-555-0101',
  },
  {
    email: 'sarah.johnson@innovateco.com',
    first_name: 'Sarah',
    last_name: 'Johnson',
    company: 'InnovateCo',
    phone: '+1-555-0102',
  },
  {
    email: 'michael.davis@growthventures.io',
    first_name: 'Michael',
    last_name: 'Davis',
    company: 'Growth Ventures',
    phone: '+1-555-0103',
  },
  {
    email: 'emily.wilson@startupx.com',
    first_name: 'Emily',
    last_name: 'Wilson',
    company: 'StartupX',
    phone: '+1-555-0104',
  },
  {
    email: 'david.lee@digitalmark.co',
    first_name: 'David',
    last_name: 'Lee',
    company: 'Digital Marketing Group',
    phone: '+1-555-0105',
  },
  {
    email: 'jessica.brown@cloudtech.io',
    first_name: 'Jessica',
    last_name: 'Brown',
    company: 'CloudTech Innovations',
    phone: '+1-555-0106',
  },
  {
    email: 'robert.martinez@enterprisesol.com',
    first_name: 'Robert',
    last_name: 'Martinez',
    company: 'Enterprise Solutions Inc',
    phone: '+1-555-0107',
  },
  {
    email: 'amanda.garcia@futuretech.net',
    first_name: 'Amanda',
    last_name: 'Garcia',
    company: 'FutureTech Systems',
    phone: '+1-555-0108',
  },
];

/**
 * Search for leads matching the given criteria
 * Integrates with Hunter.io API for real lead data
 * Falls back to mock data if API key is not configured
 */
export async function searchLeads(criteria: LeadDiscoveryCriteria): Promise<DiscoveredLead[]> {
  try {
    const apiKey = process.env.HUNTER_API_KEY;

    // If Hunter.io is configured, use real API
    if (apiKey && apiKey !== 'your_hunter_api_key_here') {
      return await searchLeadsFromHunterIo(criteria, apiKey);
    }

    // Fallback to mock data if API key not configured
    console.log('Hunter.io API key not configured, using mock data');
    return searchLeadsFromMockData(criteria);
  } catch (error) {
    console.error('Error searching for leads:', error);
    // Fallback to mock data on error
    return searchLeadsFromMockData(criteria);
  }
}

/**
 * Search leads using Hunter.io API
 */
async function searchLeadsFromHunterIo(
  criteria: LeadDiscoveryCriteria,
  apiKey: string
): Promise<DiscoveredLead[]> {
  try {
    // Use keywords to search domain (first keyword as domain search)
    let domain = criteria.keywords?.[0]?.toLowerCase() || 'example.com';
    
    // Add .com if not already a full domain
    if (!domain.includes('.')) {
      domain = domain + '.com';
    }
    
    console.log(`Searching Hunter.io for domain: ${domain}`);

    const response = await axios.get('https://api.hunter.io/v2/domain-search', {
      params: {
        domain: domain,
        limit: criteria.limit || 10,
      },
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const hunterLeads = response.data.data.emails || [];
    console.log(`Found ${hunterLeads.length} leads from Hunter.io`);

    // Transform Hunter.io response to DiscoveredLead format
    const leads: DiscoveredLead[] = hunterLeads
      .map((email: any) => ({
        email: email.value,
        first_name: email.first_name || 'Unknown',
        last_name: email.last_name || 'User',
        company: domain,
        phone: email.phone_number || undefined,
      }))
      .filter((lead: any) => lead.email); // Remove empty emails

    // Apply additional filters
    return applyFilters(leads, criteria);
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.error('Hunter.io API key invalid or expired');
    }
    throw error;
  }
}

/**
 * Search leads from mock database
 */
function searchLeadsFromMockData(criteria: LeadDiscoveryCriteria): DiscoveredLead[] {
  let results = [...MOCK_LEADS_DATABASE];
  return applyFilters(results, criteria);
}

/**
 * Apply filters to leads
 */
function applyFilters(
  leads: DiscoveredLead[],
  criteria: LeadDiscoveryCriteria
): DiscoveredLead[] {
  let results = [...leads];

  // Filter by keywords in company name and email domain
  if (criteria.keywords && criteria.keywords.length > 0) {
    results = results.filter((lead) => {
      const searchText = `${lead.company || ''} ${lead.email}`.toLowerCase();
      return criteria.keywords!.some((kw) => searchText.includes(kw.toLowerCase()));
    });
  }

  // Filter by company size (mock implementation)
  if (criteria.companySize) {
    results = results.filter((_lead) => {
      // Mock: randomly assign sizes
      const mockSize = ['small', 'medium', 'large'][Math.floor(Math.random() * 3)];
      return mockSize === criteria.companySize;
    });
  }

  // Filter by location (mock implementation)
  if (criteria.location) {
    // In real implementation, use IP or database location info
    results = results.filter((_lead) => true); // Mock: return all
  }

  // Apply limit
  const limit = criteria.limit || 10;
  return results.slice(0, limit);
}

/**
 * Check if a lead already exists in the database
 */
export async function leadExists(email: string): Promise<boolean> {
  try {
    const result = await query('SELECT id FROM leads WHERE LOWER(email) = LOWER($1)', [email]);
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking lead existence:', error);
    throw error;
  }
}

/**
 * Discover and create new leads from external sources
 */
export async function discoverAndCreateLeads(
  criteria: LeadDiscoveryCriteria
): Promise<{ created: number; skipped: number; leads: any[] }> {
  try {
    console.log('Starting lead discovery with criteria:', criteria);

    // Search for leads
    const discoveredLeads = await searchLeads(criteria);
    console.log(`Found ${discoveredLeads.length} potential leads`);

    const createdLeads = [];
    let created = 0;
    let skipped = 0;

    // Create new leads that don't already exist
    for (const discoveredLead of discoveredLeads) {
      try {
        const exists = await leadExists(discoveredLead.email);

        if (exists) {
          console.log(`Lead ${discoveredLead.email} already exists, skipping`);
          skipped++;
          continue;
        }

        // Create the lead
        const newLead = await leadsService.createLead({
          email: discoveredLead.email,
          first_name: discoveredLead.first_name,
          last_name: discoveredLead.last_name,
          company: discoveredLead.company,
          phone: discoveredLead.phone,
        });

        console.log(`Created lead: ${newLead.id} (${newLead.email})`);
        createdLeads.push(newLead);
        created++;
      } catch (error) {
        console.error(`Error creating lead ${discoveredLead.email}:`, error);
        skipped++;
      }
    }

    console.log(`Lead discovery complete. Created: ${created}, Skipped: ${skipped}`);
    return { created, skipped, leads: createdLeads };
  } catch (error) {
    console.error('Error in discoverAndCreateLeads:', error);
    throw error;
  }
}

/**
 * Save a lead discovery configuration
 */
export async function saveDiscoveryConfig(config: LeadDiscoveryConfig): Promise<LeadDiscoveryConfig> {
  try {
    const { name, criteria, is_active, run_frequency } = config;
    const criteriaJson = JSON.stringify(criteria);

    const result = await query(
      `INSERT INTO lead_discovery_configs (name, criteria, is_active, run_frequency)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, criteria, is_active, run_frequency, created_at, updated_at`,
      [name, criteriaJson, is_active, run_frequency || 24]
    );

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      criteria: typeof row.criteria === 'string' ? JSON.parse(row.criteria) : row.criteria,
      is_active: row.is_active,
      run_frequency: row.run_frequency,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  } catch (error) {
    console.error('Error saving discovery config:', error);
    throw error;
  }
}

/**
 * Get all discovery configurations
 */
export async function getDiscoveryConfigs(): Promise<LeadDiscoveryConfig[]> {
  try {
    const result = await query('SELECT * FROM lead_discovery_configs ORDER BY created_at DESC');
    return result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      criteria: typeof row.criteria === 'string' ? JSON.parse(row.criteria) : row.criteria,
      is_active: row.is_active,
      run_frequency: row.run_frequency,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  } catch (error) {
    console.error('Error getting discovery configs:', error);
    throw error;
  }
}

/**
 * Get a specific discovery configuration
 */
export async function getDiscoveryConfig(id: string): Promise<LeadDiscoveryConfig | null> {
  try {
    const result = await query('SELECT * FROM lead_discovery_configs WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      criteria: typeof row.criteria === 'string' ? JSON.parse(row.criteria) : row.criteria,
      is_active: row.is_active,
      run_frequency: row.run_frequency,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  } catch (error) {
    console.error('Error getting discovery config:', error);
    throw error;
  }
}

/**
 * Update a discovery configuration
 */
export async function updateDiscoveryConfig(
  id: string,
  config: Partial<LeadDiscoveryConfig>
): Promise<LeadDiscoveryConfig> {
  try {
    const { name, criteria, is_active, run_frequency } = config;
    const criteriaJson = criteria ? JSON.stringify(criteria) : undefined;

    const result = await query(
      `UPDATE lead_discovery_configs
       SET name = COALESCE($1, name),
           criteria = COALESCE($2, criteria),
           is_active = COALESCE($3, is_active),
           run_frequency = COALESCE($4, run_frequency),
           updated_at = NOW()
       WHERE id = $5
       RETURNING id, name, criteria, is_active, run_frequency, created_at, updated_at`,
      [name, criteriaJson, is_active, run_frequency, id]
    );

    if (result.rows.length === 0) {
      throw new Error('Discovery config not found');
    }

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      criteria: typeof row.criteria === 'string' ? JSON.parse(row.criteria) : row.criteria,
      is_active: row.is_active,
      run_frequency: row.run_frequency,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  } catch (error) {
    console.error('Error updating discovery config:', error);
    throw error;
  }
}

/**
 * Delete a discovery configuration
 */
export async function deleteDiscoveryConfig(id: string): Promise<void> {
  try {
    await query('DELETE FROM lead_discovery_configs WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting discovery config:', error);
    throw error;
  }
}
