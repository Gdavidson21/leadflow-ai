import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient: any = null;

export async function initializeRedis(): Promise<any> {
  if (redisClient) {
    return redisClient;
  }

  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });

  redisClient.on('error', (err: Error) => {
    console.error('Redis Client Error', err);
  });

  await redisClient.connect();
  return redisClient;
}

export function getRedisClient(): any {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}
