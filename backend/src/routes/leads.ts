import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import * as leadsController from '../controllers/leadsController';

const router = Router();

router.get('/', asyncHandler(leadsController.getAllLeads));
router.get('/:id', asyncHandler(leadsController.getLeadById));
router.post('/', asyncHandler(leadsController.createLead));
router.put('/:id', asyncHandler(leadsController.updateLead));
router.delete('/:id', asyncHandler(leadsController.deleteLead));

export default router;
