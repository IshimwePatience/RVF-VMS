const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', err => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

// Only connect once
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Could not connect to Redis:', error);
  }
})();

module.exports = redisClient;
