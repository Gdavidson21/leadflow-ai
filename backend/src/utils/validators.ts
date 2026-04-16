// Validation schemas using Joi

import Joi from 'joi';

export const createLeadSchema = Joi.object({
  email: Joi.string().email().required(),
  first_name: Joi.string().min(2).required(),
  last_name: Joi.string().min(2).required(),
  phone: Joi.string().optional(),
  company: Joi.string().optional(),
});

export const updateLeadSchema = Joi.object({
  email: Joi.string().email().optional(),
  first_name: Joi.string().min(2).optional(),
  last_name: Joi.string().min(2).optional(),
  phone: Joi.string().optional(),
  company: Joi.string().optional(),
  status: Joi.string().valid('new', 'contacted', 'interested', 'converted', 'rejected').optional(),
});

export const createCampaignSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  message_template: Joi.string().optional(),
  sends_per_day: Joi.number().min(1).max(1000).optional(),
});

export const updateCampaignSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  message_template: Joi.string().optional(),
  sends_per_day: Joi.number().min(1).max(1000).optional(),
});

export const createMessageSchema = Joi.object({
  lead_id: Joi.string().uuid().required(),
  campaign_id: Joi.string().uuid().required(),
  content: Joi.string().required(),
  generated: Joi.boolean().optional(),
});

export function validate(schema: Joi.Schema, obj: any) {
  const { error, value } = schema.validate(obj);
  if (error) {
    throw {
      status: 400,
      message: error.details[0].message,
    };
  }
  return value;
}
