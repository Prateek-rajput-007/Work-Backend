const express = require('express');
const router = express.Router();
const { getChapters, getChapterById, uploadChapters } = require('../controllers/chapterController');
const authMiddleware = require('../middlewares/auth');
const limiter = require('../middlewares/rateLimiter');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', limiter, getChapters);
router.get('/:id', limiter, getChapterById);
router.post('/', limiter, authMiddleware, upload.single('file'), uploadChapters);

module.exports = router;