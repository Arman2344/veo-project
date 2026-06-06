const express = require('express');
const fb = require('../services/facebookService');

const router = express.Router();

// GET /api/posts — دریافت لیست پست‌ها
router.get('/', async (req, res, next) => {
  try {
    const { limit = 10, after } = req.query;
    const data = await fb.getPosts(Number(limit), after);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// POST /api/posts — انتشار پست جدید
router.post('/', async (req, res, next) => {
  try {
    const { message, link, scheduledTime } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'message is required' });
    }
    const data = await fb.publishPost({ message, link, scheduledTime });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/posts/:postId — حذف پست
router.delete('/:postId', async (req, res, next) => {
  try {
    const data = await fb.deletePost(req.params.postId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/:postId/insights — آمار یک پست
router.get('/:postId/insights', async (req, res, next) => {
  try {
    const data = await fb.getPostInsights(req.params.postId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
