import { Request, Response } from 'express';
import * as leadDiscoveryService from '../services/leadDiscoveryService';

/**
 * Discover leads with given criteria
 */
export async function discoverLeads(req: Request, res: Response): Promise<void> {
  try {
    const { industry, keywords, location, companySize, limit } = req.body;

    const criteria = {
      industry,
      keywords,
      location,
      companySize,
      limit: limit || 10,
    };

    const result = await leadDiscoveryService.discoverAndCreateLeads(criteria);
    res.status(201).json({
      message: 'Lead discovery completed',
      ...result,
    });
  } catch (error) {
    console.error('Error discovering leads:', error);
    res.status(500).json({ error: 'Failed to discover leads' });
  }
}

/**
 * Get all discovery configurations
 */
export async function getDiscoveryConfigs(_req: Request, res: Response): Promise<void> {
  try {
    const configs = await leadDiscoveryService.getDiscoveryConfigs();
    res.json(configs);
  } catch (error) {
    console.error('Error getting discovery configs:', error);
    res.status(500).json({ error: 'Failed to get discovery configurations' });
  }
}

/**
 * Create a new discovery configuration
 */
export async function createDiscoveryConfig(req: Request, res: Response): Promise<void> {
  try {
    const { name, criteria, is_active, run_frequency } = req.body;

    if (!name || !criteria) {
      res.status(400).json({ error: 'Name and criteria are required' });
      return;
    }

    const config = await leadDiscoveryService.saveDiscoveryConfig({
      name,
      criteria,
      is_active: is_active !== false,
      run_frequency,
    });

    res.status(201).json(config);
  } catch (error) {
    console.error('Error creating discovery config:', error);
    res.status(500).json({ error: 'Failed to create discovery configuration' });
  }
}

/**
 * Get a specific discovery configuration
 */
export async function getDiscoveryConfig(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const config = await leadDiscoveryService.getDiscoveryConfig(id);

    if (!config) {
      res.status(404).json({ error: 'Discovery configuration not found' });
      return;
    }

    res.json(config);
  } catch (error) {
    console.error('Error getting discovery config:', error);
    res.status(500).json({ error: 'Failed to get discovery configuration' });
  }
}

/**
 * Update a discovery configuration
 */
export async function updateDiscoveryConfig(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { name, criteria, is_active, run_frequency } = req.body;

    const config = await leadDiscoveryService.updateDiscoveryConfig(id, {
      name,
      criteria,
      is_active,
      run_frequency,
    });

    res.json(config);
  } catch (error) {
    console.error('Error updating discovery config:', error);
    if ((error as any).message === 'Discovery config not found') {
      res.status(404).json({ error: 'Discovery configuration not found' });
    } else {
      res.status(500).json({ error: 'Failed to update discovery configuration' });
    }
  }
}

/**
 * Delete a discovery configuration
 */
export async function deleteDiscoveryConfig(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await leadDiscoveryService.deleteDiscoveryConfig(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting discovery config:', error);
    res.status(500).json({ error: 'Failed to delete discovery configuration' });
  }
}
