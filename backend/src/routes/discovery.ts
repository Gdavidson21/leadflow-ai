import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import * as leadDiscoveryController from '../controllers/leadDiscoveryController';

const router = Router();

// Discover leads with criteria
router.post('/discover', asyncHandler(leadDiscoveryController.discoverLeads));

// Get all discovery configurations
router.get('/configs', asyncHandler(leadDiscoveryController.getDiscoveryConfigs));

// Create a new discovery configuration
router.post('/configs', asyncHandler(leadDiscoveryController.createDiscoveryConfig));

// Get a specific discovery configuration
router.get('/configs/:id', asyncHandler(leadDiscoveryController.getDiscoveryConfig));

// Update a discovery configuration
router.put('/configs/:id', asyncHandler(leadDiscoveryController.updateDiscoveryConfig));

// Delete a discovery configuration
router.delete('/configs/:id', asyncHandler(leadDiscoveryController.deleteDiscoveryConfig));

export default router;
