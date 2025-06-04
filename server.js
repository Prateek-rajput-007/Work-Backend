const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const chapterRoutes = require('./routes/chapters');
const connectDB = require('./config/db');
const { connectRedis, redisClient } = require('./config/redis');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, logger } = require('./utils/logger');

dotenv.config();

const app = express();

// Trust Render's proxy
app.set('trust proxy', 1);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Chapter Performance Dashboard API' });
});

app.use(requestLogger);
app.use(express.json());
app.use('/api/v1/chapters', chapterRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  logger.info('Shutting down...');
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
  await mongoose.connection.close();
  process.exit(0);
});

startServer();
