import Bull from 'bull';
import { getRedisClient } from '../config/redis';
import * as messagesService from '../services/messagesService';
import * as leadsService from '../services/leadsService';
import * as campaignsService from '../services/campaignsService';
import * as leadDiscoveryService from '../services/leadDiscoveryService';

let messageSendQueue: Bull.Queue | null = null;
let campaignProcessQueue: Bull.Queue | null = null;
let leadDiscoveryQueue: Bull.Queue | null = null;

export async function initializeJobs(): Promise<void> {
  await getRedisClient();

  // Message send queue
  messageSendQueue = new Bull('send-messages', {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
  });

  messageSendQueue.process(async (job: any) => {
    const { lead_id, campaign_id } = job.data;
    console.log(`Processing message send job for lead ${lead_id}`);

    try {
      // Get lead and campaign info
      const lead = await leadsService.getLeadById(lead_id);
      const campaign = await campaignsService.getCampaignById(campaign_id);

      if (!lead || !campaign) {
        throw new Error('Lead or campaign not found');
      }

      // Generate message using OpenAI
      const messageContent = await messagesService.generateMessage(
        lead_id,
        `${lead.first_name} ${lead.last_name} from ${lead.company}`,
        campaign.description || ''
      );

      // Create message record
      const message = await messagesService.createMessage({
        lead_id,
        campaign_id,
        content: messageContent,
        generated: true,
      });

      console.log(`Message created successfully: ${message.id}`);
      return { success: true, messageId: message.id };
    } catch (error) {
      console.error('Error processing message send job:', error);
      throw error;
    }
  });

  // Campaign processor queue
  campaignProcessQueue = new Bull('campaign-processor', {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
  });

  campaignProcessQueue.process(async (job: any) => {
    console.log(`Processing active campaigns`);

    try {
      // Get ALL active campaigns instead of trying to fetch "all" as an ID
      const campaigns = await campaignsService.getAllCampaigns();
      const activeCampaigns = campaigns.filter((c: any) => c.status === 'running');
      
      console.log(`Found ${activeCampaigns.length} active campaigns`);

      // TODO: Implement campaign lead selection and queueing logic
      for (const campaign of activeCampaigns) {
        console.log(`Processing campaign ${campaign.id}: ${campaign.name}`);
      }

      return { success: true, campaignsProcessed: activeCampaigns.length };
    } catch (error) {
      console.error('Error processing campaigns:', error);
      throw error;
    }
  });

  // Add repeat job to process active campaigns every minute
  await campaignProcessQueue.add(
    { },  // No specific campaign_id needed - processor fetches all active
    {
      repeat: {
        every: 60000, // Every minute
      },
    }
  );

  // Lead discovery queue
  leadDiscoveryQueue = new Bull('lead-discovery', {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
  });

  leadDiscoveryQueue.process(async (job: any) => {
    const { config_id } = job.data;
    console.log(`Processing lead discovery for config ${config_id}`);

    try {
      const config = await leadDiscoveryService.getDiscoveryConfig(config_id);
      if (!config || !config.is_active) {
        return { success: false, reason: 'Configuration not found or inactive' };
      }

      // Run discovery for this configuration
      const result = await leadDiscoveryService.discoverAndCreateLeads(config.criteria);
      console.log(`Lead discovery completed for config ${config_id}: Created ${result.created} leads`);
      return { success: true, ...result };
    } catch (error) {
      console.error('Error processing lead discovery:', error);
      throw error;
    }
  });

  // Add repeat job to run active discovery configs every 24 hours
  await leadDiscoveryQueue.add(
    { config_id: 'all' },
    {
      repeat: {
        every: 24 * 60 * 60 * 1000, // Every 24 hours
      },
    }
  );

  console.log('✓ Bull queues initialized');
}

export function getMessageSendQueue(): Bull.Queue {
  if (!messageSendQueue) {
    throw new Error('Message send queue not initialized');
  }
  return messageSendQueue;
}

export function getCampaignProcessQueue(): Bull.Queue {
  if (!campaignProcessQueue) {
    throw new Error('Campaign process queue not initialized');
  }
  return campaignProcessQueue;
}

export function getLeadDiscoveryQueue(): Bull.Queue {
  if (!leadDiscoveryQueue) {
    throw new Error('Lead discovery queue not initialized');
  }
  return leadDiscoveryQueue;
}
