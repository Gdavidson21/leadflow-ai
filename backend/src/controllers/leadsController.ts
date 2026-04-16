import { Request, Response } from 'express';
import * as leadsService from '../services/leadsService';

export async function getAllLeads(_req: Request, res: Response): Promise<void> {
  const leads = await leadsService.getAllLeads();
  res.json(leads);
}

export async function getLeadById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const lead = await leadsService.getLeadById(id);
  if (!lead) {
    res.status(404).json({ error: 'Lead not found' });
    return;
  }
  res.json(lead);
}

export async function createLead(req: Request, res: Response): Promise<void> {
  const lead = await leadsService.createLead(req.body);
  res.status(201).json(lead);
}

export async function updateLead(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const lead = await leadsService.updateLead(id, req.body);
  res.json(lead);
}

export async function deleteLead(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  await leadsService.deleteLead(id);
  res.status(204).send();
}
