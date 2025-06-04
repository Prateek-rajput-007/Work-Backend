const { redisClient } = require('../config/redis');
const { logger } = require('../utils/logger');

const cache = async (key, ttl, fetchData) => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const data = await fetchData();
    await redisClient.setEx(key, ttl, JSON.stringify(data));
    return data;
  } catch (error) {
    logger.error('Cache error:', error);
    return fetchData(); // Fallback to fetching data if Redis fails
  }
};

const invalidateCache = async (key) => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    await redisClient.del(key);
  } catch (error) {
    logger.error('Cache invalidation error:', error);
  }
};

module.exports = { cache, invalidateCache };