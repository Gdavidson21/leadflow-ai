import { Router } from 'express';
import leadsRouter from './leads';
import messagesRouter from './messages';
import campaignsRouter from './campaigns';
import analyticsRouter from './analytics';
import discoveryRouter from './discovery';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ message: 'Leadflow AI API', version: '1.0.0' });
});

router.use('/leads', leadsRouter);
router.use('/messages', messagesRouter);
router.use('/campaigns', campaignsRouter);
router.use('/analytics', analyticsRouter);
router.use('/discovery', discoveryRouter);

export default router;
