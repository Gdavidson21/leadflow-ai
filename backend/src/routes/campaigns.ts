import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import * as campaignsController from '../controllers/campaignsController';

const router = Router();

router.get('/', asyncHandler(campaignsController.getAllCampaigns));
router.get('/:id', asyncHandler(campaignsController.getCampaignById));
router.post('/', asyncHandler(campaignsController.createCampaign));
router.put('/:id', asyncHandler(campaignsController.updateCampaign));
router.delete('/:id', asyncHandler(campaignsController.deleteCampaign));
router.post('/:id/start', asyncHandler(campaignsController.startCampaign));
router.post('/:id/pause', asyncHandler(campaignsController.pauseCampaign));

export default router;
