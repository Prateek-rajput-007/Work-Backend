const { logger } = require('../utils/logger');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.error('Authorization header missing or invalid');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  if (token !== process.env.ADMIN_TOKEN) {
    logger.error('Invalid admin token');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};

module.exports = authMiddleware;