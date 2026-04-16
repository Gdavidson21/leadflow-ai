import { Request, Response } from 'express';
import * as messagesService from '../services/messagesService';

export async function getAllMessages(_req: Request, res: Response): Promise<void> {
  const messages = await messagesService.getAllMessages();
  res.json(messages);
}

export async function getMessageById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const message = await messagesService.getMessageById(id);
  if (!message) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }
  res.json(message);
}

export async function createMessage(req: Request, res: Response): Promise<void> {
  const message = await messagesService.createMessage(req.body);
  res.status(201).json(message);
}

export async function deleteMessage(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  await messagesService.deleteMessage(id);
  res.status(204).send();
}
