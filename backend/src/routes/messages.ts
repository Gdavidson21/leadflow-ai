import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import * as messagesController from '../controllers/messagesController';

const router = Router();

router.get('/', asyncHandler(messagesController.getAllMessages));
router.get('/:id', asyncHandler(messagesController.getMessageById));
router.post('/', asyncHandler(messagesController.createMessage));
router.delete('/:id', asyncHandler(messagesController.deleteMessage));

export default router;
