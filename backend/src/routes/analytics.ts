import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import * as analyticsController from '../controllers/analyticsController';

const router = Router();

router.get('/overview', asyncHandler(analyticsController.getOverview));
router.get('/campaigns/:campaignId', asyncHandler(analyticsController.getCampaignStats));
router.get('/leads/:leadId', asyncHandler(analyticsController.getLeadStats));

export default router;
