const { logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Server error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
};

module.exports = errorHandler;