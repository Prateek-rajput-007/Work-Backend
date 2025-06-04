const Chapter = require('../models/Chapter');
const { redisClient } = require('../config/redis');
const { logger } = require('../utils/logger');

const getChapters = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, subject, class: className, status, weakChapters } = req.query;
    const cacheKey = `chapters:${page}:${limit}:${subject || ''}:${className || ''}:${status || ''}:${weakChapters || ''}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      logger.info(`Cache hit for ${cacheKey}`);
      return res.json(JSON.parse(cachedData));
    }

    const query = {};
    if (subject) query.subject = subject;
    if (className) query.class = className;
    if (status) query.status = status;
    if (weakChapters) query.isWeakChapter = weakChapters === 'true';

    const chapters = await Chapter.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Chapter.countDocuments(query);

    const response = { data: chapters, total, page: parseInt(page), limit: parseInt(limit) };

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(response));
    logger.info(`Cache set for ${cacheKey}`);

    res.json(response);
  } catch (error) {
    logger.error('Error fetching chapters:', error);
    next(error);
  }
};

const getChapterById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `chapter:${id}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      logger.info(`Cache hit for ${cacheKey}`);
      return res.json(JSON.parse(cachedData));
    }

    const chapter = await Chapter.findById(id).lean();
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(chapter));
    logger.info(`Cache set for ${cacheKey}`);

    res.json(chapter);
  } catch (error) {
    logger.error('Error fetching chapter by ID:', error);
    next(error);
  }
};

const uploadChapters = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const chaptersData = JSON.parse(req.file.buffer.toString());
    const results = { added: 0, failed: [] };

    for (const chapter of chaptersData) {
      try {
        const validStatuses = ['Not Started', 'In Progress', 'Completed'];
        if (!validStatuses.includes(chapter.status)) {
          throw new Error(`Invalid status: ${chapter.status}`);
        }
        if (typeof chapter.questionSolved !== 'number' || chapter.questionSolved < 0) {
          throw new Error('Invalid questionSolved value');
        }
        if (!chapter.yearWiseQuestionCount || typeof chapter.yearWiseQuestionCount !== 'object') {
          throw new Error('Invalid yearWiseQuestionCount');
        }

        const existingChapter = await Chapter.findOne({
          subject: chapter.subject,
          chapter: chapter.chapter,
          class: chapter.class,
        });

        if (existingChapter) {
          results.failed.push({ chapter, error: 'Duplicate chapter' });
          continue;
        }

        await Chapter.create(chapter);
        results.added += 1;
      } catch (error) {
        results.failed.push({ chapter, error: error.message });
      }
    }

    try {
      const keys = await redisClient.keys('chapters:*');
      if (keys.length > 0) {
        await redisClient.del(keys);
        logger.info('Cache invalidated after chapter upload');
      }
    } catch (error) {
      logger.error('Cache invalidation error:', error);
    }

    res.json({
      message: 'Chapters processed',
      added: results.added,
      failed: results.failed,
    });
  } catch (error) {
    logger.error('Error uploading chapters:', error);
    next(error);
  }
};

module.exports = { getChapters, getChapterById, uploadChapters };