import { Request, Response } from 'express';
import * as analyticsService from '../services/analyticsService';

export async function getOverview(_req: Request, res: Response): Promise<void> {
  const overview = await analyticsService.getOverview();
  res.json(overview);
}

export async function getCampaignStats(req: Request, res: Response): Promise<void> {
  const { campaignId } = req.params;
  const stats = await analyticsService.getCampaignStats(campaignId);
  res.json(stats);
}

export async function getLeadStats(req: Request, res: Response): Promise<void> {
  const { leadId } = req.params;
  const stats = await analyticsService.getLeadStats(leadId);
  res.json(stats);
}
