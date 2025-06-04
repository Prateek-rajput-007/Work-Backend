const redis = require('redis');
require('dotenv').config();
const { logger } = require('../utils/logger');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false, // Development only
  },
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('Redis connected successfully');
});

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      logger.info('Redis connection established');
    }
  } catch (error) {
    logger.error('Redis connection error:', error);
    throw error;
  }
};

module.exports = { redisClient, connectRedis };