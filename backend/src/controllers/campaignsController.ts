import { Request, Response } from 'express';
import * as campaignsService from '../services/campaignsService';

export async function getAllCampaigns(_req: Request, res: Response): Promise<void> {
  const campaigns = await campaignsService.getAllCampaigns();
  res.json(campaigns);
}

export async function getCampaignById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const campaign = await campaignsService.getCampaignById(id);
  if (!campaign) {
    res.status(404).json({ error: 'Campaign not found' });
    return;
  }
  res.json(campaign);
}

export async function createCampaign(req: Request, res: Response): Promise<void> {
  const campaign = await campaignsService.createCampaign(req.body);
  res.status(201).json(campaign);
}

export async function updateCampaign(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const campaign = await campaignsService.updateCampaign(id, req.body);
  res.json(campaign);
}

export async function deleteCampaign(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  await campaignsService.deleteCampaign(id);
  res.status(204).send();
}

export async function startCampaign(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const campaign = await campaignsService.startCampaign(id);
  res.json(campaign);
}

export async function pauseCampaign(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const campaign = await campaignsService.pauseCampaign(id);
  res.json(campaign);
}
